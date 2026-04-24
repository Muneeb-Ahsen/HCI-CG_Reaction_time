function ControlPanel({ disabled, onAlphabet, onDigit }) {
  const baseClasses =
    "min-w-32 sm:min-w-44 rounded-2xl border px-6 sm:px-7 py-3 text-base font-semibold tracking-[0.08em] transition-all duration-200 font-['Plus_Jakarta_Sans']";

  return (
    <div className="mt-5 flex items-center justify-center gap-4 sm:mt-6 sm:gap-14 lg:gap-40">
      <button
        type="button"
        onClick={onAlphabet}
        disabled={disabled}
        className={`${baseClasses} flex flex-col items-center justify-center gap-0.5 border-slate-400 bg-gradient-to-b from-[#f3f8fd] to-[#d7e6f6] text-slate-900 shadow-[0_14px_24px_-12px_rgba(30,64,175,0.55),0_3px_0_0_#93c5fd] enabled:hover:-translate-y-1 enabled:hover:shadow-[0_18px_30px_-12px_rgba(30,64,175,0.65),0_4px_0_0_#60a5fa] enabled:active:translate-y-0 enabled:active:shadow-[0_8px_14px_-10px_rgba(30,64,175,0.55),0_2px_0_0_#60a5fa] disabled:cursor-not-allowed disabled:opacity-65`}
      >
        <span className="text-lg leading-none">A</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-600">
          Alphabet
        </span>
      </button>
      <button
        type="button"
        onClick={onDigit}
        disabled={disabled}
        className={`${baseClasses} flex flex-col items-center justify-center gap-0.5 border-slate-400 bg-gradient-to-b from-[#f3f8fd] to-[#d7e6f6] text-slate-900 shadow-[0_14px_24px_-12px_rgba(30,64,175,0.55),0_3px_0_0_#93c5fd] enabled:hover:-translate-y-1 enabled:hover:shadow-[0_18px_30px_-12px_rgba(30,64,175,0.65),0_4px_0_0_#60a5fa] enabled:active:translate-y-0 enabled:active:shadow-[0_8px_14px_-10px_rgba(30,64,175,0.55),0_2px_0_0_#60a5fa] disabled:cursor-not-allowed disabled:opacity-65`}
      >
        <span className="text-lg leading-none">D</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-600">
          Digit
        </span>
      </button>
    </div>
  );
}

export default ControlPanel;
