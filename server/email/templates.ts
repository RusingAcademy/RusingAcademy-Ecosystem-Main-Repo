/**
 * Email Templates Module
 * 
 * Provides bilingual (EN/FR) email templates for:
 * - Purchase confirmation
 * - Booking confirmation
 * - Session reminders
 * - Diagnostic completion
 */

// ============================================================================
// Base Template
// ============================================================================

const BASE_STYLES = `
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; text-align: center; }
    .header img { height: 40px; }
    .header h1 { color: #ffffff; margin: 16px 0 0 0; font-size: 24px; }
    .content { padding: 32px; }
    .content h2 { color: #1f2937; font-size: 20px; margin-top: 24px; }
    .content p { color: #4b5563; line-height: 1.6; }
    .cta-button { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .cta-button:hover { background: #1d4ed8; }
    .info-box { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
    .info-box h3 { color: #1e40af; margin: 0 0 8px 0; font-size: 16px; }
    .info-box p { margin: 0; color: #1e40af; }
    .feature-list { list-style: none; padding: 0; }
    .feature-list li { padding: 8px 0; color: #4b5563; }
    .feature-list li::before { content: "✓"; color: #10b981; font-weight: bold; margin-right: 8px; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { color: #6b7280; font-size: 12px; margin: 4px 0; }
    .footer a { color: #2563eb; text-decoration: none; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  </style>
`;

