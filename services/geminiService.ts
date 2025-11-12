
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Language } from '../types';

const getPromptDetails = (difficulty: Difficulty) => {
    switch (difficulty) {
        case 'easy':
            return {
                description: "single-digit addition and subtraction",
                count: 44
            };
        case 'easy+':
            return {
                description: "double-digit addition/subtraction or single-digit multiplication/division",
                count: 44
            };
        case 'medium':
            return {
                description: "complex multi-digit addition, subtraction, multiplication, and division. Ensure final solutions are integers below 1000.",
                count: 44
            };
        case 'hard':
            return {
                description: "medium difficulty operations plus integer square roots (e.g., sqrt(16)) and exponentiation (e.g., 2^3). Ensure solutions are integers and below 1000.",
                count: 44
            };
        case 'grade1':
            return {
                description: "single-digit addition and subtraction within 20, appropriate for 1st grade math in Ukraine",
                count: 44
            };
        case 'grade2':
            return {
                description: "addition and subtraction within 100, and simple multiplication/division by 2, 3, 4, or 5, appropriate for 2nd grade math in Ukraine",
                count: 44
            };
        case 'grade3':
            return {
                description: "multi-digit addition/subtraction, and multiplication/division tables up to 9, appropriate for 3rd grade math in Ukraine",
                count: 44
            };
        case 'grade4':
            return {
                description: "complex multi-digit addition, subtraction, multiplication, and division with numbers up to 1000, appropriate for 4th grade math in Ukraine",
                count: 44
            };
        default:
            return {
                description: "single-digit addition",
                count: 44
            };
    }
};

export const generateDominoes = async (difficulty: Difficulty, language: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const details = getPromptDetails(difficulty);
    const languageInstruction = "The 'problem' field MUST be a valid mathematical expression using standard symbols like +, -, *, /, sqrt(), and ^. Do not write out the operators as words (e.g., use '5 + 3' not 'five plus three' or '5 плюс 3').";

    const prompt = `
        You are a math game designer. Your task is to generate a set of problems for a domino game.

        Instructions:
        1. ${languageInstruction}
        2. Generate ${details.count} unique math problems appropriate for a difficulty of "${details.description}". The problems should only use integers. For square roots, use notation like 'sqrt(16)'. For exponents, use '^', like '2^3'.
        3. Calculate the integer solution for each problem.
        4. Create a list of all the solutions you calculated.
        5. Create a new list of numbers which is a shuffled version of your solutions list. This new list must contain the exact same numbers as the solutions list, just in a different order.
        6. Create a JSON array of ${details.count} "domino" objects. Each object must have three properties: "problem" (a string), "solution" (the numeric solution to the problem), and "displayAnswer" (a number from the shuffled list).
        7. Ensure the final output is ONLY the raw JSON array of objects. Do not include any introductory text, explanations, or markdown formatting like \`\`\`json.
    `;

    try {
        const response = await ai.models.generateContent({
            // FIX: Use recommended model 'gemini-2.5-flash' instead of deprecated model.
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            problem: { type: Type.STRING },
                            solution: { type: Type.INTEGER },
                            displayAnswer: { type: Type.INTEGER },
                        },
                        required: ["problem", "solution", "displayAnswer"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as { problem: string; solution: number; displayAnswer: number }[];
    } catch (error) {
        console.error("Error generating dominoes:", error);
        throw new Error("Failed to generate game data from Gemini API.");
    }
};