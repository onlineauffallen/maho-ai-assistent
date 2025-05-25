"use client";

import { useState } from "react";
import { roleQuestions } from "C:/Users/attia/maho-ai-assistent/utils/roleQuestions";

interface Props {
  selectedRoles: string[];
  userName: string;
  onComplete: (answers: Record<string, string[]>, expectationInput: string) => void;
}

export default function RoleConfigurator({ selectedRoles, userName, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [expectationInput, setExpectationInput] = useState("");

  const currentRole = selectedRoles[currentRoleIndex];
  const currentEntry = roleQuestions.find((entry) => entry.role === currentRole);
  const questions = currentEntry?.questions || [];
  const currentAnswers = answers[currentRole] || [];

  const handleAnswer = (questionIndex: number, selected: string, type: "single" | "multiple") => {
    const current = [...(currentAnswers || [])];

    if (type === "single") {
      current[questionIndex] = selected;
    } else {
      const existing = current[questionIndex]?.split("||") || [];
      const updated = existing.includes(selected)
        ? existing.filter((o) => o !== selected)
        : [...existing, selected];
      current[questionIndex] = updated.join("||");
    }

    setAnswers({ ...answers, [currentRole]: current });
  };

  const goNext = () => {
    if (currentRoleIndex < selectedRoles.length - 1) {
      setCurrentRoleIndex((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentRoleIndex > 0) {
      setCurrentRoleIndex((prev) => prev - 1);
    }
  };

  const progress = ((currentRoleIndex + 1) / selectedRoles.length) * 100;

  const allQuestionsAnswered = questions.every((q, i) => {
    const a = currentAnswers[i];
    return !!a && a.trim().length > 0;
  });

  if (currentRoleIndex < selectedRoles.length) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center space-y-6 bg-white">
        <div className="w-full max-w-md mb-4">
          <div className="h-2 bg-gray-200 rounded">
            <div className="h-2 bg-blue-500 rounded" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-sm text-center text-gray-600 mt-1">
            {currentRoleIndex + 1} von {selectedRoles.length} Bereichen
          </div>
        </div>

        <div className="w-full max-w-xl space-y-6">
          <h2 className="text-xl font-bold text-center">
            {getIntroText(currentRole, userName)}
          </h2>

          {questions.map((q, i) => (
            <div key={i}>
              <p className="mb-2 font-medium">{q.question}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const stored = currentAnswers[i]?.split("||") || [];
                  const selected = q.type === "multiple"
                    ? stored.includes(opt)
                    : currentAnswers[i] === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(i, opt, q.type)}
                      className={`px-4 py-2 rounded-full border ${
                        selected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between w-full max-w-xl mt-6">
          <button
            onClick={goBack}
            disabled={currentRoleIndex === 0}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl disabled:opacity-50"
          >
            Zurück
          </button>
          <button
            onClick={() =>
              currentRoleIndex + 1 < selectedRoles.length
                ? goNext()
                : onComplete(answers, expectationInput)
            }
            disabled={!allQuestionsAnswered}
            className="px-6 py-2 bg-green-600 text-white rounded-xl"
          >
            {currentRoleIndex + 1 < selectedRoles.length ? "Weiter" : "Fertigstellen"}
          </button>
        </div>
      </div>
    );
  }

  // Letzte Seite
  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center space-y-6 text-center bg-white">
      <h2 className="text-2xl font-bold">🎉 Danke, {userName}!</h2>
      <p className="max-w-lg">
        Ich freue mich darauf, dich in all deinen gewählten Lebensbereichen bestmöglich zu unterstützen.
      </p>
      <p className="italic font-medium">
        Erzähl mir kurz, wie dein Alltag aktuell aussieht und was du dir von deinem neuen Plan erwartest:
      </p>
      <textarea
        value={expectationInput}
        onChange={(e) => setExpectationInput(e.target.value)}
        placeholder="Mein Alltag ist derzeit..."
        className="w-full max-w-xl border rounded-xl p-4 shadow min-h-[120px]"
      />
      <button
        onClick={() => onComplete(answers, expectationInput)}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl"
        disabled={!expectationInput.trim()}
      >
        Los geht’s mit der Planung
      </button>
    </div>
  );
}

function getIntroText(role: string, name: string): string {
  switch (role) {
    case "religiös":
      return `Lass uns über deine Spiritualität sprechen, ${name}`;
    case "finanziell":
      return `Lass uns deine finanziellen Ziele definieren, ${name}`;
    case "business":
      return `Erzähl mir von deinem geschäftlichen Vorhaben, ${name}`;
    case "fitness":
      return `Was möchtest du körperlich erreichen, ${name}?`;
    case "sekretär":
      return `Was kann ich dir organisatorisch abnehmen, ${name}?`;
    case "therapeut":
      return `Was beschäftigt dich im Moment, ${name}?`;
    default:
      return `${name}, lass uns loslegen.`;
  }
}
