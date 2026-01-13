import { db } from "../_core/db";
import { courses, courseModules, lessons, quizzes, quizQuestions } from "../../drizzle/schema";
import fs from "fs/promises";
import path from "path";

interface LessonContent {
  videoScript?: string;
  dialogueScript?: string;
  quizFormatif?: string;
  tacheProductive?: string;
  coachingAudio?: string;
  ficheRecap?: string;
}

async function importPathI() {
  console.log("Starting import for GC Bilingual Mastery - Path I...");

  const courseSlug = "gc-bilingual-mastery-path-i";
  const courseTitle = "GC Bilingual Mastery - Path I";
  const courseDescription = "Comprehensive course for mastering official languages in the Canadian federal government.";

  // Insert Course
  const [course] = await db.insert(courses).values({
    title: courseTitle,
    slug: courseSlug,
    description: courseDescription,
    shortDescription: "Master official languages for the Canadian federal government.",
    category: "sle_complete",
    level: "all_levels",
    targetLanguage: "both",
    price: 0, // Assuming free for now, will be updated later
    accessType: "one_time",
    totalModules: 4,
    totalLessons: 16,
    instructorName: "RusingAcademy",
    status: "published",
    hasCertificate: true,
    hasQuizzes: true,
    hasDownloads: true,
  });

  console.log(`Course '${courseTitle}' inserted with ID: ${course.insertId}`);

  const courseId = course.insertId;
  const baseContentPath = path.join(process.cwd(), "CURRICULUM - RusingAcademy", "GC_BMS_Path_I_EXHAUSTIVE");

  for (let moduleNum = 1; moduleNum <= 4; moduleNum++) {
    const moduleTitle = `Module ${moduleNum}`;
    const moduleSlug = `module-${moduleNum}`;

    // Insert Module
    const [module] = await db.insert(courseModules).values({
      courseId: courseId,
      title: moduleTitle,
      description: `Description for Module ${moduleNum}`,
      sortOrder: moduleNum - 1,
    });
    console.log(`Module '${moduleTitle}' inserted with ID: ${module.insertId}`);

    const moduleId = module.insertId;

    for (let lessonNum = 1; lessonNum <= 4; lessonNum++) {
      const lessonTitle = `Lesson ${moduleNum}.${lessonNum}`;
      const lessonSlug = `lesson-${moduleNum}-${lessonNum}`;
      const lessonPath = path.join(baseContentPath, "EN", `Module_${moduleNum}`, `Lesson_${moduleNum}.${lessonNum}`);

      let content: LessonContent = {};

      try {
        content.videoScript = await fs.readFile(path.join(lessonPath, "01_Video_Script.md"), "utf-8");
      } catch (error) { /* console.warn(`No video script for ${lessonTitle}`); */ }
      try {
        content.dialogueScript = await fs.readFile(path.join(lessonPath, "02_Dialogue_Script.md"), "utf-8");
      } catch (error) { /* console.warn(`No dialogue script for ${lessonTitle}`); */ }
      try {
        content.quizFormatif = await fs.readFile(path.join(lessonPath, "03_Quiz_Formatif.md"), "utf-8");
      } catch (error) { /* console.warn(`No quiz formatif for ${lessonTitle}`); */ }
      try {
        content.tacheProductive = await fs.readFile(path.join(lessonPath, "04_Tache_Productive.md"), "utf-8");
      } catch (error) { /* console.warn(`No tache productive for ${lessonTitle}`); */ }
      try {
        content.coachingAudio = await fs.readFile(path.join(lessonPath, "05_Coaching_Audio.md"), "utf-8");
      } catch (error) { /* console.warn(`No coaching audio for ${lessonTitle}`); */ }
      try {
        content.ficheRecap = await fs.readFile(path.join(lessonPath, "06_Fiche_Recap.md"), "utf-8");
      } catch (error) { /* console.warn(`No fiche recap for ${lessonTitle}`); */ }

      // Insert Lesson
      const [lesson] = await db.insert(lessons).values({
        courseId: courseId,
        moduleId: moduleId,
        title: lessonTitle,
        slug: lessonSlug,
        description: `Description for ${lessonTitle}`,
        content: JSON.stringify(content), // Store all markdown content as JSON
        sortOrder: lessonNum - 1,
        isPreview: false, // Default to not preview
        totalDurationMinutes: 15, // Placeholder
      });
      console.log(`Lesson '${lessonTitle}' inserted with ID: ${lesson.insertId}`);

      // TODO: Parse quizFormatif and insert into quizzes and quizQuestions tables
    }
  }

  console.log("Import for GC Bilingual Mastery - Path I completed.");
}

importPathI().catch(console.error);
