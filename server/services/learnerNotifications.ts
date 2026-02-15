/**
 * Learner Notification Service
 * Sprint C3: Unified notification utility for learner events
 * 
 * Creates in-app notifications for learners with bilingual templates.
 * Uses the existing `notifications` table and `createNotification` function.
 */
import { createNotification } from "../db";
import { createLogger } from "../_core/logger";

const log = createLogger("learner-notifications");

// ─── Event Types ───
export type LearnerEvent =
  | { type: "enrollment"; courseTitle: string; courseSlug?: string }
  | { type: "course_completion"; courseTitle: string; certificateId?: number }
  | { type: "quiz_result"; lessonTitle: string; score: number; totalPoints: number; passed: boolean }
  | { type: "badge_earned"; badgeName: string; badgeDescription?: string }
  | { type: "streak_milestone"; days: number }
  | { type: "xp_milestone"; xp: number; level?: string }
  | { type: "certificate_ready"; courseTitle: string; certificateId: number }
  | { type: "welcome"; userName?: string }
  | { type: "admin_broadcast"; title: string; message: string; link?: string };

// ─── Bilingual Templates ───
interface NotificationTemplate {
  title: { en: string; fr: string };
  message: { en: string; fr: string };
  link?: string;
  notificationType: "message" | "session_reminder" | "booking" | "review" | "system";
}

function getTemplate(event: LearnerEvent): NotificationTemplate {
  switch (event.type) {
    case "enrollment":
      return {
        title: {
          en: `Enrolled in ${event.courseTitle}`,
          fr: `Inscrit(e) à ${event.courseTitle}`,
        },
        message: {
          en: `You have been successfully enrolled in "${event.courseTitle}". Start learning now!`,
          fr: `Vous êtes inscrit(e) avec succès à « ${event.courseTitle} ». Commencez votre apprentissage maintenant !`,
        },
        link: event.courseSlug ? `/courses/${event.courseSlug}` : "/my-learning",
        notificationType: "booking",
      };

    case "course_completion":
      return {
        title: {
          en: `Course Completed: ${event.courseTitle}`,
          fr: `Cours terminé : ${event.courseTitle}`,
        },
        message: {
          en: `Congratulations! You have completed "${event.courseTitle}". ${event.certificateId ? "Your certificate is ready." : "Keep up the great work!"}`,
          fr: `Félicitations ! Vous avez terminé « ${event.courseTitle} ». ${event.certificateId ? "Votre certificat est prêt." : "Continuez votre excellent travail !"}`,
        },
        link: event.certificateId ? `/certificates/${event.certificateId}` : "/my-learning",
        notificationType: "system",
      };

    case "quiz_result":
      return {
        title: {
          en: event.passed ? `Quiz Passed: ${event.lessonTitle}` : `Quiz Result: ${event.lessonTitle}`,
          fr: event.passed ? `Quiz réussi : ${event.lessonTitle}` : `Résultat du quiz : ${event.lessonTitle}`,
        },
        message: {
          en: `You scored ${event.score}/${event.totalPoints} on "${event.lessonTitle}". ${event.passed ? "Well done!" : "Review the material and try again."}`,
          fr: `Vous avez obtenu ${event.score}/${event.totalPoints} au quiz « ${event.lessonTitle} ». ${event.passed ? "Bravo !" : "Révisez le contenu et réessayez."}`,
        },
        notificationType: "system",
      };

    case "badge_earned":
      return {
        title: {
          en: `Badge Earned: ${event.badgeName}`,
          fr: `Badge obtenu : ${event.badgeName}`,
        },
        message: {
          en: `You earned the "${event.badgeName}" badge! ${event.badgeDescription || "Keep learning to earn more."}`,
          fr: `Vous avez obtenu le badge « ${event.badgeName} » ! ${event.badgeDescription || "Continuez à apprendre pour en obtenir d'autres."}`,
        },
        link: "/badges",
        notificationType: "review",
      };

    case "streak_milestone":
      return {
        title: {
          en: `${event.days}-Day Streak!`,
          fr: `Série de ${event.days} jours !`,
        },
        message: {
          en: `Amazing! You've maintained a ${event.days}-day learning streak. Your dedication is paying off!`,
          fr: `Incroyable ! Vous avez maintenu une série d'apprentissage de ${event.days} jours. Votre dévouement porte ses fruits !`,
        },
        link: "/dashboard",
        notificationType: "review",
      };

    case "xp_milestone":
      return {
        title: {
          en: `XP Milestone: ${event.xp} XP`,
          fr: `Jalon XP : ${event.xp} XP`,
        },
        message: {
          en: `You've reached ${event.xp} XP! ${event.level ? `You are now at level ${event.level}.` : "Keep going!"}`,
          fr: `Vous avez atteint ${event.xp} XP ! ${event.level ? `Vous êtes maintenant au niveau ${event.level}.` : "Continuez !"}`,
        },
        link: "/dashboard",
        notificationType: "review",
      };

    case "certificate_ready":
      return {
        title: {
          en: `Certificate Ready: ${event.courseTitle}`,
          fr: `Certificat prêt : ${event.courseTitle}`,
        },
        message: {
          en: `Your certificate for "${event.courseTitle}" is ready to download and share.`,
          fr: `Votre certificat pour « ${event.courseTitle} » est prêt à télécharger et partager.`,
        },
        link: `/certificates/${event.certificateId}`,
        notificationType: "system",
      };

    case "welcome":
      return {
        title: {
          en: "Welcome to RusingAcademy!",
          fr: "Bienvenue à RusingAcademy !",
        },
        message: {
          en: `Welcome${event.userName ? `, ${event.userName}` : ""}! Start your bilingual learning journey today. Explore our courses and programs.`,
          fr: `Bienvenue${event.userName ? `, ${event.userName}` : ""} ! Commencez votre parcours d'apprentissage bilingue dès aujourd'hui. Explorez nos cours et programmes.`,
        },
        link: "/courses",
        notificationType: "system",
      };

    case "admin_broadcast":
      return {
        title: {
          en: event.title,
          fr: event.title,
        },
        message: {
          en: event.message,
          fr: event.message,
        },
        link: event.link,
        notificationType: "system",
      };
  }
}

