/**
 * Reading Comprehension Lab — Timed reading passages with comprehension questions
 * Wave F: Full bilingual (EN/FR), WCAG 2.1 AA accessibility, professional empty states
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import { getLoginUrl } from "@/const";

/* ─── Reading Passages by CEFR Level ─── */
const PASSAGES: Record<string, { title: string; text: string; wordCount: number; questions: { q: string; options: string[]; correct: number }[] }[]> = {
  A1: [
    {
      title: "Ma journée",
      text: "Je m'appelle Marie. Je me lève à sept heures. Je prends le petit déjeuner avec ma famille. Je mange du pain et je bois du café. Après, je vais au travail en bus. Je travaille dans un bureau. Je commence à neuf heures. À midi, je déjeune avec mes collègues. Nous mangeons à la cafétéria. L'après-midi, je travaille jusqu'à cinq heures. Le soir, je rentre chez moi. Je prépare le dîner et je regarde la télévision.",
      wordCount: 78,
      questions: [
        { q: "À quelle heure Marie se lève-t-elle?", options: ["Six heures", "Sept heures", "Huit heures", "Neuf heures"], correct: 1 },
        { q: "Comment Marie va-t-elle au travail?", options: ["En voiture", "À pied", "En bus", "En métro"], correct: 2 },
        { q: "Où Marie déjeune-t-elle?", options: ["Chez elle", "Au restaurant", "À la cafétéria", "Au parc"], correct: 2 },
        { q: "Que fait Marie le soir?", options: ["Elle sort", "Elle étudie", "Elle prépare le dîner", "Elle dort"], correct: 2 },
      ],
    },
    {
      title: "Le bureau",
      text: "Mon bureau est grand. Il y a un ordinateur sur la table. J'ai aussi un téléphone et des stylos. La fenêtre est à gauche. Il y a une plante verte près de la fenêtre. Mon collègue Pierre travaille à côté de moi. Il est très gentil. Nous parlons français et anglais au travail. Le matin, nous buvons du café ensemble.",
      wordCount: 56,
      questions: [
        { q: "Qu'est-ce qu'il y a sur la table?", options: ["Un livre", "Un ordinateur", "Une lampe", "Un sac"], correct: 1 },
        { q: "Où est la fenêtre?", options: ["À droite", "En face", "À gauche", "Derrière"], correct: 2 },
        { q: "Comment est Pierre?", options: ["Méchant", "Triste", "Gentil", "Fatigué"], correct: 2 },
      ],
    },
  ],
  A2: [
    {
      title: "La réunion d'équipe",
      text: "Chaque lundi matin, notre équipe a une réunion. Le directeur, M. Dupont, commence par présenter les objectifs de la semaine. Ensuite, chaque membre de l'équipe parle de ses projets. La semaine dernière, j'ai présenté mon rapport sur la satisfaction des clients. Mes collègues ont posé des questions intéressantes. Après la réunion, nous avons pris un café ensemble. Ces réunions sont importantes pour la communication dans notre département.",
      wordCount: 68,
      questions: [
        { q: "Quand a lieu la réunion d'équipe?", options: ["Chaque vendredi", "Chaque lundi matin", "Chaque mercredi", "Deux fois par semaine"], correct: 1 },
        { q: "Qui commence la réunion?", options: ["Le secrétaire", "Le directeur", "Un collègue", "Le client"], correct: 1 },
        { q: "Quel rapport a été présenté?", options: ["Budget", "Satisfaction des clients", "Ventes", "Ressources humaines"], correct: 1 },
        { q: "Pourquoi ces réunions sont-elles importantes?", options: ["Pour le budget", "Pour la communication", "Pour les vacances", "Pour les promotions"], correct: 1 },
      ],
    },
  ],
  B1: [
    {
      title: "Le bilinguisme au Canada",
      text: "Le Canada est un pays officiellement bilingue depuis 1969, année de l'adoption de la Loi sur les langues officielles. Cette loi garantit que les citoyens canadiens peuvent recevoir des services fédéraux en français ou en anglais. Dans la fonction publique fédérale, le bilinguisme est souvent une exigence pour les postes de direction. Les employés doivent démontrer leur compétence dans les deux langues officielles en passant des examens standardisés. Ces examens évaluent trois compétences : la compréhension de l'écrit, l'expression écrite et la compétence orale. Chaque compétence est notée selon trois niveaux : A, B et C, le niveau C étant le plus élevé.",
      wordCount: 108,
      questions: [
        { q: "Depuis quand le Canada est-il officiellement bilingue?", options: ["1960", "1969", "1975", "1982"], correct: 1 },
        { q: "Combien de compétences sont évaluées dans les examens?", options: ["Deux", "Trois", "Quatre", "Cinq"], correct: 1 },
        { q: "Quel est le niveau le plus élevé?", options: ["A", "B", "C", "D"], correct: 2 },
        { q: "Pour quels postes le bilinguisme est-il souvent exigé?", options: ["Tous les postes", "Les postes de direction", "Les postes temporaires", "Les postes à temps partiel"], correct: 1 },
        { q: "Que garantit la Loi sur les langues officielles?", options: ["L'éducation gratuite", "Des services fédéraux bilingues", "L'emploi garanti", "La retraite anticipée"], correct: 1 },
      ],
    },
  ],
  B2: [
    {
      title: "L'impact de la technologie sur l'apprentissage des langues",
      text: "L'avènement des technologies numériques a profondément transformé l'apprentissage des langues secondes. Les applications mobiles, les plateformes en ligne et l'intelligence artificielle offrent désormais des possibilités d'apprentissage personnalisé qui étaient impensables il y a seulement une décennie. Les algorithmes de répétition espacée, par exemple, optimisent la mémorisation du vocabulaire en présentant les mots à des intervalles stratégiquement calculés. De même, les systèmes de reconnaissance vocale permettent aux apprenants de pratiquer leur prononciation et de recevoir un retour immédiat. Toutefois, ces outils technologiques ne remplacent pas l'interaction humaine, qui demeure essentielle pour développer la compétence communicative. Les meilleurs programmes d'apprentissage combinent donc les avantages de la technologie avec l'encadrement d'enseignants qualifiés.",
      wordCount: 118,
      questions: [
        { q: "Qu'est-ce que les algorithmes de répétition espacée optimisent?", options: ["La grammaire", "La mémorisation du vocabulaire", "La prononciation", "L'écriture"], correct: 1 },
        { q: "Que permettent les systèmes de reconnaissance vocale?", options: ["Lire plus vite", "Pratiquer la prononciation", "Écrire des essais", "Traduire des textes"], correct: 1 },
        { q: "Qu'est-ce qui demeure essentiel selon le texte?", options: ["La technologie", "L'interaction humaine", "Les examens", "Les manuels"], correct: 1 },
        { q: "Que combinent les meilleurs programmes?", options: ["Technologie et coût réduit", "Technologie et enseignants qualifiés", "IA et examens", "Applications et jeux"], correct: 1 },
      ],
    },
  ],
  C1: [
    {
      title: "La politique linguistique canadienne : enjeux et perspectives",
      text: "La politique linguistique du Canada, fondée sur le principe du bilinguisme institutionnel, fait l'objet de débats constants quant à son efficacité et sa pertinence dans un contexte de diversité linguistique croissante. Si la Loi sur les langues officielles de 1969, modernisée en 2023, constitue le pilier juridique de cette politique, sa mise en œuvre concrète soulève des défis considérables. Dans la fonction publique fédérale, l'exigence du bilinguisme pour les postes de direction a été critiquée comme étant à la fois insuffisante et excessive : insuffisante parce que la maîtrise réelle des deux langues officielles reste souvent superficielle, et excessive parce qu'elle peut constituer une barrière à l'avancement pour des candidats autrement qualifiés. Par ailleurs, l'émergence de nouvelles réalités linguistiques, notamment l'importance croissante des langues autochtones et des langues d'immigration, invite à repenser le cadre bilingue traditionnel vers un modèle plus inclusif de plurilinguisme.",
      wordCount: 148,
      questions: [
        { q: "Sur quel principe repose la politique linguistique canadienne?", options: ["Le multilinguisme", "Le bilinguisme institutionnel", "L'unilinguisme", "Le plurilinguisme"], correct: 1 },
        { q: "En quelle année la Loi sur les langues officielles a-t-elle été modernisée?", options: ["2019", "2021", "2023", "2025"], correct: 2 },
        { q: "Pourquoi l'exigence du bilinguisme est-elle critiquée comme insuffisante?", options: ["Elle coûte trop cher", "La maîtrise reste souvent superficielle", "Elle exclut les immigrants", "Elle ne concerne que le français"], correct: 1 },
        { q: "Vers quel modèle le texte suggère-t-il d'évoluer?", options: ["L'unilinguisme anglais", "Le bilinguisme renforcé", "Le plurilinguisme inclusif", "L'immersion totale"], correct: 2 },
      ],
    },
  ],
};

