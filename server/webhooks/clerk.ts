/**
 * Clerk Webhook Handler
 * 
 * Handles Clerk webhooks for user lifecycle events:
 * - user.created: Create user in DB
 * - user.updated: Update user in DB
 * - user.deleted: Handle user deletion
 * 
 * This ensures our database stays in sync with Clerk's user data.
 */
import { Request, Response, Router } from 'express';
import { Webhook } from 'svix';
import * as db from '../db';

const router = Router();

// Clerk webhook secret from environment
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{
      id: string;
      email_address: string;
      verification: { status: string };
    }>;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    created_at?: number;
    updated_at?: number;
  };
}

/**
 * Verify Clerk webhook signature using Svix
 */
function verifyWebhook(req: Request): ClerkWebhookEvent | null {
  if (!CLERK_WEBHOOK_SECRET) {
    console.error('[Clerk Webhook] CLERK_WEBHOOK_SECRET not configured');
    return null;
  }

  const svixId = req.headers['svix-id'] as string;
  const svixTimestamp = req.headers['svix-timestamp'] as string;
  const svixSignature = req.headers['svix-signature'] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('[Clerk Webhook] Missing Svix headers');
    return null;
  }

  try {
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    const payload = wh.verify(JSON.stringify(req.body), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent;
    return payload;
  } catch (error) {
    console.error('[Clerk Webhook] Signature verification failed:', error);
    return null;
  }
}

/**
 * Handle user.created event
 */
async function handleUserCreated(data: ClerkWebhookEvent['data']) {
  const primaryEmail = data.email_addresses?.find(
    (e) => e.verification?.status === 'verified'
  )?.email_address;

  const fullName = [data.first_name, data.last_name]
    .filter(Boolean)
    .join(' ') || null;

  try {
    await db.upsertUser({
      openId: `clerk_${data.id}`, // Use clerk_ prefix for Clerk users
      name: fullName,
      email: primaryEmail || null,
      loginMethod: 'clerk',
      lastSignedIn: new Date(),
    });

    console.log(`[Clerk Webhook] User created: ${data.id}`);
  } catch (error) {
    console.error('[Clerk Webhook] Failed to create user:', error);
    throw error;
  }
}

/**
 * Handle user.updated event
 */
async function handleUserUpdated(data: ClerkWebhookEvent['data']) {
  const primaryEmail = data.email_addresses?.find(
    (e) => e.verification?.status === 'verified'
  )?.email_address;

  const fullName = [data.first_name, data.last_name]
    .filter(Boolean)
    .join(' ') || null;

  try {
    await db.upsertUser({
      openId: `clerk_${data.id}`,
      name: fullName,
      email: primaryEmail || null,
      loginMethod: 'clerk',
      lastSignedIn: new Date(),
    });

    console.log(`[Clerk Webhook] User updated: ${data.id}`);
  } catch (error) {
    console.error('[Clerk Webhook] Failed to update user:', error);
    throw error;
  }
}

/**
 * Handle user.deleted event
 */
async function handleUserDeleted(data: ClerkWebhookEvent['data']) {
  // For PIPEDA compliance, we don't delete user data immediately
  // Instead, we could mark the user as deleted or anonymize
  console.log(`[Clerk Webhook] User deletion requested: ${data.id}`);
  // TODO: Implement soft delete or anonymization
}

/**
 * Main webhook endpoint
 */
router.post('/api/webhooks/clerk', async (req: Request, res: Response) => {
  // Verify webhook signature
  const event = verifyWebhook(req);
  
  if (!event) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  console.log(`[Clerk Webhook] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;
      case 'user.updated':
        await handleUserUpdated(event.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;
      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Clerk Webhook] Error processing event:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
