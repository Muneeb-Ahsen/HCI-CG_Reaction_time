import { useLayoutEffect, useRef } from "react";

function drawCenteredText(ctx, text, y, fontSize = 72, color = "#0f172a") {
  ctx.fillStyle = color;
  ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", "Jost", "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, ctx.canvas.width / 2, y);
}

function drawGridBackground(ctx, width, height) {
  ctx.fillStyle = "#eef4fa";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#d5dfeb";
  ctx.lineWidth = 1;

  const spacing = 24;

  for (let x = 0; x <= width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }
}

function CanvasDisplay({
  phase,
  countdownValue,
  stimulus,
  feedback,
  results,
  trialIndex,
  totalTrials,
  onStimulusRendered,
}) {
  const canvasRef = useRef(null);
  const statusLabelByPhase = {
    idle: "Ready",
    countdown: "Countdown",
    stimulus: "Respond",
    feedback: "Feedback",
    finished: "Completed",
  };

  const statusStyleByPhase = {
    idle: "border-slate-300 bg-white text-slate-700",
    countdown: "border-rose-300 bg-rose-50 text-rose-700",
    stimulus: "border-sky-300 bg-sky-50 text-sky-700",
    feedback: "border-teal-300 bg-teal-50 text-teal-700",
    finished: "border-indigo-300 bg-indigo-50 text-indigo-700",
  };

  const statusLabel = statusLabelByPhase[phase] ?? "Ready";
  const statusClassName =
    statusStyleByPhase[phase] ?? "border-slate-300 bg-white text-slate-700";

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    drawGridBackground(ctx, width, height);

    if (phase === "countdown") {
      drawCenteredText(ctx, String(countdownValue), height / 2, 96, "#dc2626");
      return;
    }

    if (phase === "stimulus" && stimulus) {
      drawCenteredText(ctx, stimulus.value, height / 2, 112, "#0f172a");
      onStimulusRendered(performance.now());
      return;
    }

    if (phase === "feedback" && feedback) {
      drawCenteredText(
        ctx,
        feedback.isCorrect ? "Correct" : "Wrong",
        height / 2 - 28,
        62,
        feedback.isCorrect ? "#0f766e" : "#dc2626",
      );
      drawCenteredText(
        ctx,
        `RT: ${Math.round(feedback.rt)} ms`,
        height / 2 + 44,
        34,
        "#334155",
      );
      return;
    }

    if (phase === "finished" && results) {
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = '600 28px "Plus Jakarta Sans", "Jost", "Segoe UI", sans-serif';
      ctx.fillText("Session Summary", 36, 44);

      ctx.font = '500 24px "Plus Jakarta Sans", "Jost", "Segoe UI", sans-serif';
      const metrics = [
        `Average RT: ${Math.round(results.averageRt)} ms`,
        `Fastest RT: ${Math.round(results.fastestRt)} ms`,
        `Slowest RT: ${Math.round(results.slowestRt)} ms`,
        `Accuracy: ${results.accuracy.toFixed(1)}%`,
        `Total Correct: ${results.totalCorrect}/${totalTrials}`,
      ];

      metrics.forEach((line, index) => {
        ctx.fillText(line, 36, 88 + index * 34);
      });

      ctx.font = '500 17px "Plus Jakarta Sans", "Jost", "Segoe UI", sans-serif';
      ctx.fillStyle = "#334155";
      const summaryLines = [
        "Reaction time = perception + decision + motor response.",
        "Humans usually show a baseline delay of around 200 ms.",
        "There is a speed-accuracy tradeoff in rapid tasks.",
        "This task reflects cognitive and motor limits in HCI systems.",
      ];

      summaryLines.forEach((line, index) => {
        ctx.fillText(line, 36, 276 + index * 26);
      });
      return;
    }

    if (phase === "idle") {
      drawCenteredText(
        ctx,
        "Press SPACE bar to start",
        height / 2 - 8,
        34,
        "#1e40af",
      );
      drawCenteredText(
        ctx,
        "[A] for alphabet   |   [D] for digit",
        height / 2 + 38,
        20,
        "#475569",
      );
      return;
    }
  }, [
    phase,
    countdownValue,
    stimulus,
    feedback,
    results,
    trialIndex,
    totalTrials,
    onStimulusRendered,
  ]);

  return (
    <div className="max-w-5xl mx-auto rounded-2xl border border-slate-400/70 bg-[#ecf3fb] p-3 shadow-[0_20px_34px_-24px_rgba(15,23,42,0.5)]">
      <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-300 bg-[#f4f8fc] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Stimulus Window
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${statusClassName}`}
          >
           <span className="font-normal">Status:</span>  {statusLabel}
          </span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={760}
        height={400}
        className="mx-auto block h-auto w-full max-w-full rounded-lg border border-slate-300 bg-[#eef4fa]"
      />
      {phase !== "finished" ? (
        <p className="mt-3 text-center text-sm font-medium text-slate-700">
          Trial {Math.min(trialIndex + 1, totalTrials)} / {totalTrials}
        </p>
      ) : null}
    </div>
  );
}

export default CanvasDisplay;
