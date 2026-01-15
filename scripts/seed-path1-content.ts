/**
 * Seed Script for Path I: Foundations (A1) - Real Curriculum Content
 * Based on GC Bilingual Mastery Series curriculum
 */

import { getDb } from "../server/db";
import { courses, courseModules, lessons } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Path I Course Data
const PATH_I_COURSE = {
  title: "Path I: Foundations (A1)",
  slug: "path-i-foundations-a1",
  description: "Begin your journey to bilingual excellence with foundational French skills for the Canadian public service. This comprehensive A1-level course covers professional introductions, daily workplace communication, and essential interactions.",
  shortDescription: "Master foundational French for the public service (CEFR A1 / SLE Level A)",
  category: "sle_oral" as const,
  level: "beginner" as const,
  sleLevel: "A" as const,
  cefrLevel: "A1",
  thumbnailUrl: "/images/courses/Path_I_Main_Thumbnail.png",
  instructorName: "Prof. Steven Rusinga",
  instructorBio: "Founder of RusingÂcademy with 15+ years of experience in bilingual education for Canadian public servants.",
  totalModules: 4,
  totalLessons: 16,
  totalXp: 1500,
  isFeatured: true,
  isPublished: true,
};

// Module Data
const PATH_I_MODULES = [
  {
    title: "Module 1: Premiers Pas Professionnels",
    titleEn: "First Professional Steps",
    description: "Learn to introduce yourself professionally and make a confident first impression in French.",
    orderIndex: 1,
    totalLessons: 4,
    xpReward: 375,
    badgeName: "Premiers Pas Professionnels",
    badgeImage: "/images/badges/Badge_Module_1.png",
  },
  {
    title: "Module 2: Communication Quotidienne",
    titleEn: "Daily Communication",
    description: "Master everyday workplace communication including emails, phone calls, and casual conversations.",
    orderIndex: 2,
    totalLessons: 4,
    xpReward: 375,
    badgeName: "Communication Quotidienne",
    badgeImage: "/images/badges/Badge_Module_2.png",
  },
  {
    title: "Module 3: Interactions Essentielles",
    titleEn: "Essential Interactions",
    description: "Handle essential professional interactions including meetings, requests, and collaborative work.",
    orderIndex: 3,
    totalLessons: 4,
    xpReward: 375,
    badgeName: "Interactions Essentielles",
    badgeImage: "/images/badges/Badge_Module_3.png",
  },
  {
    title: "Module 4: Vers l'Autonomie",
    titleEn: "Towards Autonomy",
    description: "Build confidence and autonomy in your French communication skills for independent workplace use.",
    orderIndex: 4,
    totalLessons: 4,
    xpReward: 375,
    badgeName: "Vers l'Autonomie",
    badgeImage: "/images/badges/Badge_Module_4.png",
  },
];

