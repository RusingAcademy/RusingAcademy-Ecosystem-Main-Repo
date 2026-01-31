/**
 * Audio Content Mapping for Lessons
 * Maps lesson content to pre-generated pronunciation audio files
 */

export interface AudioPhrase {
  id: string;
  text: string;
  textFr?: string;
  audioUrl: string;
  level: "A" | "B" | "C";
  category: "introduction" | "presentation" | "meeting" | "negotiation" | "technical" | "general";
  duration?: number; // in seconds
}

export interface LessonAudioContent {
  lessonId?: number;
  moduleSlug?: string;
  phrases: AudioPhrase[];
}

// Pre-generated audio files mapping
export const PRONUNCIATION_AUDIO: AudioPhrase[] = [
  // Level A - Basic Introduction
  {
    id: "intro_federal_employee",
    text: "Hello, I am a federal employee. I have been working for the Government of Canada for five years.",
    textFr: "Bonjour, je suis fonctionnaire fédéral. Je travaille au gouvernement du Canada depuis cinq ans.",
    audioUrl: "/audio/pronunciation/intro_federal_employee.mp3",
    level: "A",
    category: "introduction",
    duration: 8,
  },
  
  // Level A - Project Presentation
  {
    id: "project_presentation",
    text: "I would like to present our new project. It is an initiative aimed at improving services to citizens.",
    textFr: "Je voudrais vous présenter notre nouveau projet. Il s'agit d'une initiative visant à améliorer les services aux citoyens.",
    audioUrl: "/audio/pronunciation/project_presentation.mp3",
    level: "A",
    category: "presentation",
    duration: 10,
  },
  
  // Level A - Asking for Details
  {
    id: "asking_details",
    text: "Could you give me more details on this matter? I would like to better understand the issues.",
    textFr: "Pourriez-vous me donner plus de détails sur cette question? Je souhaiterais mieux comprendre les enjeux.",
    audioUrl: "/audio/pronunciation/asking_details.mp3",
    level: "A",
    category: "meeting",
    duration: 7,
  },
  
  // Level B - Meeting Proposal
  {
    id: "meeting_proposal",
    text: "I propose that we organize a meeting next week to discuss this file in detail.",
    textFr: "Je propose que nous organisions une réunion la semaine prochaine pour discuter de ce dossier en détail.",
    audioUrl: "/audio/pronunciation/meeting_proposal.mp3",
    level: "B",
    category: "meeting",
    duration: 7,
  },
  
  // Level B - Collaboration Thanks
  {
    id: "collaboration_thanks",
    text: "Thank you for your collaboration. We have made significant progress on this project.",
    textFr: "Merci pour votre collaboration. Nous avons fait des progrès significatifs sur ce projet.",
    audioUrl: "/audio/pronunciation/collaboration_thanks.mp3",
    level: "B",
    category: "general",
    duration: 6,
  },
  
  // Level B - Budget Constraints
  {
    id: "budget_constraints",
    text: "Regarding the budget, we must respect financial constraints while achieving our objectives.",
    textFr: "En ce qui concerne le budget, nous devons respecter les contraintes financières tout en atteignant nos objectifs.",
    audioUrl: "/audio/pronunciation/budget_constraints.mp3",
    level: "B",
    category: "meeting",
    duration: 8,
  },
  
  // Level B - Recommendation Approach
  {
    id: "recommendation_approach",
    text: "Following our analysis, I recommend adopting a progressive approach for the implementation of this program.",
    textFr: "Suite à notre analyse, je recommande d'adopter une approche progressive pour la mise en œuvre de ce programme.",
    audioUrl: "/audio/pronunciation/recommendation_approach.mp3",
    level: "B",
    category: "presentation",
    duration: 9,
  },
  
  // Level C - Strategic Implications
  {
    id: "strategic_implications",
    text: "It is imperative that we consider the long-term implications of this strategic decision.",
    textFr: "Il est impératif que nous prenions en considération les implications à long terme de cette décision stratégique.",
    audioUrl: "/audio/pronunciation/strategic_implications.mp3",
    level: "C",
    category: "negotiation",
    duration: 7,
  },
  
  // Level C - Policy Coordination
  {
    id: "policy_coordination",
    text: "The implementation of this policy will require close coordination between the various ministries and agencies concerned.",
    textFr: "La mise en œuvre de cette politique nécessitera une coordination étroite entre les différents ministères et organismes concernés.",
    audioUrl: "/audio/pronunciation/policy_coordination.mp3",
    level: "C",
    category: "technical",
    duration: 9,
  },
  
  // PATH II - Level C Advanced Phrases
  
  // Level C - Study Results
  {
    id: "study_results",
    text: "I would like to emphasize that the results of our study clearly demonstrate the need for a complete revision of our current approach.",
    textFr: "Je tiens à souligner que les résultats de notre étude démontrent clairement la nécessité d'une révision complète de notre approche actuelle.",
    audioUrl: "/audio/pronunciation/study_results.mp3",
    level: "C",
    category: "presentation",
    duration: 9,
  },
  
  // Level C - Postpone Decision
  {
    id: "postpone_decision",
    text: "Given the current circumstances, it would be wise to postpone this decision until we have more complete data.",
    textFr: "Compte tenu des circonstances actuelles, il serait judicieux de reporter cette décision jusqu'à ce que nous disposions de données plus complètes.",
    audioUrl: "/audio/pronunciation/postpone_decision.mp3",
    level: "C",
    category: "negotiation",
    duration: 10,
  },
  
  // Level C - Alternative Solutions
  {
    id: "alternative_solutions",
    text: "We understand your concerns and are willing to explore alternative solutions that could satisfy all stakeholders.",
    textFr: "Nous comprenons vos préoccupations et nous sommes disposés à explorer des solutions alternatives qui pourraient satisfaire toutes les parties prenantes.",
    audioUrl: "/audio/pronunciation/alternative_solutions.mp3",
    level: "C",
    category: "negotiation",
    duration: 9,
  },
  
  // Level C - Performance Indicators
  {
    id: "performance_indicators",
    text: "The analysis of performance indicators reveals a significant improvement in operational efficiency over the last quarter.",
    textFr: "L'analyse des indicateurs de performance révèle une amélioration significative de l'efficacité opérationnelle au cours du dernier trimestre.",
    audioUrl: "/audio/pronunciation/performance_indicators.mp3",
    level: "C",
    category: "technical",
    duration: 10,
  },
  
  // Level C - Regulatory Framework
  {
    id: "regulatory_framework",
    text: "The current regulatory framework imposes certain constraints that we must take into account when developing our strategy.",
    textFr: "Le cadre réglementaire actuel nous impose certaines contraintes que nous devons prendre en compte dans l'élaboration de notre stratégie.",
    audioUrl: "/audio/pronunciation/regulatory_framework.mp3",
    level: "C",
    category: "technical",
    duration: 9,
  },
  
  // Level C - Transmit Information
  {
    id: "transmit_info",
    text: "I would be grateful if you could transmit this information to the members of your team as soon as possible.",
    textFr: "Je vous serais reconnaissant de bien vouloir transmettre ces informations aux membres de votre équipe dans les meilleurs délais.",
    audioUrl: "/audio/pronunciation/transmit_info.mp3",
    level: "C",
    category: "general",
    duration: 8,
  },
  
  // Level C - Continuous Improvement
  {
    id: "continuous_improvement",
    text: "This initiative is part of our commitment to the continuous improvement of services offered to Canadians.",
    textFr: "Cette initiative s'inscrit dans le cadre de notre engagement envers l'amélioration continue des services offerts aux Canadiens.",
    audioUrl: "/audio/pronunciation/continuous_improvement.mp3",
    level: "C",
    category: "presentation",
    duration: 8,
  },
];

