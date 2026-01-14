/**
 * Clerk Authentication Middleware
 * 
 * This middleware verifies Clerk session tokens and resolves the Clerk user
 * to the internal users.id for database operations.
 * 
 * Flow:
 * 1. Extract Clerk token from request (Bearer or __session cookie)
 * 2. Verify token using @clerk/backend
 * 3. Get clerkUserId from verified token
 * 4. Look up internal user by clerkUserId
 * 5. Set req.userId (internal) and req.clerkUserId on request
 */
import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/backend';
import { getUserByClerkId } from '../db';

// Initialize Clerk client
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = clerkSecretKey ? createClerkClient({ secretKey: clerkSecretKey }) : null;

// Bilingual error messages
const errors = {
  authRequired: {
    en: "Authentication required",
    fr: "Authentification requise"
  },
  userNotFound: {
    en: "User not found. Please sign up first.",
    fr: "Utilisateur non trouvé. Veuillez d'abord vous inscrire."
  },
  invalidToken: {
    en: "Invalid or expired session. Please sign in again.",
    fr: "Session invalide ou expirée. Veuillez vous reconnecter."
  }
};

export interface ClerkAuthRequest extends Request {
  auth?: {
    userId: number | null;        // Internal users.id
    clerkUserId: string | null;   // Clerk user ID
    sessionId: string | null;
    isAuthenticated: boolean;
    authProvider: 'clerk' | 'legacy' | null;
  };
  userId?: number;      // Convenience property for internal user ID
  clerkUserId?: string; // Convenience property for Clerk user ID
}

/**
 * Extract Clerk session token from request
 */
function extractClerkToken(req: Request): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check __session cookie (Clerk's default cookie name)
  const sessionCookie = req.cookies?.__session;
  if (sessionCookie) {
    return sessionCookie;
  }

  // Check __clerk_db_jwt cookie (alternative Clerk cookie)
  const clerkDbJwt = req.cookies?.__clerk_db_jwt;
  if (clerkDbJwt) {
    return clerkDbJwt;
  }

  return null;
}

/**
 * Verify Clerk session and attach user info to request
 * This is a "soft" middleware that doesn't require auth
 */
export async function clerkAuthMiddleware(
  req: ClerkAuthRequest,
  res: Response,
  next: NextFunction
) {
  // Initialize auth object
  req.auth = {
    userId: null,
    clerkUserId: null,
    sessionId: null,
    isAuthenticated: false,
    authProvider: null,
  };

  // If Clerk is not configured, skip to next middleware
  if (!clerkClient) {
    console.debug('[Clerk Auth] Clerk not configured, skipping');
    return next();
  }

  const token = extractClerkToken(req);
  if (!token) {
    return next();
  }

  try {
    // Verify the session token
    const session = await clerkClient.verifyToken(token);
    
    if (session && session.sub) {
      const clerkUserId = session.sub;
      
      // Look up internal user by Clerk ID
      const user = await getUserByClerkId(clerkUserId);
      
      if (user) {
        req.auth = {
          userId: user.id,
          clerkUserId: clerkUserId,
          sessionId: session.sid || null,
          isAuthenticated: true,
          authProvider: 'clerk',
        };
        
        // Set convenience properties
        req.userId = user.id;
        req.clerkUserId = clerkUserId;
        
        console.debug(`[Clerk Auth] Authenticated user: ${user.id} (clerk: ${clerkUserId})`);
      } else {
        // User exists in Clerk but not in our DB yet
        // This can happen if webhook hasn't fired yet
        console.debug(`[Clerk Auth] Clerk user ${clerkUserId} not found in DB`);
        
        // Still set clerkUserId so we can create user if needed
        req.auth = {
          userId: null,
          clerkUserId: clerkUserId,
          sessionId: session.sid || null,
          isAuthenticated: false,
          authProvider: 'clerk',
        };
        req.clerkUserId = clerkUserId;
      }
    }
  } catch (error) {
    // Token verification failed - user is not authenticated via Clerk
    console.debug('[Clerk Auth] Token verification failed:', (error as Error).message);
  }

  next();
}

/**
 * Require Clerk authentication middleware
 * Returns 401 if user is not authenticated or not found in DB
 */
export function requireClerkAuth(
  req: ClerkAuthRequest,
  res: Response,
  next: NextFunction
) {
  // Check if authenticated via Clerk
  if (!req.auth?.isAuthenticated) {
    return res.status(401).json({ 
      error: errors.authRequired
    });
  }

  // Check if user exists in our database
  if (!req.auth.userId) {
    return res.status(401).json({ 
      error: errors.userNotFound
    });
  }

  // Set convenience properties if not already set
  if (!req.userId) {
    req.userId = req.auth.userId;
  }
  if (!req.clerkUserId) {
    req.clerkUserId = req.auth.clerkUserId || undefined;
  }

  next();
}

/**
 * Require authentication middleware (supports both Clerk and legacy)
 * Returns 401 if user is not authenticated via any method
 */
export function requireAuth(
  req: ClerkAuthRequest,
  res: Response,
  next: NextFunction
) {
  // Check Clerk auth first
  if (req.auth?.isAuthenticated && req.auth.userId) {
    req.userId = req.auth.userId;
    return next();
  }

  // Check legacy session token
  const legacyUserId = (req as any).userId;
  if (legacyUserId) {
    return next();
  }

  return res.status(401).json({ 
    error: errors.authRequired
  });
}

/**
 * Require specific role middleware
 */
export function requireRole(...roles: string[]) {
  return async (req: ClerkAuthRequest, res: Response, next: NextFunction) => {
    if (!req.auth?.isAuthenticated || !req.auth.userId) {
      return res.status(401).json({ 
        error: errors.authRequired
      });
    }

    // TODO: Fetch user role from database and check
    // For now, just pass through if authenticated
    next();
  };
}

export default clerkAuthMiddleware;