// Lesson Data for Module 1
const MODULE_1_LESSONS = [
  {
    title: "Leçon 1.1: Bonjour, Je M'appelle...",
    titleEn: "Hello, My Name Is...",
    description: "Learn to introduce yourself professionally with confidence. Master the verbs 'être' and 's'appeler', personal pronouns, and create a memorable 60-second professional introduction.",
    orderIndex: 1,
    contentType: "text" as const,
    xpReward: 100,
    estimatedMinutes: 75,
    objectives: [
      "Present yourself professionally in French",
      "Use verbs 'être' and 's'appeler' correctly",
      "Distinguish between formal and informal registers",
      "Create a confident 60-second introduction"
    ],
    textContent: `
## Votre Transformation Aujourd'hui

À la fin de cette leçon, vous passerez de la peur de prendre la parole à la confiance de vous présenter de manière professionnelle et mémorable en français.

Vous n'allez pas seulement apprendre à dire "Bonjour". Vous allez apprendre à créer une première impression positive qui établit votre crédibilité et ouvre la porte à de futures collaborations.

## Votre Mission Professionnelle

**Situation**: Vous venez de rejoindre une nouvelle équipe au sein de la fonction publique. Lors de votre première réunion d'équipe, votre gestionnaire vous invite à vous présenter.

**Tâche**: Vous présenter en français à vos nouveaux collègues en indiquant votre nom, votre rôle, et une brève information sur votre parcours, le tout avec une assurance qui inspire confiance.

## Activités Essentielles (60-75 minutes)

### 1. [VIDÉO] L'Art de la Première Impression (7 min)
Plongez dans les nuances culturelles de la présentation professionnelle au Canada. Cette vidéo vous montrera non seulement le "quoi dire", mais aussi le "comment le dire" pour projeter confiance et professionnalisme.

### 2. [AUDIO] Dialogue: Formel vs. Naturel (5 min)
Écoutez deux scénarios: une présentation formelle à un sous-ministre et une introduction plus décontractée à un collègue. Entraînez votre oreille à distinguer les registres de langue et à choisir le ton juste pour chaque situation.

### 3. [ACTIVITÉ] Vocabulaire & Grammaire Fondamentale (20 min)
Maîtrisez les briques de base de votre présentation. Nous travaillerons les verbes "être" et "s'appeler", les pronoms personnels, les articles et la structure de phrase simple. Des exercices interactifs vous aideront à automatiser ces structures pour qu'elles deviennent des réflexes.

### 4. [TÂCHE] Rédigez Votre Présentation (15 min)
C'est à vous de jouer. En utilisant les modèles et le vocabulaire fournis, rédigez le script de votre propre présentation professionnelle de 60 secondes. C'est le brouillon de votre future confiance.

### 5. [TÂCHE] Enregistrez Votre Présentation (10 min)
Activez votre microphone et enregistrez-vous. L'objectif n'est pas la perfection, mais l'action. C'est votre premier pas pour transformer le texte en parole vivante et confiante.

## Coaching Tip Transformationnel

> "La confiance ne naît pas de l'absence d'erreurs, mais de la certitude que vous avez le droit d'en faire. Votre accent n'est pas une faute; c'est la preuve de votre courage. Portez-le avec fierté."

## Vocabulaire Clé

| Français | English | Example |
|----------|---------|---------|
| Je m'appelle... | My name is... | Je m'appelle Marie. |
| Je suis... | I am... | Je suis analyste. |
| Je travaille dans... | I work in... | Je travaille dans les communications. |
| Enchanté(e) | Nice to meet you | Enchanté de faire votre connaissance. |
| J'ai hâte de... | I look forward to... | J'ai hâte de collaborer avec vous. |
    `,
    quizQuestions: [
      {
        type: "fill_blank",
        question: "Je ________ le nouvel analyste.",
        options: ["suis", "es", "est", "sommes"],
        correctAnswer: "suis",
        explanation: "With 'je' (I), we use 'suis' - the first person singular of 'être'."
      },
      {
        type: "fill_blank",
        question: "Vous ________ la directrice?",
        options: ["suis", "êtes", "est", "sont"],
        correctAnswer: "êtes",
        explanation: "With 'vous' (you formal), we use 'êtes'."
      },
      {
        type: "fill_blank",
        question: "Je ________ David.",
        options: ["m'appelle", "t'appelles", "s'appelle", "appelons"],
        correctAnswer: "m'appelle",
        explanation: "With 'je', the reflexive verb 's'appeler' becomes 'm'appelle'."
      },
      {
        type: "fill_blank",
        question: "Comment vous ________?",
        options: ["appelle", "appelez", "appellent", "appelles"],
        correctAnswer: "appelez",
        explanation: "With 'vous', we use 'appelez' for the formal 'What is your name?'"
      },
      {
        type: "reorder",
        question: "Put in order: m'appelle / Je / Sophie / .",
        correctAnswer: "Je m'appelle Sophie.",
        explanation: "Subject + reflexive verb + name"
      },
      {
        type: "reorder",
        question: "Put in order: le / suis / directeur / Je / nouveau / .",
        correctAnswer: "Je suis le nouveau directeur.",
        explanation: "Subject + verb + article + adjective + noun"
      }
    ]
  },
  {
    title: "Leçon 1.2: Mon Bureau, Mon Équipe",
    titleEn: "My Office, My Team",
    description: "Learn to describe your workplace, introduce your team members, and navigate office spaces in French.",
    orderIndex: 2,
    contentType: "text" as const,
    xpReward: 100,
    estimatedMinutes: 60,
    objectives: [
      "Describe your office and workspace",
      "Introduce team members and their roles",
      "Use spatial prepositions correctly",
      "Navigate office environments in French"
    ],
    textContent: `
## Votre Mission

Vous devez faire visiter votre espace de travail à un nouveau collègue francophone et lui présenter les membres clés de votre équipe.

## Vocabulaire de Bureau

| Français | English |
|----------|---------|
| le bureau | the office/desk |
| la salle de réunion | the meeting room |
| l'ordinateur | the computer |
| le collègue / la collègue | the colleague |
| le/la gestionnaire | the manager |
| l'équipe | the team |

## Prépositions Spatiales

- **à côté de** - next to
- **en face de** - across from
- **près de** - near
- **loin de** - far from
- **dans** - in
- **sur** - on
    `,
    quizQuestions: [
      {
        type: "multiple_choice",
        question: "How do you say 'the meeting room' in French?",
        options: ["le bureau", "la salle de réunion", "l'ordinateur", "le couloir"],
        correctAnswer: "la salle de réunion",
        explanation: "La salle de réunion is the meeting room."
      }
    ]
  },
  {
    title: "Leçon 1.3: La Routine Quotidienne",
    titleEn: "Daily Routine",
    description: "Master describing your daily work schedule, time expressions, and routine activities in French.",
    orderIndex: 3,
    contentType: "text" as const,
    xpReward: 100,
    estimatedMinutes: 60,
    objectives: [
      "Describe your daily work routine",
      "Use time expressions correctly",
      "Conjugate regular -er verbs in present tense",
      "Talk about schedules and appointments"
    ],
    textContent: `
## Les Activités Quotidiennes

Apprenez à décrire votre journée de travail typique.

## Expressions de Temps

| Français | English |
|----------|---------|
| le matin | in the morning |
| l'après-midi | in the afternoon |
| le soir | in the evening |
| à 9 heures | at 9 o'clock |
| de... à... | from... to... |

## Verbes Réguliers en -ER

- **arriver** (to arrive): j'arrive, tu arrives, il/elle arrive
- **travailler** (to work): je travaille, tu travailles, il/elle travaille
- **déjeuner** (to have lunch): je déjeune, tu déjeunes, il/elle déjeune
- **terminer** (to finish): je termine, tu termines, il/elle termine
    `,
    quizQuestions: [
      {
        type: "fill_blank",
        question: "Je ________ au bureau à 8h30.",
        options: ["arrive", "arrives", "arrivons", "arrivez"],
        correctAnswer: "arrive",
        explanation: "With 'je', the -er verb 'arriver' becomes 'arrive'."
      }
    ]
  },
  {
    title: "Leçon 1.4: Poser des Questions Clés",
    titleEn: "Asking Key Questions",
    description: "Learn to ask and answer essential workplace questions in French with confidence.",
    orderIndex: 4,
    contentType: "text" as const,
    xpReward: 100,
    estimatedMinutes: 60,
    objectives: [
      "Form questions using different structures",
      "Use question words (qui, quoi, où, quand, comment, pourquoi)",
      "Ask for clarification politely",
      "Respond to common workplace questions"
    ],
    textContent: `
## Les Mots Interrogatifs

| Français | English | Example |
|----------|---------|---------|
| Qui? | Who? | Qui est le directeur? |
| Quoi? / Qu'est-ce que? | What? | Qu'est-ce que vous faites? |
| Où? | Where? | Où est la salle de réunion? |
| Quand? | When? | Quand est la réunion? |
| Comment? | How? | Comment ça va? |
| Pourquoi? | Why? | Pourquoi êtes-vous ici? |

## Structures de Questions

1. **Intonation montante**: Vous travaillez ici? ↗
2. **Est-ce que**: Est-ce que vous travaillez ici?
3. **Inversion**: Travaillez-vous ici?

## Demander Poliment

- **Excusez-moi...** - Excuse me...
- **Pourriez-vous me dire...?** - Could you tell me...?
- **Je voudrais savoir...** - I would like to know...
    `,
    quizQuestions: [
      {
        type: "multiple_choice",
        question: "How do you ask 'Where is the meeting room?' in French?",
        options: ["Qui est la salle de réunion?", "Où est la salle de réunion?", "Quand est la salle de réunion?", "Comment est la salle de réunion?"],
        correctAnswer: "Où est la salle de réunion?",
        explanation: "'Où' means 'where' and is used to ask about location."
      }
    ]
  }
];