function wrapTemplate(content: string, preheader?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${BASE_STYLES}
    </head>
    <body>
      ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
      <div class="container">
        ${content}
      </div>
    </body>
    </html>
  `;
}

// ============================================================================
// Purchase Confirmation Template
// ============================================================================

interface PurchaseConfirmationData {
  customerName: string;
  offerName: string;
  coachingHours: number;
  price: string;
  currency: string;
  includesDiagnostic: boolean;
  includesLearningPlan: boolean;
  simulationsIncluded: number;
  dashboardUrl: string;
}

export function getPurchaseConfirmationEmail(
  data: PurchaseConfirmationData,
  locale: 'en' | 'fr'
): { subject: string; html: string; text: string } {
  const isEn = locale === 'en';

  const subject = isEn
    ? `Your ${data.offerName} Purchase Confirmation`
    : `Confirmation de votre achat ${data.offerName}`;

  const content = isEn
    ? `
      <div class="header">
        <h1>Thank You for Your Purchase!</h1>
      </div>
      <div class="content">
        <p>Dear ${data.customerName},</p>
        <p>Your purchase of <strong>${data.offerName}</strong> has been confirmed and your coaching package is now active.</p>
        
        <div class="info-box">
          <h3>Purchase Summary</h3>
          <p><strong>Package:</strong> ${data.offerName}</p>
          <p><strong>Coaching Hours:</strong> ${data.coachingHours} hours</p>
          <p><strong>Amount Paid:</strong> ${data.price} ${data.currency}</p>
        </div>

        <h2>What's Included</h2>
        <ul class="feature-list">
          <li><strong>${data.coachingHours} hours</strong> of expert SLE coaching</li>
          ${data.includesDiagnostic ? '<li>Strategic Language Diagnostic</li>' : ''}
          ${data.includesLearningPlan ? '<li>Personalized Learning Plan</li>' : ''}
          ${data.simulationsIncluded > 0 ? `<li>${data.simulationsIncluded} exam simulation(s)</li>` : ''}
          <li>Unlimited AI Coach access</li>
        </ul>

        <h2>Your Next Steps</h2>
        <ol>
          <li><strong>Complete Your Diagnostic</strong> - Start with a strategic assessment to identify your strengths and areas for improvement.</li>
          <li><strong>Review Your Learning Plan</strong> - Access your personalized roadmap designed to help you achieve your target level.</li>
          <li><strong>Book Your First Session</strong> - Schedule a coaching session with one of our expert SLE coaches.</li>
        </ol>

        <p style="text-align: center;">
          <a href="${data.dashboardUrl}" class="cta-button">Go to Your Dashboard</a>
        </p>

        <hr class="divider">
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br><strong>The Lingueefy Team</strong></p>
      </div>
      <div class="footer">
        <p>© 2026 Rusinga International Consulting Ltd.</p>
        <p><a href="https://app.rusingacademy.ca/en/privacy">Privacy Policy</a> | <a href="https://app.rusingacademy.ca/en/terms">Terms of Service</a></p>
      </div>
    `
    : `
      <div class="header">
        <h1>Merci pour votre achat!</h1>
      </div>
      <div class="content">
        <p>Cher(e) ${data.customerName},</p>
        <p>Votre achat de <strong>${data.offerName}</strong> a été confirmé et votre forfait de coaching est maintenant actif.</p>
        
        <div class="info-box">
          <h3>Résumé de l'achat</h3>
          <p><strong>Forfait:</strong> ${data.offerName}</p>
          <p><strong>Heures de coaching:</strong> ${data.coachingHours} heures</p>
          <p><strong>Montant payé:</strong> ${data.price} ${data.currency}</p>
        </div>

        <h2>Ce qui est inclus</h2>
        <ul class="feature-list">
          <li><strong>${data.coachingHours} heures</strong> de coaching ELS expert</li>
          ${data.includesDiagnostic ? '<li>Diagnostic stratégique de langue</li>' : ''}
          ${data.includesLearningPlan ? "<li>Plan d'apprentissage personnalisé</li>" : ''}
          ${data.simulationsIncluded > 0 ? `<li>${data.simulationsIncluded} simulation(s) d'examen</li>` : ''}
          <li>Accès illimité au coach IA</li>
        </ul>

        <h2>Vos prochaines étapes</h2>
        <ol>
          <li><strong>Complétez votre diagnostic</strong> - Commencez par une évaluation stratégique pour identifier vos forces et points à améliorer.</li>
          <li><strong>Consultez votre plan d'apprentissage</strong> - Accédez à votre feuille de route personnalisée conçue pour atteindre votre niveau cible.</li>
          <li><strong>Réservez votre première session</strong> - Planifiez une session de coaching avec l'un de nos coachs experts ELS.</li>
        </ol>

        <p style="text-align: center;">
          <a href="${data.dashboardUrl}" class="cta-button">Aller à votre tableau de bord</a>
        </p>

        <hr class="divider">
        <p>Si vous avez des questions, n'hésitez pas à contacter notre équipe de support.</p>
        <p>Cordialement,<br><strong>L'équipe Lingueefy</strong></p>
      </div>
      <div class="footer">
        <p>© 2026 Rusinga International Consulting Ltd.</p>
        <p><a href="https://app.rusingacademy.ca/fr/confidentialite">Politique de confidentialité</a> | <a href="https://app.rusingacademy.ca/fr/conditions">Conditions d'utilisation</a></p>
      </div>
    `;

  const text = isEn
    ? `Thank You for Your Purchase!\n\nDear ${data.customerName},\n\nYour purchase of ${data.offerName} has been confirmed.\n\nPackage: ${data.offerName}\nCoaching Hours: ${data.coachingHours} hours\nAmount Paid: ${data.price} ${data.currency}\n\nGo to your dashboard: ${data.dashboardUrl}\n\nBest regards,\nThe Lingueefy Team`
    : `Merci pour votre achat!\n\nCher(e) ${data.customerName},\n\nVotre achat de ${data.offerName} a été confirmé.\n\nForfait: ${data.offerName}\nHeures de coaching: ${data.coachingHours} heures\nMontant payé: ${data.price} ${data.currency}\n\nAller à votre tableau de bord: ${data.dashboardUrl}\n\nCordialement,\nL'équipe Lingueefy`;

  return {
    subject,
    html: wrapTemplate(content),
    text,
  };
}

// ============================================================================
// Booking Confirmation Template
// ============================================================================

