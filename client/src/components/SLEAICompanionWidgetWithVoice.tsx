/**
 * SLEAICompanionWidget with Voice Integration - Multi-Coach Version
 * Premium floating AI companion widget with voice conversation capabilities
 * 
 * @description Enhanced widget that includes a "Talk to Coach" button
 * opening the VoiceConversationPanel for real-time voice interactions.
 * 
 * @author Manus AI
 * @version 2.0.0 - Multi-coach architecture
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mic, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  MessageCircle,
  ChevronRight,
  Sparkles,
  Volume2
} from 'lucide-react';
import { VoiceConversationPanel } from './VoiceConversationPanel';
import { getDefaultCoach, getActiveCoaches } from '@shared/voiceCoaches';

interface SLEAICompanionWidgetProps {
  initialLanguage?: 'en' | 'fr';
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export function SLEAICompanionWidgetWithVoice({
  initialLanguage = 'en',
  position = 'bottom-right',
  className = '',
}: SLEAICompanionWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>(initialLanguage);
  const [breathePhase, setBreathePhase] = useState(0);
  const widgetRef = useRef<HTMLDivElement>(null);

  const defaultCoach = getDefaultCoach();
  const hasMultipleCoaches = getActiveCoaches().length > 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathePhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        if (isExpanded && !isVoicePanelOpen) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, isVoicePanelOpen]);

  const breatheScale = 1 + Math.sin(breathePhase * Math.PI / 180) * 0.03;
  const glowIntensity = 0.3 + Math.sin(breathePhase * Math.PI / 180) * 0.2;

  const menuItems = [
    {
      id: 'voice',
      icon: Mic,
      label: language === 'en' ? 'Talk to Coach' : 'Parler au Coach',
      description: language === 'en' 
        ? `Voice conversation with ${defaultCoach.name}` 
        : `Conversation vocale avec ${defaultCoach.name}`,
      color: defaultCoach.themeColor,
      highlight: true,
      action: () => {
        setIsVoicePanelOpen(true);
        setIsExpanded(false);
      },
    },
    {
      id: 'practice',
      icon: MessageCircle,
      label: language === 'en' ? 'Voice Practice' : 'Pratique Orale',
      description: language === 'en' ? 'Improve your speaking skills' : 'Améliorez vos compétences orales',
      color: '#10B981',
      href: '/practice/voice',
    },
    {
      id: 'placement',
      icon: GraduationCap,
      label: language === 'en' ? 'Placement Tests' : 'Tests de Placement',
      description: language === 'en' ? 'Assess your current level' : 'Évaluez votre niveau actuel',
      color: '#6366F1',
      href: '/assessment/placement',
    },
    {
      id: 'simulations',
      icon: FileText,
      label: language === 'en' ? 'Exam Simulations' : "Simulations d'Examen",
      description: language === 'en' ? 'Practice with real exam formats' : 'Pratiquez avec des formats réels',
      color: '#F59E0B',
      href: '/practice/simulations',
    },
    {
      id: 'resources',
      icon: BookOpen,
      label: language === 'en' ? 'Learning Resources' : "Ressources d'Apprentissage",
      description: language === 'en' ? 'Study materials and guides' : "Matériel d'étude et guides",
      color: '#EC4899',
      href: '/resources',
    },
  ];

  const positionClasses = position === 'bottom-right' ? 'right-6 bottom-6' : 'left-6 bottom-6';

  return (
    <>
      <div ref={widgetRef} className={`fixed ${positionClasses} z-40 ${className}`}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute bottom-20 right-0 w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="relative px-5 py-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-2 overflow-hidden"
                      style={{ borderColor: defaultCoach.themeColor }}
                    >
                      {defaultCoach.avatar ? (
                        <img src={defaultCoach.avatar} alt={defaultCoach.name} className="w-full h-full object-cover" />
                      ) : (
                        <Sparkles className="w-5 h-5" style={{ color: defaultCoach.themeColor }} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        {language === 'en' ? 'SLE AI Companion' : 'Compagnon IA ELS'}
                      </h3>
                      <p className="text-slate-400 text-xs">
                        {language === 'en' ? 'Your learning assistant' : "Votre assistant d'apprentissage"}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsExpanded(false)} className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              <div className="p-3 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                        item.highlight ? 'bg-gradient-to-r from-slate-700/70 to-slate-800/50 border border-slate-600/50' : 'hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">{item.label}</span>
                          {item.highlight && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: `${item.color}30`, color: item.color }}>
                              {language === 'en' ? 'NEW' : 'NOUVEAU'}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs">{item.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  );
                  if (item.action) {
                    return <div key={item.id} onClick={item.action}>{content}</div>;
                  }
                  return <a key={item.id} href={item.href} className="block">{content}</a>;
                })}
              </div>
              <div className="px-5 py-3 border-t border-slate-700/50 bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <button onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')} className="text-xs text-slate-400 hover:text-white transition-colors">
                    {language === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
                  </button>
                  <a href="/help" className="text-xs text-slate-400 hover:text-white transition-colors">
                    {language === 'en' ? 'Need help?' : "Besoin d'aide?"}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ transform: `scale(${breatheScale})` }}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg border border-slate-700/50 flex items-center justify-center group overflow-hidden"
        >
          <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at center, ${defaultCoach.themeColor}${Math.round(glowIntensity * 100).toString(16).padStart(2, '0')} 0%, transparent 70%)` }} />
          <div className="relative z-10 w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: defaultCoach.themeColor }}>
            {defaultCoach.avatar ? (
              <img src={defaultCoach.avatar} alt={defaultCoach.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6" style={{ color: defaultCoach.themeColor }} />
              </div>
            )}
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: defaultCoach.themeColor }}
          />
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: defaultCoach.themeColor }}>
            <Volume2 className="w-3 h-3 text-white" />
          </div>
        </motion.button>
      </div>
      <VoiceConversationPanel initialCoachId={defaultCoach.id} initialLanguage={language} isOpen={isVoicePanelOpen} onClose={() => setIsVoicePanelOpen(false)} />
    </>
  );
}

export default SLEAICompanionWidgetWithVoice;
