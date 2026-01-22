/**
 * Lead Capture Routes
 * 
 * API routes for capturing leads from the Diagnostic Quiz
 * and storing them in the Admin Dashboard CRM.
 * 
 * @module leadCaptureRoutes
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { leads, diagnosticResults } from '../db/schema';
import { marketingAutomationService } from '../services/marketingAutomationService';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const router = Router();

// Types
interface DiagnosticQuizSubmission {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organization?: string;
  currentLevel: string;
  targetLevel: string;
  examDate?: string;
  responses: QuizResponse[];
  scores: {
    reading: number;
    writing: number;
    oral: number;
    overall: number;
  };
  recommendedProgram: string;
}

interface QuizResponse {
  questionId: string;
  category: 'reading' | 'writing' | 'oral';
  answer: string;
  isCorrect: boolean;
}

interface Lead {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organization?: string;
  leadSource: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  tags: string[];
  diagnosticScore?: number;
  recommendedProgram?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

/**
 * POST /api/leads/diagnostic
 * Capture a lead from the Diagnostic Quiz submission
 */
router.post('/diagnostic', async (req: Request, res: Response) => {
  try {
    const submission: DiagnosticQuizSubmission = req.body;

    // Validate required fields
    if (!submission.email || !submission.firstName || !submission.lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, first name, and last name are required',
      });
    }

    // Generate unique IDs
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const diagnosticId = `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create lead record
    const lead: Lead = {
      id: leadId,
      email: submission.email,
      firstName: submission.firstName,
      lastName: submission.lastName,
      phone: submission.phone,
      organization: submission.organization,
      leadSource: 'diagnostic_quiz',
      status: 'new',
      tags: ['diagnostic_quiz', `target_${submission.targetLevel}`, submission.recommendedProgram],
      diagnosticScore: submission.scores.overall,
      recommendedProgram: submission.recommendedProgram,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store lead in database
    await db.insert(leads).values(lead);

    // Store diagnostic results
    await db.insert(diagnosticResults).values({
      id: diagnosticId,
      leadId,
      currentLevel: submission.currentLevel,
      targetLevel: submission.targetLevel,
      examDate: submission.examDate,
      scores: JSON.stringify(submission.scores),
      responses: JSON.stringify(submission.responses),
      recommendedProgram: submission.recommendedProgram,
      createdAt: new Date().toISOString(),
    });

    // Start marketing automation sequence
    await marketingAutomationService.startDiagnosticSequence({
      leadId,
      email: submission.email,
      firstName: submission.firstName,
      lastName: submission.lastName,
      diagnosticScore: submission.scores.overall,
      recommendedProgram: submission.recommendedProgram,
      targetLevel: submission.targetLevel,
    });

    // Log lead capture for analytics
    console.log(`[LeadCapture] New lead captured: ${leadId} from diagnostic_quiz`);

    res.status(201).json({
      success: true,
      leadId,
      diagnosticId,
      message: 'Lead captured successfully. Diagnostic report will be sent via email.',
    });
  } catch (error) {
    console.error('[LeadCapture] Error capturing lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to capture lead. Please try again.',
    });
  }
});

/**
 * GET /api/leads
 * Get all leads for Admin Dashboard (with pagination and filters)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, source, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Build query with filters
    let query = db.select().from(leads);

    if (status) {
      query = query.where(eq(leads.status, status as string));
    }

    if (source) {
      query = query.where(eq(leads.leadSource, source as string));
    }

    // Execute query with pagination
    const results = await query.limit(Number(limit)).offset(offset);

    // Get total count
    const totalCount = await db.select({ count: count() }).from(leads);

    res.json({
      success: true,
      data: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / Number(limit)),
      },
    });
  } catch (error) {
    console.error('[LeadCapture] Error fetching leads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads',
    });
  }
});

/**
 * GET /api/leads/:id
 * Get a specific lead by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lead = await db.select().from(leads).where(eq(leads.id, id)).limit(1);

    if (!lead.length) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
      });
    }

    // Get associated diagnostic results
    const diagnostic = await db
      .select()
      .from(diagnosticResults)
      .where(eq(diagnosticResults.leadId, id))
      .limit(1);

    res.json({
      success: true,
      data: {
        ...lead[0],
        diagnostic: diagnostic[0] || null,
      },
    });
  } catch (error) {
    console.error('[LeadCapture] Error fetching lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead',
    });
  }
});

/**
 * PATCH /api/leads/:id
 * Update lead status or add notes
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, tags } = req.body;

    const updateData: Partial<Lead> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (tags) updateData.tags = tags;

    await db.update(leads).set(updateData).where(eq(leads.id, id));

    res.json({
      success: true,
      message: 'Lead updated successfully',
    });
  } catch (error) {
    console.error('[LeadCapture] Error updating lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update lead',
    });
  }
});

/**
 * GET /api/leads/analytics/summary
 * Get lead analytics for Admin Dashboard
 */
router.get('/analytics/summary', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get counts by status
    const statusCounts = await db
      .select({
        status: leads.status,
        count: count(),
      })
      .from(leads)
      .groupBy(leads.status);

    // Get counts by source
    const sourceCounts = await db
      .select({
        source: leads.leadSource,
        count: count(),
      })
      .from(leads)
      .groupBy(leads.leadSource);

    // Get recent leads count (last 30 days)
    const recentLeads = await db
      .select({ count: count() })
      .from(leads)
      .where(gte(leads.createdAt, thirtyDaysAgo.toISOString()));

    // Calculate conversion rate
    const converted = statusCounts.find((s) => s.status === 'converted')?.count || 0;
    const total = statusCounts.reduce((sum, s) => sum + s.count, 0);
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(2) : '0.00';

    res.json({
      success: true,
      data: {
        totalLeads: total,
        recentLeads: recentLeads[0].count,
        conversionRate: `${conversionRate}%`,
        byStatus: statusCounts,
        bySource: sourceCounts,
      },
    });
  } catch (error) {
    console.error('[LeadCapture] Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

export default router;