interface BookingConfirmationData {
  learnerName: string;
  coachName: string;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  sessionType: string;
  meetingUrl: string;
  minutesUsed: number;
  minutesRemaining: number;
}

export function getBookingConfirmationEmail(
  data: BookingConfirmationData,
  locale: 'en' | 'fr'
): { subject: string; html: string; text: string } {
  const isEn = locale === 'en';

  const subject = isEn
    ? `Coaching Session Confirmed - ${data.sessionDate}`
    : `Session de coaching confirmée - ${data.sessionDate}`;

  const content = isEn
    ? `
      <div class="header">
        <h1>Session Confirmed!</h1>
      </div>
      <div class="content">
        <p>Dear ${data.learnerName},</p>
        <p>Your coaching session with <strong>${data.coachName}</strong> has been confirmed.</p>
        
        <div class="info-box">
          <h3>Session Details</h3>
          <p><strong>Date:</strong> ${data.sessionDate}</p>
          <p><strong>Time:</strong> ${data.sessionTime}</p>
          <p><strong>Duration:</strong> ${data.duration} minutes</p>
          <p><strong>Type:</strong> ${data.sessionType}</p>
        </div>

        <p style="text-align: center;">
          <a href="${data.meetingUrl}" class="cta-button">Join Session</a>
        </p>

        <div class="info-box" style="background: #f0fdf4; border-color: #10b981;">
          <h3 style="color: #059669;">Your Coaching Balance</h3>
          <p style="color: #059669;"><strong>Minutes used:</strong> ${data.minutesUsed}</p>
          <p style="color: #059669;"><strong>Minutes remaining:</strong> ${data.minutesRemaining}</p>
        </div>

        <h2>Before Your Session</h2>
        <ul class="feature-list">
          <li>Test your audio and video</li>
          <li>Find a quiet space</li>
          <li>Have your learning goals ready</li>
          <li>Join 5 minutes early</li>
        </ul>

        <p>Best regards,<br><strong>The Lingueefy Team</strong></p>
      </div>
      <div class="footer">
        <p>© 2026 Rusinga International Consulting Ltd.</p>
      </div>
    `
    : `
      <div class="header">
        <h1>Session confirmée!</h1>
      </div>
      <div class="content">
        <p>Cher(e) ${data.learnerName},</p>
        <p>Votre session de coaching avec <strong>${data.coachName}</strong> a été confirmée.</p>
        
        <div class="info-box">
          <h3>Détails de la session</h3>
          <p><strong>Date:</strong> ${data.sessionDate}</p>
          <p><strong>Heure:</strong> ${data.sessionTime}</p>
          <p><strong>Durée:</strong> ${data.duration} minutes</p>
          <p><strong>Type:</strong> ${data.sessionType}</p>
        </div>

        <p style="text-align: center;">
          <a href="${data.meetingUrl}" class="cta-button">Rejoindre la session</a>
        </p>

        <div class="info-box" style="background: #f0fdf4; border-color: #10b981;">
          <h3 style="color: #059669;">Votre solde de coaching</h3>
          <p style="color: #059669;"><strong>Minutes utilisées:</strong> ${data.minutesUsed}</p>
          <p style="color: #059669;"><strong>Minutes restantes:</strong> ${data.minutesRemaining}</p>
        </div>

        <h2>Avant votre session</h2>
        <ul class="feature-list">
          <li>Testez votre audio et vidéo</li>
          <li>Trouvez un endroit calme</li>
          <li>Préparez vos objectifs d'apprentissage</li>
          <li>Connectez-vous 5 minutes à l'avance</li>
        </ul>

        <p>Cordialement,<br><strong>L'équipe Lingueefy</strong></p>
      </div>
      <div class="footer">
        <p>© 2026 Rusinga International Consulting Ltd.</p>
      </div>
    `;

  const text = isEn
    ? `Session Confirmed!\n\nDear ${data.learnerName},\n\nYour session with ${data.coachName} is confirmed.\n\nDate: ${data.sessionDate}\nTime: ${data.sessionTime}\nDuration: ${data.duration} minutes\n\nJoin: ${data.meetingUrl}\n\nMinutes remaining: ${data.minutesRemaining}`
    : `Session confirmée!\n\nCher(e) ${data.learnerName},\n\nVotre session avec ${data.coachName} est confirmée.\n\nDate: ${data.sessionDate}\nHeure: ${data.sessionTime}\nDurée: ${data.duration} minutes\n\nRejoindre: ${data.meetingUrl}\n\nMinutes restantes: ${data.minutesRemaining}`;

  return {
    subject,
    html: wrapTemplate(content),
    text,
  };
}

