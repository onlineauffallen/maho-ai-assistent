type QuestionEntry = {
  role: string;
  questions: {
    question: string;
    type: "single" | "multiple";
    options: string[];
  }[];
};

export function generateUnifiedSystemPrompt(
  userName: string,
  selectedRoles: string[],
  roleQuestions: QuestionEntry[],
  answers: Record<string, string[]>,
  expectationText: string
): string {
  const intro = `Du bist ein persönlicher KI-Assistent namens Maho. Unterstütze ${userName} kompetent, einfühlsam und strukturiert in den folgenden Lebensbereichen:`;

  const roleDescriptions = selectedRoles.map((role) => {
    const entry = roleQuestions.find((r) => r.role === role);
    if (!entry || !entry.questions) return `- ${role} (keine Details verfügbar)`;

    const answerList = entry.questions
      .map((q, i) => {
        const a = answers[role]?.[i] || "Keine Angabe";
        const formatted = a.split("||").join(", ");
        return `• ${q.question}: ${formatted}`;
      })
      .join("\n");

    return `\n🟢 **${capitalize(role)}**:\n${answerList}`;
  });

  const outro = `\n\n📝 ${userName} hat dazu Folgendes über seinen Alltag und seine Erwartungen gesagt:\n"${expectationText}"\n
Bitte integriere dieses Wissen in deine Antworten und passe dich je nach Thema flexibel der Rolle an. Antworte im Ton eines persönlichen Assistenten.`;

  return [intro, ...roleDescriptions, outro].join("\n");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
