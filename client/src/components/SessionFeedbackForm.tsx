// client/src/components/SessionFeedbackForm.tsx — Phase 3: Learner → Coach Feedback
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../contexts/LanguageContext";
import { Star, Send, CheckCircle } from "lucide-react";

const t = {
  en: {
    title: "Rate Your Session",
    subtitle: "Your feedback helps coaches improve",
    comment: "Comments (optional)",
    commentPlaceholder: "What did you like? What could be improved?",
    tags: "Quick Tags",
    submit: "Submit Feedback",
    submitting: "Submitting...",
    submitted: "Thank you for your feedback!",
    recommend: "Would you recommend this coach?",
    yes: "Yes",
    no: "No",
  },
  fr: {
    title: "Évaluez votre session",
    subtitle: "Vos commentaires aident les coachs à s'améliorer",
    comment: "Commentaires (optionnel)",
    commentPlaceholder: "Qu'avez-vous aimé ? Que pourrait-on améliorer ?",
    tags: "Tags rapides",
    submit: "Soumettre l'évaluation",
    submitting: "Envoi en cours...",
    submitted: "Merci pour votre évaluation !",
    recommend: "Recommanderiez-vous ce coach ?",
    yes: "Oui",
    no: "Non",
  },
};

const feedbackTags = {
  en: ["Punctual", "Patient", "Knowledgeable", "Engaging", "Well-prepared", "Helpful feedback", "Good pace", "Clear explanations"],
  fr: ["Ponctuel", "Patient", "Compétent", "Engageant", "Bien préparé", "Rétroaction utile", "Bon rythme", "Explications claires"],
};

interface SessionFeedbackFormProps {
  sessionId: number;
  onSubmit: (feedback: { rating: number; comment: string; tags: string[]; wouldRecommend: boolean }) => Promise<void>;
}

export function SessionFeedbackForm({ sessionId, onSubmit }: SessionFeedbackFormProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const labels = t[lang];

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setStatus("submitting");
    try {
      await onSubmit({
        rating,
        comment,
        tags: selectedTags,
        wouldRecommend: wouldRecommend ?? true,
      });
      setStatus("submitted");
    } catch {
      setStatus("idle");
    }
  };

  if (status === "submitted") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium">{labels.submitted}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-10 w-10 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Quick Tags */}
        <div>
          <p className="text-sm font-medium mb-2">{labels.tags}</p>
          <div className="flex flex-wrap gap-2">
            {feedbackTags[lang].map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <p className="text-sm font-medium mb-2">{labels.comment}</p>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={labels.commentPlaceholder}
            className="min-h-[100px]"
          />
        </div>

        {/* Would Recommend */}
        <div>
          <p className="text-sm font-medium mb-2">{labels.recommend}</p>
          <div className="flex gap-2">
            <Button
              variant={wouldRecommend === true ? "default" : "outline"}
              size="sm"
              onClick={() => setWouldRecommend(true)}
            >
              {labels.yes}
            </Button>
            <Button
              variant={wouldRecommend === false ? "destructive" : "outline"}
              size="sm"
              onClick={() => setWouldRecommend(false)}
            >
              {labels.no}
            </Button>
          </div>
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || status === "submitting"}
          className="w-full"
          size="lg"
        >
          {status === "submitting" ? (
            labels.submitting
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {labels.submit}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
