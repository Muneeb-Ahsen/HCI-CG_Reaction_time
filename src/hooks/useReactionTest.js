import { useCallback, useEffect, useRef, useState } from "react";

const TOTAL_TRIALS = 10;
const COUNTDOWN_START = 3;
const FEEDBACK_DELAY_MS = 900;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

function createStimulus() {
  const isAlphabet = Math.random() < 0.5;
  const source = isAlphabet ? LETTERS : DIGITS;
  const value = source[Math.floor(Math.random() * source.length)];

  return {
    value,
    kind: isAlphabet ? "alphabet" : "digit",
  };
}

function summarizeResults(reactionTimes, correctness) {
  const totalCorrect = correctness.filter(Boolean).length;
  const averageRt =
    reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;

  return {
    averageRt,
    fastestRt: Math.min(...reactionTimes),
    slowestRt: Math.max(...reactionTimes),
    accuracy: (totalCorrect / correctness.length) * 100,
    totalCorrect,
  };
}

export function useReactionTest() {
  const [phase, setPhase] = useState("idle");
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_START);
  const [currentStimulus, setCurrentStimulus] = useState(null);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [correctness, setCorrectness] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState(null);

  const startTimeRef = useRef(0);
  const canRespondRef = useRef(false);
  const trialIndexRef = useRef(0);
  const reactionTimesRef = useRef([]);
  const correctnessRef = useRef([]);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId));
    timersRef.current = [];
  }, []);

  const queueTimer = useCallback((callback, delay) => {
    const timerId = setTimeout(callback, delay);
    timersRef.current.push(timerId);
  }, []);

  const showStimulus = useCallback(() => {
    setCurrentStimulus(createStimulus());
    setPhase("stimulus");
    setFeedback(null);
    canRespondRef.current = false;
    startTimeRef.current = 0;
  }, []);

  const startCountdown = useCallback(() => {
    setCountdownValue(COUNTDOWN_START);
    setCurrentStimulus(null);
    setPhase("countdown");
    canRespondRef.current = false;

    queueTimer(() => setCountdownValue(2), 1000);
    queueTimer(() => setCountdownValue(1), 2000);
    queueTimer(showStimulus, 3000);
  }, [queueTimer, showStimulus]);

  const startSession = useCallback(() => {
    if (phase === "countdown" || phase === "stimulus" || phase === "feedback") {
      return;
    }

    clearTimers();
    trialIndexRef.current = 0;
    reactionTimesRef.current = [];
    correctnessRef.current = [];
    canRespondRef.current = false;
    startTimeRef.current = 0;

    setCurrentTrialIndex(0);
    setReactionTimes([]);
    setCorrectness([]);
    setFeedback(null);
    setResults(null);

    startCountdown();
  }, [clearTimers, phase, startCountdown]);

  const markStimulusRendered = useCallback(
    (renderTime) => {
      if (phase !== "stimulus" || canRespondRef.current) {
        return;
      }

      startTimeRef.current =
        typeof renderTime === "number" ? renderTime : performance.now();
      canRespondRef.current = true;
    },
    [phase],
  );

  const submitResponse = useCallback(
    (responseKind) => {
      if (phase !== "stimulus" || !canRespondRef.current || !currentStimulus) {
        return;
      }

      canRespondRef.current = false;

      const rt = performance.now() - startTimeRef.current;
      const isCorrect = currentStimulus.kind === responseKind;
      const nextReactionTimes = [...reactionTimesRef.current, rt];
      const nextCorrectness = [...correctnessRef.current, isCorrect];

      reactionTimesRef.current = nextReactionTimes;
      correctnessRef.current = nextCorrectness;

      setReactionTimes(nextReactionTimes);
      setCorrectness(nextCorrectness);
      setFeedback({ isCorrect, rt });
      setPhase("feedback");

      queueTimer(() => {
        const lastTrial = trialIndexRef.current + 1 >= TOTAL_TRIALS;

        if (lastTrial) {
          setResults(summarizeResults(nextReactionTimes, nextCorrectness));
          setPhase("finished");
          return;
        }

        trialIndexRef.current += 1;
        setCurrentTrialIndex(trialIndexRef.current);
        startCountdown();
      }, FEEDBACK_DELAY_MS);
    },
    [currentStimulus, phase, queueTimer, startCountdown],
  );

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    phase,
    countdownValue,
    currentStimulus,
    currentTrialIndex,
    reactionTimes,
    correctness,
    feedback,
    results,
    totalTrials: TOTAL_TRIALS,
    startSession,
    submitResponse,
    markStimulusRendered,
  };
}