type Phase = "select" | "reading" | "questions" | "results";

export default function ReadingLab() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const isFr = language === "fr";
  const utils = trpc.useUtils();
  const saveResult = trpc.readingLab.saveResult.useMutation({
    onSuccess: () => { utils.readingLab.history.invalidate(); utils.readingLab.stats.invalidate(); },
  });
  const { data: history } = trpc.readingLab.history.useQuery(undefined, { enabled: !!user });
  const { data: stats } = trpc.readingLab.stats.useQuery(undefined, { enabled: !!user });

  const [phase, setPhase] = useState<Phase>("select");
  const [selectedLevel, setSelectedLevel] = useState("B1");
  const [passageIndex, setPassageIndex] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const passage = useMemo(() => PASSAGES[selectedLevel]?.[passageIndex], [selectedLevel, passageIndex]);

  useEffect(() => {
    if (phase !== "reading") return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, startTime]);

  const startReading = useCallback(() => {
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setAnswers([]);
    setPhase("reading");
  }, []);

  const finishReading = useCallback(() => {
    setPhase("questions");
  }, []);

  const answerQuestion = useCallback((qIndex: number, optionIndex: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }, []);

  const submitAnswers = useCallback(() => {
    if (!passage) return;
    const correct = passage.questions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const wpm = Math.round((passage.wordCount / totalTime) * 60);
    const score = Math.round((correct / passage.questions.length) * 100);

    saveResult.mutate({
      passageTitle: passage.title,
      cefrLevel: selectedLevel as "A1" | "A2" | "B1" | "B2" | "C1",
      wordsPerMinute: wpm,
      score,
      totalQuestions: passage.questions.length,
      correctAnswers: correct,
      timeSpentSeconds: totalTime,
      language: "fr",
    });

    setPhase("results");
  }, [passage, answers, startTime, selectedLevel, saveResult]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (authLoading) return (
    <div className="flex h-screen items-center justify-center" role="status" aria-label={t("skillLabs.loading")}>
      <div className="animate-spin w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full" />
      <span className="sr-only">{t("skillLabs.loading")}</span>
    </div>
  );
  if (!user) { window.location.href = getLoginUrl(); return null; }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-white/[0.06] dark:backdrop-blur-sm">
      <Sidebar />
      <main className="flex-1 overflow-y-auto" role="main" aria-label={t("reading.title")}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground flex items-center gap-3">
                <span className="material-icons text-teal-700" aria-hidden="true">auto_stories</span>
                {t("reading.title")}
              </h1>
              <p className="text-gray-500 mt-1">{isFr ? "Améliorez votre vitesse de lecture et votre compréhension" : "Improve your reading speed and comprehension"}</p>
            </div>
            <button onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-teal-700 border border-teal-700 flex items-center gap-2 hover:bg-teal-700/5 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
              aria-label={showHistory ? t("grammar.practice") : t("reading.history")}>
              <span className="material-icons text-base" aria-hidden="true">{showHistory ? "play_circle" : "history"}</span>
              {showHistory ? t("grammar.practice") : t("reading.history")}
            </button>
          </div>

          {/* Stats Bar */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" role="region" aria-label={t("reading.stats")}>
              {[
                { label: t("reading.totalExercises"), value: stats.totalExercises ?? 0, icon: "assignment", color: "var(--brand-teal, var(--teal))" },
                { label: t("reading.avgScore"), value: `${stats.avgScore ?? 0}%`, icon: "grade", color: "var(--semantic-warning, var(--warning))" },
                { label: isFr ? "MPM moy." : "Avg WPM", value: stats.avgWpm ?? 0, icon: "speed", color: "var(--color-violet-500, var(--accent-purple))" },
                { label: t("grammar.totalTime"), value: `${Math.round((stats.totalTime ?? 0) / 60)}m`, icon: "timer", color: "var(--semantic-danger, var(--danger))" },
              ].map((s, i) => (
                <div key={i} className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl p-4 border border-gray-100 dark:border-white/15 shadow-sm text-center" role="status">
                  <span className="material-icons text-2xl mb-1" style={{ color: s.color }} aria-hidden="true">{s.icon}</span>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {showHistory ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">{t("reading.history")}</h2>
              {!history?.length ? (
                <div className="text-center py-8 md:py-12 lg:py-16" role="status">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                    <span className="material-icons text-xl md:text-3xl lg:text-4xl text-teal-700/60" aria-hidden="true">menu_book</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-muted-foreground mb-2">{t("reading.emptyTitle")}</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">{t("reading.emptyDesc")}</p>
                </div>
              ) : history.map((h: any, i: number) => (
                <div key={i} className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl p-4 border border-gray-100 dark:border-white/15 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{h.passageTitle}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-700/10 text-teal-700">{h.cefrLevel}</span>
                      <span>{h.correctAnswers}/{h.totalQuestions} {t("grammar.correct").toLowerCase()}</span>
                      <span>{h.wordsPerMinute} {isFr ? "MPM" : "WPM"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: (h.score ?? 0) >= 80 ? "var(--semantic-success, var(--success))" : (h.score ?? 0) >= 60 ? "var(--semantic-warning, var(--warning))" : "var(--semantic-danger, var(--danger))" }} aria-label={`${t("grammar.score")}: ${h.score}%`}>{h.score}%</div>
                    <div className="text-xs text-gray-400">{formatTime(h.timeSpentSeconds ?? 0)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : phase === "select" ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">{t("grammar.chooseLevel")}</h2>
              <div className="flex gap-3 mb-6 flex-wrap" role="radiogroup" aria-label={t("grammar.chooseLevel")}>
                {["A1", "A2", "B1", "B2", "C1"].map(level => (
                  <button key={level} onClick={() => { setSelectedLevel(level); setPassageIndex(0); }}
                    role="radio" aria-checked={selectedLevel === level}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/30 ${selectedLevel === level ? "bg-teal-700 text-white shadow-md" : "bg-white dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 text-gray-600 border border-gray-200 dark:border-white/15 hover:border-teal-700"}`}>
                    {level}
                  </button>
                ))}
              </div>
              <div className="space-y-4" role="list" aria-label={t("reading.passage")}>
                {PASSAGES[selectedLevel]?.map((p, i) => (
                  <div key={i} role="listitem"
                    className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-white/15 shadow-sm hover:shadow-md transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-teal-700/30"
                    onClick={() => { setPassageIndex(i); startReading(); }}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPassageIndex(i); startReading(); }}}
                    tabIndex={0}
                    aria-label={`${p.title} — ${p.wordCount} ${isFr ? "mots" : "words"} — ${p.questions.length} questions`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-foreground text-lg">{p.title}</h3>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                          <span>{p.wordCount} {isFr ? "mots" : "words"}</span>
                          <span>{p.questions.length} questions</span>
                        </div>
                      </div>
                      <span className="material-icons text-teal-700 text-lg md:text-2xl lg:text-3xl" aria-hidden="true">play_circle</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : phase === "reading" ? (
            <div role="region" aria-label={passage?.title}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-teal-700/10 text-teal-700">{selectedLevel}</span>
                  <h2 className="text-lg font-semibold text-gray-900">{passage?.title}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 flex items-center gap-1" aria-live="polite">
                    <span className="material-icons text-base" aria-hidden="true">timer</span>
                    {formatTime(elapsedSeconds)}
                  </div>
                  <button onClick={finishReading}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                    {isFr ? "Lecture terminée" : "Done Reading"}
                  </button>
                </div>
              </div>
              <article className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl p-8 border border-gray-100 dark:border-white/15 shadow-sm">
                <p className="text-lg leading-relaxed text-gray-800 dark:text-foreground font-serif">{passage?.text}</p>
              </article>
              <div className="text-center mt-4 text-sm text-gray-400">
                {passage?.wordCount} {isFr ? "mots" : "words"} — {isFr ? "Lisez attentivement, puis cliquez sur « Lecture terminée » pour répondre aux questions" : "Read carefully, then click \"Done Reading\" to answer questions"}
              </div>
            </div>
          ) : phase === "questions" ? (
            <div role="region" aria-label={t("reading.questions")}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">{isFr ? "Questions de compréhension" : "Comprehension Questions"}</h2>
                <div className="text-sm text-gray-500" aria-live="polite">
                  {answers.filter(a => a !== undefined).length}/{passage?.questions.length} {isFr ? "répondu" : "answered"}
                </div>
              </div>
              <div className="space-y-6">
                {passage?.questions.map((q, qi) => (
                  <div key={qi} className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-white/15 shadow-sm">
                    <p className="font-semibold text-gray-900 dark:text-foreground mb-4">{qi + 1}. {q.q}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label={q.q}>
                      {q.options.map((opt, oi) => (
                        <button key={oi} onClick={() => answerQuestion(qi, oi)}
                          role="radio" aria-checked={answers[qi] === oi}
                          className={`p-3 rounded-xl text-sm text-left transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/30 ${answers[qi] === oi ? "bg-teal-700 text-white shadow-md" : "bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 border border-gray-200"}`}>
                          <span className="font-semibold mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-4">
                <span className="material-icons text-[10px] align-middle mr-1" aria-hidden="true">keyboard</span>
                {isFr ? "Cliquez sur A, B, C ou D pour répondre" : "Click A, B, C, or D to answer"}
              </p>
              <div className="mt-4 flex justify-end">
                <button onClick={submitAnswers}
                  disabled={answers.filter(a => a !== undefined).length < (passage?.questions.length ?? 0)}
                  className="px-6 py-3 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                  {t("grammar.submit")}
                </button>
              </div>
            </div>
          ) : (
            <div role="region" aria-label={t("grammar.drillComplete")}>
              <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-2xl p-8 border border-gray-100 dark:border-white/15 shadow-sm text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
                  <span className="material-icons text-xl md:text-3xl lg:text-4xl text-amber-500" aria-hidden="true">emoji_events</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">{t("grammar.drillComplete")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {(() => {
                    const correct = passage?.questions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0) ?? 0;
                    const total = passage?.questions.length ?? 1;
                    const totalTime = Math.floor((Date.now() - startTime) / 1000);
                    const wpm = Math.round(((passage?.wordCount ?? 0) / totalTime) * 60);
                    const score = Math.round((correct / total) * 100);
                    return [
                      { label: t("grammar.score"), value: `${score}%`, color: score >= 80 ? "var(--semantic-success, var(--success))" : score >= 60 ? "var(--semantic-warning, var(--warning))" : "var(--semantic-danger, var(--danger))" },
                      { label: isFr ? "Vitesse de lecture" : "Reading Speed", value: `${wpm} ${isFr ? "MPM" : "WPM"}`, color: "var(--color-violet-500, var(--accent-purple))" },
                      { label: isFr ? "Temps" : "Time", value: formatTime(totalTime), color: "var(--brand-teal, var(--teal))" },
                    ].map((r, i) => (
                      <div key={i} role="status">
                        <div className="text-lg md:text-2xl lg:text-3xl font-bold" style={{ color: r.color }}>{r.value}</div>
                        <div className="text-sm text-gray-500 mt-1">{r.label}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="space-y-4 mb-8" role="list" aria-label={isFr ? "Résultats détaillés" : "Detailed results"}>
                {passage?.questions.map((q, qi) => {
                  const isCorrect = answers[qi] === q.correct;
                  return (
                    <div key={qi} role="listitem" className={`rounded-xl p-4 border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      <div className="flex items-start gap-2">
                        <span className={`material-icons text-lg ${isCorrect ? "text-green-600" : "text-red-600"}`} aria-hidden="true">
                          {isCorrect ? "check_circle" : "cancel"}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{q.q}</p>
                          {!isCorrect && (
                            <p className="text-sm mt-1">
                              <span className="text-red-600">{isFr ? "Votre réponse" : "Your answer"}: {q.options[answers[qi]]}</span>
                              <span className="text-green-600 ml-3">{t("grammar.correct")}: {q.options[q.correct]}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 justify-center">
                <button onClick={() => { setPhase("select"); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-teal-700 border border-teal-700 hover:bg-teal-700/5 focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                  {t("grammar.chooseAnother")}
                </button>
                <button onClick={startReading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/30">
                  {t("grammar.tryAgain")}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
