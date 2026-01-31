
import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from "../types";

// Always use process.env.API_KEY directly as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLeadsForNiche = async (niche: string): Promise<Partial<Lead>[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere uma lista de 5 leads realistas (pessoas físicas ou jurídicas) para o nicho: "${niche}". 
    Alguns devem ser marcados com status "PROSPECTADO" (leads que já tiveram contato) e outros como "NOVO" (leads recém-descobertos).
    Retorne nomes brasileiros, emails válidos e telefones no formato (XX) 9XXXX-XXXX.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leads: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                nome: { type: Type.STRING },
                email: { type: Type.STRING },
                telefone: { type: Type.STRING },
                nicho: { type: Type.STRING },
                status: { 
                  type: Type.STRING,
                  description: "Deve ser 'PROSPECTADO' ou 'NOVO'"
                },
                empresa: { type: Type.STRING },
                cargo: { type: Type.STRING }
              },
              required: ["nome", "email", "telefone", "nicho", "status"]
            }
          }
        },
        required: ["leads"]
      }
    }
  });

  try {
    // Directly access .text property from the response object
    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text);
    return data.leads;
  } catch (error) {
    console.error("Erro ao processar JSON do Gemini:", error);
    return [];
  }
};
