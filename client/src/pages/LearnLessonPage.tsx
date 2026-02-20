/**
 * LearnLessonPage — Wraps LessonViewer inside the immersive LearnLayout shell.
 *
 * Route: /learn/:slug/lessons/:lessonId
 *
 * This page renders LessonViewer as a child of LearnLayout, so:
 * - LearnLayout provides the top bar, sidebar, AI panel, and bottom nav
 * - LessonViewer detects `isInsideLearnLayout` and renders only its content area
 *   (no duplicate top bar, sidebar, or bottom nav)
 */
import LearnLayout from "@/components/LearnLayout";
import LessonViewer from "./LessonViewer";

import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { title: "Learn Lesson Page", description: "Manage and configure learn lesson page" },
  fr: { title: "Learn Lesson Page", description: "Gérer et configurer learn lesson page" },
};

export default function LearnLessonPage() {
  const { language } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <LearnLayout>
      <LessonViewer />
    </LearnLayout>
  );
}
