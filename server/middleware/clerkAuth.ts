/**
 * Clerk Authentication Middleware
 * 
 * This middleware verifies Clerk session tokens and attaches user info to requests.
 * It provides a unified auth check that works with both Clerk and legacy OAuth.
 */
import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/backend';

// Initialize Clerk client
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = clerkSecretKey ? createClerkClient({ secretKey: clerkSecretKey }) : null;

export interface ClerkAuthRequest extends Request {
  auth?: {
    userId: string | null;
    sessionId: string | null;
    isAuthenticated: boolean;
    authProvider: 'clerk' | 'legacy' | null;
  };
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

  return null;
}

/**
 * Verify Clerk session and attach user info to request
 */
export async function clerkAuthMiddleware(
  req: ClerkAuthRequest,
  res: Response,
  next: NextFunction
) {
  // Initialize auth object
  req.auth = {
    userId: null,
    sessionId: null,
    isAuthenticated: false,
    authProvider: null,
  };

  // If Clerk is not configured, skip to next middleware
  if (!clerkClient) {
    return next();
  }

  const token = extractClerkToken(req);
  if (!token) {
    return next();
  }

  try {
    // Verify the session token
    const session = await clerkClient.verifyToken(token);
    
    if (session) {
      req.auth = {
        userId: session.sub,
        sessionId: session.sid || null,
        isAuthenticated: true,
        authProvider: 'clerk',
      };
    }
  } catch (error) {
    // Token verification failed - user is not authenticated via Clerk
    // This is not an error, just means they might be using legacy auth
    console.debug('[Clerk Auth] Token verification failed:', error);
  }

  next();
}

/**
 * Require authentication middleware
 * Returns 401 if user is not authenticated via any method
 */
export function requireAuth(
  req: ClerkAuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.auth?.isAuthenticated) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

/**
 * Require specific role middleware
 */
export function requireRole(...roles: string[]) {
  return async (req: ClerkAuthRequest, res: Response, next: NextFunction) => {
    if (!req.auth?.isAuthenticated) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // TODO: Fetch user role from database and check
    // For now, just pass through if authenticated
    next();
  };
}

export default clerkAuthMiddleware;