// Simplified lessons for Modules 2-4 (structure only, to be expanded)
const MODULE_2_LESSONS = [
  { title: "Leçon 2.1: Écrire des Courriels Professionnels", titleEn: "Writing Professional Emails", orderIndex: 1 },
  { title: "Leçon 2.2: Répondre au Téléphone", titleEn: "Answering the Phone", orderIndex: 2 },
  { title: "Leçon 2.3: Conversations Informelles", titleEn: "Informal Conversations", orderIndex: 3 },
  { title: "Leçon 2.4: Prendre et Laisser des Messages", titleEn: "Taking and Leaving Messages", orderIndex: 4 },
];

const MODULE_3_LESSONS = [
  { title: "Leçon 3.1: Participer aux Réunions", titleEn: "Participating in Meetings", orderIndex: 1 },
  { title: "Leçon 3.2: Faire des Demandes", titleEn: "Making Requests", orderIndex: 2 },
  { title: "Leçon 3.3: Collaborer en Équipe", titleEn: "Team Collaboration", orderIndex: 3 },
  { title: "Leçon 3.4: Gérer les Malentendus", titleEn: "Handling Misunderstandings", orderIndex: 4 },
];

const MODULE_4_LESSONS = [
  { title: "Leçon 4.1: Exprimer Ses Opinions", titleEn: "Expressing Opinions", orderIndex: 1 },
  { title: "Leçon 4.2: Négocier et Compromis", titleEn: "Negotiating and Compromising", orderIndex: 2 },
  { title: "Leçon 4.3: Présenter un Projet", titleEn: "Presenting a Project", orderIndex: 3 },
  { title: "Leçon 4.4: Bilan et Prochaines Étapes", titleEn: "Review and Next Steps", orderIndex: 4 },
];

