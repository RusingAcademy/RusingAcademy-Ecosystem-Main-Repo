/**
 * Transactional Email Templates — Learner Lifecycle
 * RusingÂcademy Learning Ecosystem
 * 
 * 8 bilingual (FR/EN) transactional email templates covering:
 * 1. Enrollment Confirmation (course purchase)
 * 2. Course Completion Certificate
 * 3. Quiz Results Summary
 * 4. Streak Milestone (7d, 30d, 100d)
 * 5. Trial Expiring Reminder
 * 6. Invoice/Receipt
 * 7. Coach Assignment Notification
 * 8. HR Compliance Deadline Alert
 * 
 * All templates use the shared EMAIL_BRANDING and generateEmailFooter.
 * @copyright Rusinga International Consulting Ltd.
 */
import { sendEmail } from "./email";
import { EMAIL_BRANDING, generateEmailHeader, generateEmailFooter, wrapEmailContent } from "./email-branding";

// ─────────────────────────────────────────────────────────────────────────────
// 1. ENROLLMENT CONFIRMATION
// ─────────────────────────────────────────────────────────────────────────────

interface EnrollmentConfirmationData {
  learnerName: string;
  learnerEmail: string;
  courseName: string;
  courseNameFr?: string;
  courseSlug: string;
  price: number; // in cents, 0 for free
  language: "en" | "fr";
}

