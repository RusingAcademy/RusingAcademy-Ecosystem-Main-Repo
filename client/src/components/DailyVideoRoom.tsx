// client/src/components/DailyVideoRoom.tsx — Phase 10.1: Daily.co Video Room Component
import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  roomUrl: string;
  token: string;
  userName?: string;
  onLeave?: () => void;
  onError?: (error: string) => void;
}

type CallState = "idle" | "joining" | "joined" | "leaving" | "error";

export function DailyVideoRoom({ roomUrl, token, userName, onLeave, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<any>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [participantCount, setParticipantCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLeave = useCallback(() => {
    setCallState("leaving");
    callFrameRef.current?.leave();
    callFrameRef.current?.destroy();
    callFrameRef.current = null;
    setCallState("idle");
    onLeave?.();
  }, [onLeave]);

  useEffect(() => {
    if (!containerRef.current || !roomUrl || !token) return;

    let destroyed = false;

    const initCall = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const DailyIframe = (await import("@daily-co/daily-js")).default;

        if (destroyed) return;

        setCallState("joining");

        callFrameRef.current = DailyIframe.createFrame(containerRef.current!, {
          showLeaveButton: true,
          showFullscreenButton: true,
          iframeStyle: {
            width: "100%",
            height: "100%",
            minHeight: "500px",
            border: "none",
            borderRadius: "12px",
          },
        });

        // Event listeners
        callFrameRef.current.on("joined-meeting", () => {
          if (!destroyed) setCallState("joined");
        });

        callFrameRef.current.on("left-meeting", () => {
          if (!destroyed) {
            setCallState("idle");
            onLeave?.();
          }
        });

        callFrameRef.current.on("participant-joined", () => {
          if (!destroyed) {
            const participants = callFrameRef.current?.participants();
            setParticipantCount(Object.keys(participants || {}).length);
          }
        });

        callFrameRef.current.on("participant-left", () => {
          if (!destroyed) {
            const participants = callFrameRef.current?.participants();
            setParticipantCount(Object.keys(participants || {}).length);
          }
        });

        callFrameRef.current.on("error", (event: any) => {
          if (!destroyed) {
            const msg = event?.errorMsg || "An error occurred";
            setErrorMessage(msg);
            setCallState("error");
            onError?.(msg);
          }
        });

        // Join the call
        await callFrameRef.current.join({
          url: roomUrl,
          token,
          userName: userName || "Participant",
        });
      } catch (err: any) {
        if (!destroyed) {
          const msg = err?.message || "Failed to join video call";
          setErrorMessage(msg);
          setCallState("error");
          onError?.(msg);
        }
      }
    };

    initCall();

    return () => {
      destroyed = true;
      if (callFrameRef.current) {
        callFrameRef.current.leave();
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [roomUrl, token, userName, onLeave, onError]);

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <div className="text-red-600 font-semibold mb-2">Video Error</div>
        <p className="text-red-500 text-sm">{errorMessage}</p>
        <button
          onClick={() => {
            setErrorMessage(null);
            setCallState("idle");
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              callState === "joined"
                ? "bg-green-500 animate-pulse"
                : callState === "joining"
                ? "bg-yellow-500 animate-pulse"
                : "bg-gray-400"
            }`}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {callState === "joined"
              ? `Live — ${participantCount} participant${participantCount !== 1 ? "s" : ""}`
              : callState === "joining"
              ? "Connecting..."
              : "Ready to join"}
          </span>
        </div>
        {callState === "joined" && (
          <button
            onClick={handleLeave}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Leave Call
          </button>
        )}
      </div>

      {/* Video container */}
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden bg-gray-900 shadow-lg"
        style={{ minHeight: "500px" }}
      />

      {/* Loading overlay */}
      {callState === "joining" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3" />
            <p className="text-white text-sm">Joining video session...</p>
          </div>
        </div>
      )}
    </div>
  );
}
