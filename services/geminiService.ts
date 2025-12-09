import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSampleData = async (prompt: string): Promise<GeneratedData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful assistant for a construction or business manager app. Your goal is to generate realistic Arabic data for projects and employees based on the user request. For projects, generate realistic Cairo/Egypt addresses and coordinates if possible. Return JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  number: { type: Type.STRING },
                  address: { type: Type.STRING },
                  locationUrl: { type: Type.STRING, description: "A Google Maps URL or coordinates string" }
                }
              }
            },
            employees: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  jobTitle: { type: Type.STRING },
                  accountNumber: { type: Type.STRING },
                  mobileNumber: { type: Type.STRING },
                  address: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Add IDs on the client side
      const projects = data.projects?.map((p: any) => ({ ...p, id: crypto.randomUUID() })) || [];
      const employees = data.employees?.map((e: any) => ({ ...e, id: crypto.randomUUID() })) || [];
      return { projects, employees };
    }
    return {};
  } catch (error) {
    console.error("Error generating data:", error);
    throw error;
  }
};