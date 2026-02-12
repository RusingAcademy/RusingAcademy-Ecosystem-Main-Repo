import { router } from "../_core/trpc";
import { learnerSessionsRouter } from "./learnerSessions";
import { learnerProfileRouter } from "./learnerProfile";
import { learnerGamificationRouter } from "./learnerGamification";
import { learnerCoursesRouter } from "./learnerCourses";

// Merge all learner sub-routers into a single learnerRouter
export const learnerRouter = router({
  ...learnerSessionsRouter._def.procedures,
  ...learnerProfileRouter._def.procedures,
  ...learnerGamificationRouter._def.procedures,
  ...learnerCoursesRouter._def.procedures,
});
