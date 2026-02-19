import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import zlib from "zlib";

// setupVite uses dynamic imports for 'vite' and 'vite.config' so they are NOT
// bundled by esbuild --packages=external in production builds.
export async function setupVite(app: Express, server: Server) {
  const viteModule = await import("vite");
  const createViteServer = viteModule.createServer;

  // Let Vite read vite.config.ts directly from disk instead of importing it,
  // which would pull vite + all its plugins into the esbuild server bundle.
  const vite = await createViteServer({
    configFile: path.resolve(import.meta.dirname, "../../vite.config.ts"),
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true as const,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * Lightweight gzip compression middleware for static assets.
 * Only compresses text-based content types (JS, CSS, HTML, JSON, SVG).
 * Uses a pre-built cache to avoid re-compressing on every request.
 */
const gzipCache = new Map<string, Buffer>();

function compressionMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const acceptEncoding = req.headers["accept-encoding"] || "";
  if (!acceptEncoding.includes("gzip")) {
    return next();
  }

  // Only intercept for known compressible types
  const ext = path.extname(req.path).toLowerCase();
  const compressible = [".js", ".css", ".html", ".json", ".svg", ".txt", ".xml", ".map"];
  if (!compressible.includes(ext)) {
    return next();
  }

  // Override res.send/res.end to compress on the fly
  const originalEnd = res.end.bind(res);
  const originalSend = res.send.bind(res);

  // We'll let express.static handle the file, then compress the response
  // Instead, we set the header and let the next middleware handle it
  // A simpler approach: use Node's built-in compression on the static middleware
  next();
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Pre-compress static assets at startup for better concurrent performance
  preCompressAssets(distPath);

  // Serve pre-compressed .gz files when available
  app.use((req, res, next) => {
    const acceptEncoding = req.headers["accept-encoding"] || "";
    if (!acceptEncoding.includes("gzip")) {
      return next();
    }

    const ext = path.extname(req.path).toLowerCase();
    const compressible = [".js", ".css", ".html", ".json", ".svg", ".txt", ".xml"];
    if (!compressible.includes(ext)) {
      return next();
    }

    const gzPath = path.join(distPath, req.path + ".gz");
    if (fs.existsSync(gzPath)) {
      // Determine content type
      const mimeTypes: Record<string, string> = {
        ".js": "application/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".txt": "text/plain",
        ".xml": "application/xml",
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";

      res.set({
        "Content-Encoding": "gzip",
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Vary": "Accept-Encoding",
      });
      return res.sendFile(gzPath);
    }

    next();
  });

  // Serve static files with aggressive caching for hashed assets
  app.use(
    express.static(distPath, {
      maxAge: "1y",
      immutable: true,
      etag: true,
      lastModified: true,
      // Set index to false to avoid directory listing
      index: false,
    })
  );

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

/**
 * Pre-compress all compressible static assets at server startup.
 * This avoids on-the-fly compression overhead during concurrent requests.
 */
function preCompressAssets(distPath: string) {
  const compressible = [".js", ".css", ".html", ".json", ".svg", ".txt", ".xml"];

  function walkDir(dir: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (compressible.includes(ext)) {
            const gzPath = fullPath + ".gz";
            // Only compress if .gz doesn't exist or is older than source
            if (
              !fs.existsSync(gzPath) ||
              fs.statSync(gzPath).mtimeMs < fs.statSync(fullPath).mtimeMs
            ) {
              try {
                const content = fs.readFileSync(fullPath);
                const compressed = zlib.gzipSync(content, { level: 9 });
                fs.writeFileSync(gzPath, compressed);
                const ratio = ((1 - compressed.length / content.length) * 100).toFixed(0);
                console.log(
                  `[Static] Pre-compressed ${entry.name} (${(content.length / 1024).toFixed(0)}KB → ${(compressed.length / 1024).toFixed(0)}KB, -${ratio}%)`
                );
              } catch (err) {
                console.warn(`[Static] Failed to compress ${entry.name}:`, err);
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[Static] Failed to walk directory ${dir}:`, err);
    }
  }

  console.log(`[Static] Pre-compressing assets in ${distPath}...`);
  walkDir(distPath);
  console.log(`[Static] Pre-compression complete.`);
}
