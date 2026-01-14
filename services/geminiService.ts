import { GoogleGenAI } from "@google/genai";
import { Product, Sale, Expense } from "../types";

// Nota: En una app real, esto debería estar en un backend para proteger la API Key.
// Para este demo, usamos la variable de entorno accesible en el cliente.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  analyzeBusiness: async (sales: Sale[], expenses: Expense[], products: Product[]): Promise<string> => {
    if (!apiKey) return "API Key no configurada. No se puede generar el análisis.";

    try {
      // Preparar un resumen de datos para no exceder tokens
      const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const lowStockProducts = products.filter(p => p.stock < 10).map(p => p.name).join(', ');
      
      const prompt = `
        Actúa como un consultor experto de negocios para una frutería pequeña.
        Analiza los siguientes datos resumidos:
        - Ventas Totales Históricas: $${totalSales}
        - Gastos Totales Históricos: $${totalExpenses}
        - Productos con stock bajo: ${lowStockProducts || 'Ninguno'}
        - Cantidad de transacciones: ${sales.length}

        Dame 3 consejos breves y estratégicos en español para mejorar la rentabilidad, gestionar el inventario y aumentar las ventas.
        Usa formato HTML simple (p, ul, li, strong) para la respuesta.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text || "No se pudo generar el análisis.";
    } catch (error) {
      console.error("Error calling Gemini:", error);
      return "Ocurrió un error al consultar al asesor inteligente.";
    }
  }
};