/**
 * Send a notification to a learner based on a learning event.
 * Uses the existing notifications table and createNotification function.
 * 
 * @param userId - The learner's user ID
 * @param event - The learning event that triggered the notification
 * @param language - The learner's preferred language (defaults to "en")
 */
export async function notifyLearner(
  userId: number,
  event: LearnerEvent,
  language: "en" | "fr" = "en"
): Promise<void> {
  try {
    const template = getTemplate(event);
    const lang = language === "fr" ? "fr" : "en";

    await createNotification({
      userId,
      type: template.notificationType,
      title: template.title[lang],
      message: template.message[lang],
      link: template.link || null,
      metadata: { eventType: event.type, language: lang },
      read: false,
    });

    log.info(`Notification sent to user ${userId}: ${event.type}`);
  } catch (error) {
    // Log but don't throw — notifications should never break the main flow
    log.error(`Failed to send notification to user ${userId}: ${event.type}`, error);
  }
}

/**
 * Send a broadcast notification to multiple users.
 * 
 * @param userIds - Array of user IDs to notify
 * @param title - Notification title
 * @param message - Notification message
 * @param link - Optional link
 */
export async function broadcastNotification(
  userIds: number[],
  title: string,
  message: string,
  link?: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  // Process in batches of 50 to avoid overwhelming the database
  const batchSize = 50;
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((userId) =>
        notifyLearner(userId, {
          type: "admin_broadcast",
          title,
          message,
          link,
        })
      )
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") sent++;
      else failed++;
    });
  }

  log.info(`Broadcast complete: ${sent} sent, ${failed} failed out of ${userIds.length} users`);
  return { sent, failed };
}