export async function sendEnrollmentConfirmation(data: EnrollmentConfirmationData): Promise<boolean> {
  const { learnerName, learnerEmail, courseName, courseNameFr, courseSlug, price, language } = data;
  const isEn = language === "en";
  const displayName = isEn ? courseName : (courseNameFr || courseName);
  const isFree = price === 0;
  const priceDisplay = isFree ? (isEn ? "Free" : "Gratuit") : `$${(price / 100).toFixed(2)} CAD`;

  const subject = isEn
    ? `Welcome to "${displayName}" — You're Enrolled!`
    : `Bienvenue dans « ${displayName} » — Vous êtes inscrit(e) !`;

  const html = wrapEmailContent(`
    ${generateEmailHeader(
      isEn ? "Enrollment Confirmed" : "Inscription confirmée",
      isEn ? "Your learning journey begins now" : "Votre parcours d'apprentissage commence maintenant"
    )}
    <div style="padding: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <p style="color: ${EMAIL_BRANDING.colors.text}; font-size: 16px; margin-bottom: 8px;">
        ${isEn ? `Hello ${learnerName},` : `Bonjour ${learnerName},`}
      </p>
      <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        ${isEn
          ? `You have been successfully enrolled in <strong>${displayName}</strong>. Your course materials are ready and waiting for you.`
          : `Vous avez été inscrit(e) avec succès au cours <strong>${displayName}</strong>. Vos documents de cours sont prêts et vous attendent.`
        }
      </p>
      <div style="background: ${EMAIL_BRANDING.colors.light}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px;">${isEn ? "Course" : "Cours"}</td>
            <td style="padding: 8px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 13px; font-weight: 600; text-align: right;">${displayName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px;">${isEn ? "Price" : "Prix"}</td>
            <td style="padding: 8px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 13px; font-weight: 600; text-align: right;">${priceDisplay}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px;">${isEn ? "Status" : "Statut"}</td>
            <td style="padding: 8px 0; color: #16a34a; font-size: 13px; font-weight: 600; text-align: right;">${isEn ? "Active" : "Actif"}</td>
          </tr>
        </table>
      </div>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="https://rusingacademy.com/courses/${courseSlug}" style="display: inline-block; background: ${EMAIL_BRANDING.colors.primary}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          ${isEn ? "Start Learning Now" : "Commencer à apprendre"}
        </a>
      </div>
    </div>
    ${generateEmailFooter(language)}
  `);

  return sendEmail({ to: learnerEmail, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. COURSE COMPLETION CERTIFICATE
// ─────────────────────────────────────────────────────────────────────────────

interface CourseCompletionData {
  learnerName: string;
  learnerEmail: string;
  courseName: string;
  courseNameFr?: string;
  completionDate: Date;
  certificateUrl?: string;
  language: "en" | "fr";
}

export async function sendCourseCompletionEmail(data: CourseCompletionData): Promise<boolean> {
  const { learnerName, learnerEmail, courseName, courseNameFr, completionDate, certificateUrl, language } = data;
  const isEn = language === "en";
  const displayName = isEn ? courseName : (courseNameFr || courseName);
  const dateStr = completionDate.toLocaleDateString(isEn ? "en-CA" : "fr-CA", { year: "numeric", month: "long", day: "numeric" });

  const subject = isEn
    ? `Congratulations! You've Completed "${displayName}"`
    : `Félicitations ! Vous avez terminé « ${displayName} »`;

  const html = wrapEmailContent(`
    ${generateEmailHeader(
      isEn ? "Course Completed!" : "Cours terminé !",
      isEn ? "Your achievement has been recorded" : "Votre réalisation a été enregistrée"
    )}
    <div style="padding: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 50%; line-height: 80px; font-size: 40px;">🏆</div>
      </div>
      <p style="color: ${EMAIL_BRANDING.colors.text}; font-size: 16px; text-align: center; margin-bottom: 8px;">
        ${isEn ? `Congratulations, ${learnerName}!` : `Félicitations, ${learnerName} !`}
      </p>
      <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 24px;">
        ${isEn
          ? `You have successfully completed <strong>${displayName}</strong> on ${dateStr}. This is a significant milestone in your bilingual journey.`
          : `Vous avez terminé avec succès <strong>${displayName}</strong> le ${dateStr}. C'est une étape importante dans votre parcours bilingue.`
        }
      </p>
      ${certificateUrl ? `
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${certificateUrl}" style="display: inline-block; background: ${EMAIL_BRANDING.colors.primary}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          ${isEn ? "Download Certificate" : "Télécharger le certificat"}
        </a>
      </div>` : ""}
      <div style="text-align: center;">
        <a href="https://rusingacademy.com/courses" style="color: ${EMAIL_BRANDING.colors.primary}; text-decoration: none; font-size: 14px; font-weight: 500;">
          ${isEn ? "Explore More Courses →" : "Explorer d'autres cours →"}
        </a>
      </div>
    </div>
    ${generateEmailFooter(language)}
  `);

  return sendEmail({ to: learnerEmail, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. QUIZ RESULTS SUMMARY
// ─────────────────────────────────────────────────────────────────────────────

interface QuizResultsData {
  learnerName: string;
  learnerEmail: string;
  quizTitle: string;
  quizTitleFr?: string;
  score: number; // percentage 0-100
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  language: "en" | "fr";
}

export async function sendQuizResultsEmail(data: QuizResultsData): Promise<boolean> {
  const { learnerName, learnerEmail, quizTitle, quizTitleFr, score, totalQuestions, correctAnswers, passed, language } = data;
  const isEn = language === "en";
  const displayTitle = isEn ? quizTitle : (quizTitleFr || quizTitle);
  const statusColor = passed ? "#16a34a" : "#dc2626";
  const statusText = passed ? (isEn ? "Passed" : "Réussi") : (isEn ? "Needs Review" : "À revoir");

  const subject = isEn
    ? `Quiz Results: ${displayTitle} — ${score}%`
    : `Résultats du quiz : ${displayTitle} — ${score} %`;

  const html = wrapEmailContent(`
    ${generateEmailHeader(
      isEn ? "Quiz Results" : "Résultats du quiz",
      displayTitle
    )}
    <div style="padding: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <p style="color: ${EMAIL_BRANDING.colors.text}; font-size: 16px; margin-bottom: 24px;">
        ${isEn ? `Hello ${learnerName},` : `Bonjour ${learnerName},`}
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 100px; height: 100px; border-radius: 50%; border: 6px solid ${statusColor}; line-height: 88px; font-size: 28px; font-weight: 700; color: ${statusColor};">
          ${score}%
        </div>
        <p style="color: ${statusColor}; font-weight: 600; font-size: 14px; margin-top: 8px;">${statusText}</p>
      </div>
      <div style="background: ${EMAIL_BRANDING.colors.light}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px;">${isEn ? "Correct Answers" : "Bonnes réponses"}</td>
            <td style="padding: 8px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 13px; font-weight: 600; text-align: right;">${correctAnswers} / ${totalQuestions}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px;">${isEn ? "Score" : "Score"}</td>
            <td style="padding: 8px 0; color: ${statusColor}; font-size: 13px; font-weight: 600; text-align: right;">${score}%</td>
          </tr>
        </table>
      </div>
      <div style="text-align: center;">
        <a href="https://rusingacademy.com/dashboard" style="display: inline-block; background: ${EMAIL_BRANDING.colors.primary}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          ${isEn ? "Continue Learning" : "Continuer à apprendre"}
        </a>
      </div>
    </div>
    ${generateEmailFooter(language)}
  `);

  return sendEmail({ to: learnerEmail, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STREAK MILESTONE
// ─────────────────────────────────────────────────────────────────────────────

interface StreakMilestoneData {
  learnerName: string;
  learnerEmail: string;
  streakDays: number; // 7, 30, 100, etc.
  language: "en" | "fr";
}

export async function sendStreakMilestoneEmail(data: StreakMilestoneData): Promise<boolean> {
  const { learnerName, learnerEmail, streakDays, language } = data;
  const isEn = language === "en";

  const milestoneEmoji = streakDays >= 100 ? "💎" : streakDays >= 30 ? "🔥" : "⭐";

  const subject = isEn
    ? `${milestoneEmoji} ${streakDays}-Day Streak! Keep Going, ${learnerName}!`
    : `${milestoneEmoji} Série de ${streakDays} jours ! Continuez, ${learnerName} !`;

  const html = wrapEmailContent(`
    ${generateEmailHeader(
      isEn ? `${streakDays}-Day Streak!` : `Série de ${streakDays} jours !`,
      isEn ? "Your consistency is paying off" : "Votre constance porte ses fruits"
    )}
    <div style="padding: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
      <div style="font-size: 64px; margin-bottom: 16px;">${milestoneEmoji}</div>
      <h2 style="color: ${EMAIL_BRANDING.colors.text}; font-size: 24px; margin-bottom: 8px;">
        ${isEn ? `${streakDays} Days Strong!` : `${streakDays} jours de suite !`}
      </h2>
      <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 14px; line-height: 1.6; max-width: 400px; margin: 0 auto 24px;">
        ${isEn
          ? `Incredible, ${learnerName}! You've studied for ${streakDays} consecutive days. This level of dedication puts you in the top tier of RusingAcademy learners.`
          : `Incroyable, ${learnerName} ! Vous avez étudié pendant ${streakDays} jours consécutifs. Ce niveau de dévouement vous place parmi les meilleurs apprenants de RusingAcademy.`
        }
      </p>
      <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 24px;">
        <span style="color: white; font-size: 14px; font-weight: 600;">
          ${isEn ? `🏅 ${streakDays}-Day Streak Badge Earned` : `🏅 Badge de série de ${streakDays} jours obtenu`}
        </span>
      </div>
      <div>
        <a href="https://rusingacademy.com/dashboard" style="display: inline-block; background: ${EMAIL_BRANDING.colors.primary}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          ${isEn ? "Keep Your Streak Going" : "Maintenez votre série"}
        </a>
      </div>
    </div>
    ${generateEmailFooter(language)}
  `);

  return sendEmail({ to: learnerEmail, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TRIAL EXPIRING REMINDER
// ─────────────────────────────────────────────────────────────────────────────

interface TrialExpiringData {
  learnerName: string;
  learnerEmail: string;
  daysRemaining: number;
  planName: string;
  planNameFr?: string;
  upgradeUrl: string;
  language: "en" | "fr";
}

export async function sendTrialExpiringEmail(data: TrialExpiringData): Promise<boolean> {
  const { learnerName, learnerEmail, daysRemaining, planName, planNameFr, upgradeUrl, language } = data;
  const isEn = language === "en";
  const displayPlan = isEn ? planName : (planNameFr || planName);

  const subject = isEn
    ? `Your Trial Ends in ${daysRemaining} Day${daysRemaining > 1 ? "s" : ""} — Don't Lose Access`
    : `Votre essai se termine dans ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""} — Ne perdez pas l'accès`;

  const html = wrapEmailContent(`
    ${generateEmailHeader(
      isEn ? "Trial Ending Soon" : "Essai bientôt terminé",
      isEn ? `${daysRemaining} day${daysRemaining > 1 ? "s" : ""} remaining` : `${daysRemaining} jour${daysRemaining > 1 ? "s" : ""} restant${daysRemaining > 1 ? "s" : ""}`
    )}
    <div style="padding: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <p style="color: ${EMAIL_BRANDING.colors.text}; font-size: 16px; margin-bottom: 24px;">
        ${isEn ? `Hello ${learnerName},` : `Bonjour ${learnerName},`}
      </p>
      <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <span style="font-size: 32px;">⏰</span>
        <p style="color: #92400e; font-weight: 600; font-size: 16px; margin: 8px 0 4px;">
          ${isEn ? `${daysRemaining} Day${daysRemaining > 1 ? "s" : ""} Left` : `${daysRemaining} Jour${daysRemaining > 1 ? "s" : ""} Restant${daysRemaining > 1 ? "s" : ""}`}
        </p>
        <p style="color: #92400e; font-size: 13px;">
          ${isEn
            ? `Your free trial of <strong>${displayPlan}</strong> is ending soon.`
            : `Votre essai gratuit de <strong>${displayPlan}</strong> se termine bientôt.`
          }
        </p>
      </div>
      <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        ${isEn
          ? "Upgrade now to keep access to all your courses, progress tracking, SLE exam preparation, and AI-powered practice tools."
          : "Passez à la version payante maintenant pour conserver l'accès à tous vos cours, au suivi de progression, à la préparation aux examens ELS et aux outils de pratique alimentés par l'IA."
        }
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${upgradeUrl}" style="display: inline-block; background: ${EMAIL_BRANDING.colors.primary}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          ${isEn ? "Upgrade Now" : "Passer à la version payante"}
        </a>
      </div>
    </div>
    ${generateEmailFooter(language)}
  `);

  return sendEmail({ to: learnerEmail, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. INVOICE / RECEIPT
// ─────────────────────────────────────────────────────────────────────────────

interface InvoiceReceiptData {
  learnerName: string;
  learnerEmail: string;
  invoiceNumber: string;
  items: Array<{ name: string; nameFr?: string; amount: number }>; // amount in cents
  subtotal: number; // cents
  tax: number; // cents (HST 13%)
  total: number; // cents
  paymentDate: Date;
  paymentMethod: string; // "Visa ending in 4242"
  language: "en" | "fr";
}

export async function sendInvoiceReceiptEmail(data: InvoiceReceiptData): Promise<boolean> {
  const { learnerName, learnerEmail, invoiceNumber, items, subtotal, tax, total, paymentDate, paymentMethod, language } = data;
  const isEn = language === "en";
  const dateStr = paymentDate.toLocaleDateString(isEn ? "en-CA" : "fr-CA", { year: "numeric", month: "long", day: "numeric" });
  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)} CAD`;

  const subject = isEn
    ? `Receipt — Invoice #${invoiceNumber}`
    : `Reçu — Facture n° ${invoiceNumber}`;

  const itemRows = items.map(item => `
    <tr>
      <td style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 13px; border-bottom: 1px solid #f3f4f6;">
        ${isEn ? item.name : (item.nameFr || item.name)}
      </td>
      <td style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #f3f4f6;">
        ${fmt(item.amount)}
      </td>
    </tr>
  `).join("");

  const html = wrapEmailContent(`
    ${generateEmailHeader(
      isEn ? "Payment Receipt" : "Reçu de paiement",
      `${isEn ? "Invoice" : "Facture"} #${invoiceNumber}`
    )}
    <div style="padding: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <p style="color: ${EMAIL_BRANDING.colors.text}; font-size: 16px; margin-bottom: 24px;">
        ${isEn ? `Hello ${learnerName},` : `Bonjour ${learnerName},`}
      </p>
      <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 14px; margin-bottom: 24px;">
        ${isEn
          ? `Thank you for your payment. Here is your receipt for the transaction on ${dateStr}.`
          : `Merci pour votre paiement. Voici votre reçu pour la transaction du ${dateStr}.`
        }
      </p>
      <div style="background: ${EMAIL_BRANDING.colors.light}; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 12px; text-align: left; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e7eb;">
              ${isEn ? "Item" : "Article"}
            </th>
            <th style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 12px; text-align: right; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e7eb;">
              ${isEn ? "Amount" : "Montant"}
            </th>
          </tr>
          ${itemRows}
          <tr>
            <td style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px;">${isEn ? "Subtotal" : "Sous-total"}</td>
            <td style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 13px; text-align: right;">${fmt(subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px;">HST (13%)</td>
            <td style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 13px; text-align: right;">${fmt(tax)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 15px; font-weight: 700; border-top: 2px solid #e5e7eb;">${isEn ? "Total" : "Total"}</td>
            <td style="padding: 10px 0; color: ${EMAIL_BRANDING.colors.text}; font-size: 15px; font-weight: 700; text-align: right; border-top: 2px solid #e5e7eb;">${fmt(total)}</td>
          </tr>
        </table>
      </div>
      <div style="background: ${EMAIL_BRANDING.colors.light}; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
        <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 12px; margin: 0;">
          ${isEn ? "Payment Method" : "Mode de paiement"}: <strong style="color: ${EMAIL_BRANDING.colors.text};">${paymentMethod}</strong>
        </p>
      </div>
      <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 12px; line-height: 1.5;">
        ${isEn
          ? `This receipt was issued by ${EMAIL_BRANDING.company.legalName}. For questions about this charge, please contact support@rusingacademy.com.`
          : `Ce reçu a été émis par ${EMAIL_BRANDING.company.legalName}. Pour toute question concernant ce prélèvement, veuillez contacter support@rusingacademy.com.`
        }
      </p>
    </div>
    ${generateEmailFooter(language)}
  `);

  return sendEmail({ to: learnerEmail, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. COACH ASSIGNMENT NOTIFICATION
// ─────────────────────────────────────────────────────────────────────────────

interface CoachAssignmentData {
  learnerName: string;
  learnerEmail: string;
  coachName: string;
  coachBio?: string;
  coachBioFr?: string;
  coachPhotoUrl?: string;
  firstSessionDate?: Date;
  language: "en" | "fr";
}

export async function sendCoachAssignmentEmail(data: CoachAssignmentData): Promise<boolean> {
  const { learnerName, learnerEmail, coachName, coachBio, coachBioFr, coachPhotoUrl, firstSessionDate, language } = data;
  const isEn = language === "en";
  const bio = isEn ? coachBio : (coachBioFr || coachBio);
  const dateStr = firstSessionDate
    ? firstSessionDate.toLocaleDateString(isEn ? "en-CA" : "fr-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : null;

  const subject = isEn
    ? `Meet Your Coach: ${coachName}`
    : `Rencontrez votre coach : ${coachName}`;

  const html = wrapEmailContent(`
    ${generateEmailHeader(
      isEn ? "Coach Assigned" : "Coach assigné",
      isEn ? "Your personalized learning journey begins" : "Votre parcours d'apprentissage personnalisé commence"
    )}
    <div style="padding: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <p style="color: ${EMAIL_BRANDING.colors.text}; font-size: 16px; margin-bottom: 24px;">
        ${isEn ? `Hello ${learnerName},` : `Bonjour ${learnerName},`}
      </p>
      <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        ${isEn
          ? `Great news! You've been assigned a dedicated language coach to guide your bilingual development.`
          : `Bonne nouvelle ! Un coach linguistique dédié vous a été assigné pour guider votre développement bilingue.`
        }
      </p>
      <div style="background: ${EMAIL_BRANDING.colors.light}; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
        ${coachPhotoUrl ? `<img src="${coachPhotoUrl}" alt="${coachName}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 12px;" />` : ""}
        <h3 style="color: ${EMAIL_BRANDING.colors.text}; font-size: 18px; margin: 0 0 4px;">${coachName}</h3>
        ${bio ? `<p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 13px; line-height: 1.5; max-width: 350px; margin: 0 auto;">${bio}</p>` : ""}
      </div>
      ${dateStr ? `
      <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="color: #065f46; font-size: 13px; margin: 0;">
          ${isEn ? "First Session" : "Première session"}: <strong>${dateStr}</strong>
        </p>
      </div>` : ""}
      <div style="text-align: center;">
        <a href="https://rusingacademy.com/dashboard" style="display: inline-block; background: ${EMAIL_BRANDING.colors.primary}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          ${isEn ? "View Your Dashboard" : "Voir votre tableau de bord"}
        </a>
      </div>
    </div>
    ${generateEmailFooter(language)}
  `);

  return sendEmail({ to: learnerEmail, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. HR COMPLIANCE DEADLINE ALERT
// ─────────────────────────────────────────────────────────────────────────────

interface HRComplianceAlertData {
  hrContactName: string;
  hrContactEmail: string;
  organizationName: string;
  deadlineDate: Date;
  participantsAtRisk: number;
  totalParticipants: number;
  complianceType: string; // "SLE Oral B", "SLE Written C", etc.
  language: "en" | "fr";
}

export async function sendHRComplianceAlertEmail(data: HRComplianceAlertData): Promise<boolean> {
  const { hrContactName, hrContactEmail, organizationName, deadlineDate, participantsAtRisk, totalParticipants, complianceType, language } = data;
  const isEn = language === "en";
  const dateStr = deadlineDate.toLocaleDateString(isEn ? "en-CA" : "fr-CA", { year: "numeric", month: "long", day: "numeric" });
  const riskPercentage = Math.round((participantsAtRisk / totalParticipants) * 100);

  const subject = isEn
    ? `⚠️ Compliance Alert: ${complianceType} Deadline Approaching — ${organizationName}`
    : `⚠️ Alerte de conformité : Échéance ${complianceType} approchante — ${organizationName}`;

  const html = wrapEmailContent(`
    ${generateEmailHeader(
      isEn ? "Compliance Deadline Alert" : "Alerte d'échéance de conformité",
      `${complianceType} — ${organizationName}`
    )}
    <div style="padding: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <p style="color: ${EMAIL_BRANDING.colors.text}; font-size: 16px; margin-bottom: 24px;">
        ${isEn ? `Hello ${hrContactName},` : `Bonjour ${hrContactName},`}
      </p>
      <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="text-align: center; margin-bottom: 12px;">
          <span style="font-size: 32px;">⚠️</span>
        </div>
        <p style="color: #991b1b; font-weight: 600; font-size: 15px; text-align: center; margin: 0 0 8px;">
          ${isEn ? `${complianceType} Deadline: ${dateStr}` : `Échéance ${complianceType} : ${dateStr}`}
        </p>
        <p style="color: #991b1b; font-size: 13px; text-align: center; margin: 0;">
          ${isEn
            ? `${participantsAtRisk} of ${totalParticipants} participants (${riskPercentage}%) may not meet the deadline.`
            : `${participantsAtRisk} sur ${totalParticipants} participants (${riskPercentage} %) pourraient ne pas respecter l'échéance.`
          }
        </p>
      </div>
      <p style="color: ${EMAIL_BRANDING.colors.muted}; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        ${isEn
          ? "We recommend reviewing the at-risk participants and considering additional coaching sessions or practice assignments to help them meet the compliance requirements."
          : "Nous recommandons de revoir les participants à risque et d'envisager des sessions de coaching supplémentaires ou des exercices pratiques pour les aider à respecter les exigences de conformité."
        }
      </p>
      <div style="text-align: center;">
        <a href="https://rusingacademy.com/hr/portal/compliance" style="display: inline-block; background: ${EMAIL_BRANDING.colors.primary}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          ${isEn ? "View Compliance Dashboard" : "Voir le tableau de conformité"}
        </a>
      </div>
    </div>
    ${generateEmailFooter(language)}
  `);

  return sendEmail({ to: hrContactEmail, subject, html });
}
