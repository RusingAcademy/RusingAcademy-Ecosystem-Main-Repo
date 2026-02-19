// client/src/components/SessionNotes.tsx — Phase 3: Session Notes for Coaches
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../contexts/LanguageContext";
import { FileText, Save, Clock, CheckCircle } from "lucide-react";

const t = {
  en: {
    title: "Session Notes",
    placeholder: "Write your session notes here...\n\n• Key topics covered\n• Learner strengths\n• Areas for improvement\n• Homework/next steps",
    save: "Save Notes",
    saving: "Saving...",
    saved: "Saved",
    lastSaved: "Last saved",
    autoSave: "Auto-save enabled",
    characters: "characters",
  },
  fr: {
    title: "Notes de session",
    placeholder: "Rédigez vos notes de session ici...\n\n• Sujets principaux abordés\n• Points forts de l'apprenant\n• Points à améliorer\n• Devoirs/prochaines étapes",
    save: "Sauvegarder",
    saving: "Sauvegarde...",
    saved: "Sauvegardé",
    lastSaved: "Dernière sauvegarde",
    autoSave: "Sauvegarde auto activée",
    characters: "caractères",
  },
};

interface SessionNotesProps {
  sessionId: number;
  initialNotes?: string;
  onSave: (notes: string) => Promise<void>;
  readOnly?: boolean;
}

export function SessionNotes({ sessionId, initialNotes = "", onSave, readOnly = false }: SessionNotesProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const labels = t[lang];

  const [notes, setNotes] = useState(initialNotes);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      await onSave(notes);
      setSaveStatus("saved");
      setLastSavedAt(new Date());
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("idle");
    }
  }, [notes, onSave]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle className="text-base">{labels.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {lastSavedAt && (
            <span className="text-xs text-muted-foreground">
              {labels.lastSaved}: {lastSavedAt.toLocaleTimeString(lang === "fr" ? "fr-CA" : "en-CA", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          {saveStatus === "saved" && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              {labels.saved}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={labels.placeholder}
          className="min-h-[200px] resize-y font-mono text-sm"
          readOnly={readOnly}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {notes.length} {labels.characters}
          </span>
          {!readOnly && (
            <Button
              onClick={handleSave}
              disabled={saveStatus === "saving" || notes === initialNotes}
              size="sm"
            >
              {saveStatus === "saving" ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  {labels.saving}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {labels.save}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
