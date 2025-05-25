"use client";

import { useState, useEffect } from "react";
import RoleConfigurator from "@/components/RoleConfigurator";
import { rolePresets } from "C:/Users/attia/maho-ai-assistent/utils/rolePresets";
import { handleApiError } from "C:/Users/attia/maho-ai-assistent/utils/apiErrorHandler";
import { roleQuestions } from "C:/Users/attia/maho-ai-assistent/utils/roleQuestions";
import { generateUnifiedSystemPrompt } from "C:/Users/attia/maho-ai-assistent/utils/promptBuilder";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [onboardingStarted, setOnboardingStarted] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userConfig");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserName(parsed.name);
      setSelectedRoles(parsed.roles);
      setMessages(parsed.messages || []);
      setOnboardingComplete(true);
    }
  }, []);

  const startOnboarding = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setOnboardingStarted(true);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const completeOnboarding = (
  answers: Record<string, string[]>,
  expectationInput: string
) => {
  const unifiedPrompt = generateUnifiedSystemPrompt(
    userName,
    selectedRoles,
    roleQuestions,
    answers,
    expectationInput
  );

  const initialMessages = [
    { role: "system", content: unifiedPrompt },
    {
      role: "assistant",
      content:
        "Danke für deine Angaben. Ich freue mich darauf, dich in allen Aspekten zu unterstützen. Lass uns gemeinsam starten! Zu beginn erzäle mir von deinem aktuellen Alltag, damit wir gemeinsam einen Tagesablauf und ToDos erstellen können",
    },
  ];

  setMessages(initialMessages);
  setOnboardingComplete(true);
  setShowConfigurator(false);

  localStorage.setItem(
    "userConfig",
    JSON.stringify({
      name: userName,
      roles: selectedRoles,
      messages: initialMessages,
    })
  );
};

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", content: input };
  const newMessages = [...messages, userMessage];
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const contentType = res.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!res.ok) {
      const errorBody = isJson ? await res.json() : await res.text();
      throw { status: res.status, message: errorBody };
    }

    const data = isJson ? await res.json() : await res.text();
    const assistantMessage = {
      role: "assistant",
      content: typeof data === "string" ? data : data.message || "Antwort liegt vor.",
    };
    setMessages([...newMessages, assistantMessage]);
  } catch (err: any) {
    const errorMsg = handleApiError(err);
    setMessages([...newMessages, { role: "assistant", content: errorMsg }]);
  } finally {
    setLoading(false);
  }
};



  // 1. Name-Eingabe
  if (!userName && !onboardingStarted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Hallo! Ich bin Maho, dein persönlicher Assistent!</h1>
        <p className="mb-4 text-center max-w-md">
          Wir starten mit ein paar Fragen, damit ich dich besser kennenlernen kann.
          Bitte verrate mir zuerst deinen Namen:
        </p>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Dein Name..."
          className="rounded-xl border px-4 py-2 shadow text-center"
        />
        <button
          onClick={startOnboarding}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl"
          disabled={!nameInput.trim()}
        >
          Weiter
        </button>
      </div>
    );
  }

  // 2. Rollenwahl
  if (!showConfigurator && !onboardingComplete) {
    const options = Object.keys(rolePresets);
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Hallo {userName}, ich bin dein persönlicher Assistent!</h1>
        <p className="mb-4 text-center">In welchen Lebensbereichen kann ich dich unterstützen?</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {options.map((role) => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={`px-4 py-2 rounded-full border ${
                selectedRoles.includes(role)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowConfigurator(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-xl"
          disabled={selectedRoles.length === 0}
        >
          Starten
        </button>
      </div>
    );
  }

  // 3. Konfigurationsfragen
  if (showConfigurator) {
    return (
      <RoleConfigurator
        selectedRoles={selectedRoles}
        userName={userName}
        onComplete={completeOnboarding}
      />
    );
  }

  // 4. Chatansicht
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">🧠 Maho KI-Assistent</h1>
      <div className="flex-1 overflow-y-auto bg-white rounded-xl p-4 shadow">
        {messages
          .filter((m) => m.role !== "system")
          .map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block px-4 py-2 rounded-xl max-w-xs ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        {loading && <div className="text-left text-gray-500">Antwort wird generiert...</div>}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-xl border px-4 py-2 shadow"
          placeholder="Nachricht eingeben..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          onClick={sendMessage}
          disabled={loading}
        >
          Senden
        </button>
      </div>
    </div>
  );
}
