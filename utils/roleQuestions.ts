export const roleQuestions: {
  role: string;
  questions: {
    question: string;
    type: "single" | "multiple";
    options: string[];
  }[];
}[] = [
  {
    role: "religiös",
    questions: [
      {
        question: "Welcher Glaubensrichtung gehörst du an?",
        type: "single",
        options: ["Islam", "Judentum", "Röm. Katholisch", "Evangelisch", "Orthodox", "Keine Angabe"]
      },
      {
        question: "Welche spirituellen Praktiken möchtest du stärken?",
        type: "multiple",
        options: ["Pflichtgebete", "Sunnah-Gebete", "Qur'an lesen", "Zikr", "Fasten", "Keine spezifischen"]
      }
    ]
  },
  {
    role: "finanziell",
    questions: [
      {
        question: "Welche Investmentarten interessieren dich?",
        type: "multiple",
        options: ["Aktien", "ETFs", "Krypto", "Gold", "Immobilien", "Andere"]
      },
      {
        question: "Wie wichtig sind dir ethische Kriterien?",
        type: "single",
        options: ["Sehr wichtig", "Wichtig", "Nicht so wichtig"]
      },
      {
        question: "Was ist dein primäres Anlageziel?",
        type: "single",
        options: ["Langfristiger Vermögensaufbau", "Passives Einkommen", "Risikoreiches Wachstum", "Absicherung"]
      }
    ]
  },
  {
    role: "business",
    questions: [
      {
        question: "In welcher Branche bist du aktiv?",
        type: "single",
        options: ["IT", "Handel", "Beratung", "Kreativwirtschaft", "Gesundheit", "Andere"]
      },
      {
        question: "Was möchtest du erreichen?",
        type: "multiple",
        options: ["Reichweite aufbauen", "Produkt entwickeln", "Umsatz steigern", "Teamführung verbessern"]
      }
    ]
  },
  {
    role: "fitness",
    questions: [
      {
        question: "Was ist dein primäres Ziel?",
        type: "single",
        options: ["Fettabbau", "Muskelaufbau", "Gesundheit erhalten", "Attraktives Auftreten"]
      },
      {
        question: "Welche Trainingsformen interessieren dich?",
        type: "multiple",
        options: ["Krafttraining", "Cardio", "Mobilität", "Kampfsport", "Andere"]
      }
    ]
  },
  {
    role: "sekretär",
    questions: [
      {
        question: "Welche Bereiche soll ich für dich organisieren?",
        type: "multiple",
        options: ["Tagesplanung", "Wochenplanung", "ToDo-Listen", "Terminerinnerungen"]
      },
      {
        question: "Wie bevorzugst du deine Aufgaben zu sehen?",
        type: "single",
        options: ["Kalenderbasiert", "Checkliste", "Fokusliste", "Keine Struktur nötig"]
      }
    ]
  },
  {
    role: "therapeut",
    questions: [
      {
        question: "Was möchtest du aktuell stärken?",
        type: "multiple",
        options: ["Selbstvertrauen", "Antrieb", "Emotionale Balance", "Ziele finden", "Stressresistenz"]
      },
      {
        question: "Wie geht es dir derzeit?",
        type: "single",
        options: ["Stabil & motiviert", "Leicht überfordert", "Emotional schwankend", "Antriebslos"]
      }
    ]
  }
];
