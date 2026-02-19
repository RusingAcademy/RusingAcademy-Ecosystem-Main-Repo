/**
 * AuthDivider - or separator between OAuth and email form
 * Phase 1: Auth UI/UX Harmonization
 */

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "or" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-white/30 text-[10px] font-semibold tracking-wider uppercase">
        {text}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export default AuthDivider;
