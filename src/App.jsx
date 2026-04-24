import { useEffect } from "react";
import CanvasDisplay from "./components/CanvasDisplay";
import ControlPanel from "./components/ControlPanel";
import { useReactionTest } from "./hooks/useReactionTest";

function App() {
  const {
    phase,
    countdownValue,
    currentStimulus,
    currentTrialIndex,
    totalTrials,
    feedback,
    results,
    startSession,
    submitResponse,
    markStimulusRendered,
  } = useReactionTest();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (event.code === "Space") {
        event.preventDefault();
        if (phase === "idle" || phase === "finished") {
          startSession();
        }
        return;
      }

      if (key === "a") {
        submitResponse("alphabet");
      }

      if (key === "d") {
        submitResponse("digit");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, startSession, submitResponse]);

  return (
    <main className="mx-auto flex min-h-svh w-full  flex-col justify-center bg-[#fffefd] px-3 py-4 sm:px-5 sm:py-5">
      <header className="mb-4 text-center sm:mb-5">
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Reaction Time Lab
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          This lab demonstrates human perception, cognition, and motor speed by
          timing your responses.
        </p>
        
      </header>

      <CanvasDisplay
        phase={phase}
        countdownValue={countdownValue}
        stimulus={currentStimulus}
        feedback={feedback}
        results={results}
        trialIndex={currentTrialIndex}
        totalTrials={totalTrials}
        onStimulusRendered={markStimulusRendered}
      />

      <ControlPanel
        disabled={phase !== "stimulus"}
        onAlphabet={() => submitResponse("alphabet")}
        onDigit={() => submitResponse("digit")}
      />
    </main>
  );
}

export default App;