// ============================================================================
// Session Reminder Template
// ============================================================================

interface SessionReminderData {
  learnerName: string;
  coachName: string;
  sessionDate: string;
  sessionTime: string;
  meetingUrl: string;
  hoursUntil: number;
}

export function getSessionReminderEmail(
  data: SessionReminderData,
  locale: 'en' | 'fr'
): { subject: string; html: string; text: string } {
  const isEn = locale === 'en';

  const subject = isEn
    ? `Reminder: Session in ${data.hoursUntil} hours`
    : `Rappel: Session dans ${data.hoursUntil} heures`;

  const content = isEn
    ? `
      <div class="header">
        <h1>Session Reminder</h1>
      </div>
      <div class="content">
        <p>Dear ${data.learnerName},</p>
        <p>This is a reminder that your coaching session with <strong>${data.coachName}</strong> is coming up in <strong>${data.hoursUntil} hours</strong>.</p>
        
        <div class="info-box">
          <h3>Session Details</h3>
          <p><strong>Date:</strong> ${data.sessionDate}</p>
          <p><strong>Time:</strong> ${data.sessionTime}</p>
          <p><strong>Coach:</strong> ${data.coachName}</p>
        </div>

        <p style="text-align: center;">
          <a href="${data.meetingUrl}" class="cta-button">Join Session</a>
        </p>

        <p>See you soon!</p>
        <p>Best regards,<br><strong>The Lingueefy Team</strong></p>
      </div>
      <div class="footer">
        <p>© 2026 Rusinga International Consulting Ltd.</p>
      </div>
    `
    : `
      <div class="header">
        <h1>Rappel de session</h1>
      </div>
      <div class="content">
        <p>Cher(e) ${data.learnerName},</p>
        <p>Ceci est un rappel que votre session de coaching avec <strong>${data.coachName}</strong> commence dans <strong>${data.hoursUntil} heures</strong>.</p>
        
        <div class="info-box">
          <h3>Détails de la session</h3>
          <p><strong>Date:</strong> ${data.sessionDate}</p>
          <p><strong>Heure:</strong> ${data.sessionTime}</p>
          <p><strong>Coach:</strong> ${data.coachName}</p>
        </div>

        <p style="text-align: center;">
          <a href="${data.meetingUrl}" class="cta-button">Rejoindre la session</a>
        </p>

        <p>À bientôt!</p>
        <p>Cordialement,<br><strong>L'équipe Lingueefy</strong></p>
      </div>
      <div class="footer">
        <p>© 2026 Rusinga International Consulting Ltd.</p>
      </div>
    `;

  const text = isEn
    ? `Session Reminder\n\nYour session with ${data.coachName} is in ${data.hoursUntil} hours.\n\nDate: ${data.sessionDate}\nTime: ${data.sessionTime}\n\nJoin: ${data.meetingUrl}`
    : `Rappel de session\n\nVotre session avec ${data.coachName} est dans ${data.hoursUntil} heures.\n\nDate: ${data.sessionDate}\nHeure: ${data.sessionTime}\n\nRejoindre: ${data.meetingUrl}`;

  return {
    subject,
    html: wrapTemplate(content),
    text,
  };
}
