// client/src/components/VideoRoom.tsx — Phase 3: Native Video Room (Daily.co)
import { useState, useCallback, useEffect, useRef } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  Users,
  Maximize,
  Minimize,
  Loader2,
} from "lucide-react";

const t = {
  en: {
    startVideo: "Start Video Session",
    joinVideo: "Join Video Session",
    endVideo: "End Session",
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    waiting: "Waiting for participant...",
    videoDisabled: "Native video is not enabled",
    configureDaily: "Contact admin to configure Daily.co API key",
    camera: "Camera",
    microphone: "Microphone",
    screenShare: "Screen Share",
    fullscreen: "Fullscreen",
    participants: "Participants",
    recording: "Recording",
  },
  fr: {
    startVideo: "Démarrer la vidéo",
    joinVideo: "Rejoindre la vidéo",
    endVideo: "Terminer la session",
    connecting: "Connexion...",
    connected: "Connecté",
    disconnected: "Déconnecté",
    waiting: "En attente du participant...",
    videoDisabled: "La vidéo native n'est pas activée",
    configureDaily: "Contactez l'admin pour configurer la clé API Daily.co",
    camera: "Caméra",
    microphone: "Microphone",
    screenShare: "Partage d'écran",
    fullscreen: "Plein écran",
    participants: "Participants",
    recording: "Enregistrement",
  },
};

interface VideoRoomProps {
  sessionId: number;
  isCoach: boolean;
  onEnd?: () => void;
}

export function VideoRoom({ sessionId, isCoach, onEnd }: VideoRoomProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const labels = t[lang];

  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "ended">("idle");
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: videoConfig } = trpc.video.isEnabled.useQuery();
  const createRoom = trpc.video.createRoom.useMutation();
  const joinRoom = trpc.video.joinRoom.useMutation();
  const endRoom = trpc.video.endRoom.useMutation();

  const handleStart = useCallback(async () => {
    setStatus("connecting");
    try {
      if (isCoach) {
        const result = await createRoom.mutateAsync({ sessionId });
        if (iframeRef.current) {
          iframeRef.current.src = `${result.url}?t=${result.token}`;
        }
      } else {
        const result = await joinRoom.mutateAsync({ sessionId });
        if (iframeRef.current) {
          iframeRef.current.src = `${result.url}?t=${result.token}`;
        }
      }
      setStatus("connected");
    } catch (error) {
      console.error("Failed to start video:", error);
      setStatus("idle");
    }
  }, [sessionId, isCoach, createRoom, joinRoom]);

  const handleEnd = useCallback(async () => {
    try {
      if (isCoach) {
        await endRoom.mutateAsync({ sessionId });
      }
      setStatus("ended");
      onEnd?.();
    } catch (error) {
      console.error("Failed to end video:", error);
    }
  }, [sessionId, isCoach, endRoom, onEnd]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!videoConfig?.enabled) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <VideoOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-medium">{labels.videoDisabled}</p>
          <p className="text-sm text-muted-foreground mt-1">{labels.configureDaily}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            <CardTitle className="text-base">
              {status === "connected" ? labels.connected : status === "connecting" ? labels.connecting : labels.disconnected}
            </CardTitle>
            {status === "connected" && (
              <Badge variant="default" className="bg-green-500 text-xs">LIVE</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {status === "connected" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  title={labels.camera}
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-red-500" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  title={labels.microphone}
                >
                  {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleFullscreen}
                  title={labels.fullscreen}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/30">
              <Video className="h-16 w-16 text-muted-foreground mb-4" />
              <Button onClick={handleStart} size="lg">
                <Phone className="h-5 w-5 mr-2" />
                {isCoach ? labels.startVideo : labels.joinVideo}
              </Button>
            </div>
          )}

          {status === "connecting" && (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/30">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">{labels.connecting}</p>
            </div>
          )}

          {status === "connected" && (
            <div className="relative">
              <iframe
                ref={iframeRef}
                className="w-full aspect-video border-0"
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                title="Video Session"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleEnd}
                  className="rounded-full px-8"
                >
                  <PhoneOff className="h-5 w-5 mr-2" />
                  {labels.endVideo}
                </Button>
              </div>
            </div>
          )}

          {status === "ended" && (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/30">
              <PhoneOff className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">{labels.disconnected}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