// Get audio phrases by level
export function getAudioByLevel(level: "A" | "B" | "C"): AudioPhrase[] {
  return PRONUNCIATION_AUDIO.filter((phrase) => phrase.level === level);
}

// Get audio phrases by category
export function getAudioByCategory(category: AudioPhrase["category"]): AudioPhrase[] {
  return PRONUNCIATION_AUDIO.filter((phrase) => phrase.category === category);
}

// Get audio phrase by ID
export function getAudioById(id: string): AudioPhrase | undefined {
  return PRONUNCIATION_AUDIO.find((phrase) => phrase.id === id);
}

// Get all audio for a specific SLE level practice
export function getSLEPracticeAudio(level: "A" | "B" | "C"): AudioPhrase[] {
  const levelMap: Record<string, ("A" | "B" | "C")[]> = {
    A: ["A"],
    B: ["A", "B"],
    C: ["A", "B", "C"],
  };
  
  const includedLevels = levelMap[level] || ["A"];
  return PRONUNCIATION_AUDIO.filter((phrase) => includedLevels.includes(phrase.level));
}

// Lesson to audio mapping
export const LESSON_AUDIO_MAP: Record<string, string[]> = {
  // Path I - Module 1 lessons (Level A)
  "path1_m1_l1": ["intro_federal_employee", "asking_details"],
  "path1_m1_l2": ["project_presentation", "collaboration_thanks"],
  "path1_m1_l3": ["meeting_proposal", "budget_constraints"],
  
  // Path I - Module 2 lessons (Level B)
  "path1_m2_l1": ["recommendation_approach"],
  "path1_m2_l2": ["strategic_implications"],
  "path1_m2_l3": ["policy_coordination"],
  
  // Path II - Module 1 lessons (Level C Advanced)
  "path2_m1_l1": ["study_results", "postpone_decision"],
  "path2_m1_l2": ["alternative_solutions", "performance_indicators"],
  "path2_m1_l3": ["regulatory_framework", "transmit_info"],
  
  // Path II - Module 2 lessons (Level C Expert)
  "path2_m2_l1": ["continuous_improvement", "strategic_implications"],
  "path2_m2_l2": ["policy_coordination", "performance_indicators"],
  
  // SLE Practice sessions
  "sle_level_a": ["intro_federal_employee", "project_presentation", "asking_details"],
  "sle_level_b": ["meeting_proposal", "collaboration_thanks", "budget_constraints", "recommendation_approach"],
  "sle_level_c": ["strategic_implications", "policy_coordination", "study_results", "postpone_decision", "alternative_solutions", "performance_indicators", "regulatory_framework", "transmit_info", "continuous_improvement"],
};

// Get audio for a specific lesson
export function getLessonAudio(lessonKey: string): AudioPhrase[] {
  const audioIds = LESSON_AUDIO_MAP[lessonKey] || [];
  return audioIds
    .map((id) => getAudioById(id))
    .filter((phrase): phrase is AudioPhrase => phrase !== undefined);
}
