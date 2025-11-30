import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FlashcardData, QuizQuestion, DrugDetails } from "../types";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
You are PharmTechTutor, an expert study assistant for the PTCB exam.
Focus on the Top 200 Drugs list.
Ensure all medical facts (Indication, Class, Brand/Generic map) are accurate.
Do NOT provide medical advice.
`;

export const generateFlashcard = async (targetDrug: string): Promise<FlashcardData> => {
  if (!ai) throw new Error("API Key not found");

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      term: { type: Type.STRING, description: "The name presented to the student (Randomly Brand or Generic)" },
      type: { type: Type.STRING, enum: ["Brand", "Generic"], description: "Whether the term is Brand or Generic" },
      answer: { type: Type.STRING, description: "The corresponding pair name" },
      drugClass: { type: Type.STRING, description: "Pharmacological/Therapeutic class" },
      indication: { type: Type.STRING, description: "Primary FDA indication (short)" },
      genericName: { type: Type.STRING, description: "The Generic name (should match the target drug)" },
    },
    required: ["term", "type", "answer", "drugClass", "indication", "genericName"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a study flashcard for the drug "${targetDrug}". 
      Randomly choose to show either the Brand Name or Generic Name as the 'term'.
      The 'answer' should be the other name.
      Keep indications concise (2-4 words).`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as FlashcardData;
  } catch (error) {
    console.error("Error generating flashcard:", error);
    throw error;
  }
};

export const generateQuizQuestion = async (targetDrug: string): Promise<QuizQuestion> => {
  if (!ai) throw new Error("API Key not found");

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "Multiple choice question" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "4 answer options" 
      },
      correctAnswer: { type: Type.STRING, description: "The correct option" },
      explanation: { type: Type.STRING, description: "Why it is correct" },
      subjectDrug: { type: Type.STRING, description: "The subject drug generic name" },
    },
    required: ["question", "options", "correctAnswer", "explanation", "subjectDrug"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a multiple-choice question about "${targetDrug}".
      Can be about its Brand/Generic name, Drug Class, or Indication.
      Ensure one answer is clearly correct and 3 are plausible distractors (real drugs or classes).`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as QuizQuestion;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

export const getDrugDetails = async (query: string): Promise<DrugDetails> => {
  if (!ai) throw new Error("API Key not found");

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      brandName: { type: Type.STRING },
      genericName: { type: Type.STRING },
      drugClass: { type: Type.STRING },
      indication: { type: Type.STRING },
      sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
      schedule: { type: Type.STRING },
    },
    required: ["brandName", "genericName", "drugClass", "indication", "sideEffects", "schedule"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide details for "${query}". If misspelled, infer closest Top 200 drug.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as DrugDetails;
  } catch (error) {
    throw error;
  }
};