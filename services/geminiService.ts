import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FlashcardData, QuizQuestion, DrugDetails } from "../types";

const apiKey = process.env.API_KEY;
// Initialize Gemini client only if API key is present to avoid runtime crashes on init
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
You are PharmTechTutor, an expert study assistant for the PTCB (Pharmacy Technician Certification Board) exam.
Your primary knowledge base is the "Top 200 Drugs" list commonly used for PTCB preparation.
Ensure all drug information, indications, and classes are medically accurate and adhere to standard pharmacy technician educational materials.
Do NOT provide medical advice or specific dosing instructions for patients. Focus on exam preparation facts.
`;

export const generateFlashcard = async (): Promise<FlashcardData> => {
  if (!ai) throw new Error("API Key not found");

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      term: { type: Type.STRING, description: "The name presented to the student (either Brand or Generic)" },
      type: { type: Type.STRING, enum: ["Brand", "Generic"], description: "Whether the term is Brand or Generic" },
      answer: { type: Type.STRING, description: "The corresponding pair (if term is Brand, this is Generic, and vice versa)" },
      drugClass: { type: Type.STRING, description: "The pharmacological or therapeutic class" },
      indication: { type: Type.STRING, description: "The primary FDA-approved indication" },
    },
    required: ["term", "type", "answer", "drugClass", "indication"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Generate a flashcard for a random drug from the Top 200 PTCB drug list. Randomly select whether to show the Brand or Generic name as the term.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 1.0, // Higher temperature for randomness
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as FlashcardData;
  } catch (error) {
    console.error("Error generating flashcard:", error);
    throw error;
  }
};

export const generateQuizQuestion = async (): Promise<QuizQuestion> => {
  if (!ai) throw new Error("API Key not found");

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "The multiple choice question text" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "An array of 4 possible answers" 
      },
      correctAnswer: { type: Type.STRING, description: "The correct answer string, must match one of the options exactly" },
      explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct" },
    },
    required: ["question", "options", "correctAnswer", "explanation"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Generate a multiple-choice question suitable for the PTCB exam regarding a Top 200 drug. The question can be about Brand/Generic matching, Drug Class, or Indication.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.9,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
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
      sideEffects: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3-5 common side effects"
      },
      schedule: { type: Type.STRING, description: "DEA Schedule (e.g., 'Schedule II', 'Legend/Rx Only', 'OTC')" },
    },
    required: ["brandName", "genericName", "drugClass", "indication", "sideEffects", "schedule"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide study details for the drug matching the search term: "${query}". If the term is misspelled, infer the closest Top 200 drug.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as DrugDetails;
  } catch (error) {
    console.error("Error fetching drug details:", error);
    throw error;
  }
};