async function seedPath1Content() {
  console.log("🌱 Starting Path I content seeding...");
  
  const db = await getDb();
  
  // Check if course already exists
  const existingCourse = await db.select()
    .from(courses)
    .where(eq(courses.slug, PATH_I_COURSE.slug))
    .limit(1);
  
  let courseId: number;
  
  if (existingCourse.length > 0) {
    console.log("📚 Course already exists, updating...");
    courseId = existingCourse[0].id;
    
    await db.update(courses)
      .set({
        title: PATH_I_COURSE.title,
        description: PATH_I_COURSE.description,
        shortDescription: PATH_I_COURSE.shortDescription,
        category: PATH_I_COURSE.category,
        level: PATH_I_COURSE.level,
        thumbnailUrl: PATH_I_COURSE.thumbnailUrl,
        instructorName: PATH_I_COURSE.instructorName,
        instructorBio: PATH_I_COURSE.instructorBio,
        totalModules: PATH_I_COURSE.totalModules,
        totalLessons: PATH_I_COURSE.totalLessons,
        isFeatured: PATH_I_COURSE.isFeatured,
        isPublished: PATH_I_COURSE.isPublished,
      })
      .where(eq(courses.id, courseId));
  } else {
    console.log("📚 Creating new course...");
    await db.insert(courses).values({
      title: PATH_I_COURSE.title,
      slug: PATH_I_COURSE.slug,
      description: PATH_I_COURSE.description,
      shortDescription: PATH_I_COURSE.shortDescription,
      category: PATH_I_COURSE.category,
      level: PATH_I_COURSE.level,
      thumbnailUrl: PATH_I_COURSE.thumbnailUrl,
      instructorName: PATH_I_COURSE.instructorName,
      instructorBio: PATH_I_COURSE.instructorBio,
      totalModules: PATH_I_COURSE.totalModules,
      totalLessons: PATH_I_COURSE.totalLessons,
      isFeatured: PATH_I_COURSE.isFeatured,
      isPublished: PATH_I_COURSE.isPublished,
    });
    
    const [newCourse] = await db.select()
      .from(courses)
      .where(eq(courses.slug, PATH_I_COURSE.slug))
      .limit(1);
    courseId = newCourse.id;
  }
  
  console.log(`✅ Course ID: ${courseId}`);
  
  // Seed modules
  for (const moduleData of PATH_I_MODULES) {
    console.log(`📦 Processing module: ${moduleData.title}`);
    
    const existingModule = await db.select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .limit(100);
    
    const moduleExists = existingModule.find(m => m.sortOrder === moduleData.orderIndex);
    
    let moduleId: number;
    
    if (moduleExists) {
      moduleId = moduleExists.id;
      await db.update(courseModules)
        .set({
          title: moduleData.title,
          description: moduleData.description,
          totalLessons: moduleData.totalLessons,
        })
        .where(eq(courseModules.id, moduleId));
    } else {
      await db.insert(courseModules).values({
        courseId,
        title: moduleData.title,
        description: moduleData.description,
        sortOrder: moduleData.orderIndex,
        totalLessons: moduleData.totalLessons,
      });
      
      // Wait a moment for the insert to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const allModules = await db.select()
        .from(courseModules)
        .where(eq(courseModules.courseId, courseId));
      
      const foundModule = allModules.find(m => m.sortOrder === moduleData.orderIndex);
      if (!foundModule) {
        throw new Error(`Module not found after insert: ${moduleData.title}`);
      }
      moduleId = foundModule.id;
    }
    
    // Seed lessons for this module
    let lessonsToSeed: any[];
    switch (moduleData.orderIndex) {
      case 1:
        lessonsToSeed = MODULE_1_LESSONS;
        break;
      case 2:
        lessonsToSeed = MODULE_2_LESSONS.map(l => ({
          ...l,
          description: `Learn essential skills for ${l.titleEn.toLowerCase()} in a professional French context.`,
          contentType: "text" as const,
          xpReward: 100,
          estimatedMinutes: 45,
          textContent: `# ${l.title}\n\nContent coming soon...`,
        }));
        break;
      case 3:
        lessonsToSeed = MODULE_3_LESSONS.map(l => ({
          ...l,
          description: `Master ${l.titleEn.toLowerCase()} techniques for workplace success.`,
          contentType: "text" as const,
          xpReward: 100,
          estimatedMinutes: 45,
          textContent: `# ${l.title}\n\nContent coming soon...`,
        }));
        break;
      case 4:
        lessonsToSeed = MODULE_4_LESSONS.map(l => ({
          ...l,
          description: `Build autonomy with ${l.titleEn.toLowerCase()} skills.`,
          contentType: "text" as const,
          xpReward: 100,
          estimatedMinutes: 45,
          textContent: `# ${l.title}\n\nContent coming soon...`,
        }));
        break;
      default:
        lessonsToSeed = [];
    }
    
    for (const lessonData of lessonsToSeed) {
      console.log(`  📝 Processing lesson: ${lessonData.title}`);
      
      const existingLessons = await db.select()
        .from(lessons)
        .where(eq(lessons.moduleId, moduleId));
      
      const lessonExists = existingLessons.find(l => l.sortOrder === lessonData.orderIndex);
      
      if (lessonExists) {
        await db.update(lessons)
          .set({
            title: lessonData.title,
            description: lessonData.description,
            contentType: lessonData.contentType,
            textContent: lessonData.textContent,
          })
          .where(eq(lessons.id, lessonExists.id));
      } else {
        await db.insert(lessons).values({
          moduleId,
          courseId,
          title: lessonData.title,
          description: lessonData.description,
          sortOrder: lessonData.orderIndex,
          contentType: lessonData.contentType || "text",
          textContent: lessonData.textContent || "",
        });
      }
    }
  }
  
  console.log("✅ Path I content seeding complete!");
  console.log(`📊 Summary: 1 course, ${PATH_I_MODULES.length} modules, 16 lessons`);
  
  process.exit(0);
}

seedPath1Content().catch(console.error);
