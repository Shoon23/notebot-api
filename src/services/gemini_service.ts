import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  build_mcq_template,
  build_true_or_false_template,
  build_identification_template,
  build_essay_template,
  build_note_template,
  build_essay_evaluation_template,
  build_essay_question_answer_template,
} from "../utils/build_prompt_template";
import {
  generateIdentification,
  generateMCQPrompt,
  generateTFPrompt,
} from "../utils/buid_prompt_tempate_2";

export interface iMCQQuestion {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: string;
}

export interface iTrueOrFalseQuestion {
  question: string;
  answer: boolean;
  explanation: string;
}

export interface iEssayQuestion {
  question: string;
}

export interface iIdentificationQuestion {
  question: string;
  answer: boolean;
  explanation: string;
}

export interface Feedback {
  feedback: string;
  strength: string[];
  areas_of_improvement: string[];
}

// Define the structure for each item in the array
export interface EssayEvaluation {
  content: number; // Score for content
  organization: number; // Score for organization
  thesis_statement: number; // Score for thesis statement
  style_and_voice: number; // Score for style and voice
  grammar_and_mechanics: number; // Score for grammar and mechanics
  critical_thinking: number; // Score for critical thinking
  feedbacks: Feedback; // The feedback structure for this evaluation
}

class GenerativeAIService {
  private static instance: GenerativeAIService;
  private genAI: GoogleGenerativeAI | null = null;
  private model: any | null = null;
  private system_instruction: string = ""; // Default instruction, can be changed dynamically

  private constructor() {
    const gemini_key = process.env.GEMINI_API_KEY as string;
    this.genAI = new GoogleGenerativeAI(gemini_key);
    this.initializeModel();
  }

  public static get_instance(): GenerativeAIService {
    if (!GenerativeAIService.instance) {
      GenerativeAIService.instance = new GenerativeAIService();
    }
    return GenerativeAIService.instance;
  }

  // Initialize model once with a default instruction
  private initializeModel() {
    this.model = this.genAI?.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
        topP: 0.95,
        topK: 40,
      },
      systemInstruction: this.system_instruction,
    });
  }
  // Update the system instruction dynamically
  private updateSystemInstruction(instruction: string) {
    this.system_instruction = instruction;
    if (this.model) {
      // Re-create model with updated instruction
      this.model = this.genAI?.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 1,
          topP: 0.95,
          topK: 40,
        },
        systemInstruction: instruction,
      });
    }
  }

  generate_questions = async (
    quiz_info: string,
    blooms_taxonomy_level: any,
    question_type: "mcq" | "true-or-false" | "short-answer" | "essay",
    number_of_questions: number
  ): Promise<iMCQQuestion[] | iTrueOrFalseQuestion[]> => {
    let instruction = null;
    let notes = null;
    switch (question_type) {
      case "mcq":
        instruction = generateMCQPrompt(
          blooms_taxonomy_level,
          number_of_questions
        );
        notes = quiz_info;
        break;
      case "true-or-false":
        instruction = generateTFPrompt(
          blooms_taxonomy_level,
          number_of_questions
        );
        notes = quiz_info;

        break;
      case "short-answer":
        instruction = generateIdentification(
          blooms_taxonomy_level,
          number_of_questions
        );
        notes = quiz_info;

        break;
      case "essay":
        instruction = build_essay_template(blooms_taxonomy_level, "hard", 1);
        notes = quiz_info;

        break;
      default:
        throw new Error("Invalid question type");
    }

    if (!instruction || !notes) {
      throw new Error("Missing Parameters");
    }

    try {
      const final_instructions = `
      **IMPORTANT**: 
        1. **Core Content**: All questions, answers, and explanations MUST prioritize the user’s provided notes.  
        2. **Logical Extensions**:  
          - The model may infer **related concepts** *only if* they are:  
            a) Strongly implied by the notes (e.g., discussing "mitochondria" allows questions about "cellular respiration").  
            b) Universally accepted in the field (e.g., linking "photosynthesis" to "light-dependent reactions").  
         3. **Strict Prohibitions**:  
          - Do not create new terms, processes, or data that are not explicitly mentioned in the provided notes.  
          - If the notes lack sufficient detail or the note doesn't have useful content to determine the appropriate Bloom’s Taxonomy level, indicate this using the following format and generate 1 response:
                 [ {  
                    "message": "The Note Lack of Content"  
                  }  ]
      ${instruction}
      
      `;
      // Dynamically update system instruction
      const model = this.genAI?.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 1,
          topP: 0.95,
          topK: 64,
        },
        systemInstruction: final_instructions,
      });
      // Ensure model is initialized with the latest system instruction
      if (!model) {
        throw new Error("Model initialization failed");
      }
      const result = await model.generateContent(notes);
      return JSON.parse(result.response.text());
    } catch (error) {
      throw new Error("Error Generating Quiz");
    }
  };
  regenete_questions_set = async (
    blooms_taxonomy_level: any,
    question_type: "mcq" | "true-or-false" | "short-answer" | "essay",
    number_of_questions: number,
    structuredChatHistory: any[],
    note: string
  ) => {
    let instruction = null;
    switch (question_type) {
      case "mcq":
        instruction = generateMCQPrompt(
          blooms_taxonomy_level,
          number_of_questions
        );
        break;
      case "true-or-false":
        instruction = generateTFPrompt(
          blooms_taxonomy_level,
          number_of_questions
        );

        break;
      case "short-answer":
        instruction = generateIdentification(
          blooms_taxonomy_level,
          number_of_questions
        );

        break;
      case "essay":
        instruction = build_essay_template(blooms_taxonomy_level, "hard", 1);

        break;
      default:
        throw new Error("Invalid question type");
    }

    if (!instruction || !note) {
      throw new Error("Missing Parameters");
    }
    try {
      const final_instructions = `
      **IMPORTANT**: 
        1. **Core Content**: All questions, answers, and explanations MUST prioritize the user’s provided notes.  
        2. **Logical Extensions**:  
          - The model may infer **related concepts** *only if* they are:  
            a) Strongly implied by the notes (e.g., discussing "mitochondria" allows questions about "cellular respiration").  
            b) Universally accepted in the field (e.g., linking "photosynthesis" to "light-dependent reactions").  
         3. **Strict Prohibitions**:  
          - Do not create new terms, processes, or data that are not explicitly mentioned in the provided notes.  
          - If the notes lack sufficient detail or the note doesn't have useful content to determine the appropriate Bloom’s Taxonomy level, indicate this using the following format and generate 1 response:
                 [ {  
                    "message": "The Note Lack of Content"  
                  }  ]
      ${instruction}
      
      `;
      // Dynamically update system instruction
      const model = this.genAI?.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 1,
          topP: 0.95,
          topK: 64,
        },
        systemInstruction: final_instructions,
      });
      // Ensure model is initialized with the latest system instruction
      if (!model) {
        throw new Error("Model initialization failed");
      }

      const chat_ses = model.startChat({ history: structuredChatHistory });

      const result = await chat_ses.sendMessage(note);

      return JSON.parse(result.response.text());
    } catch (error) {
      throw new Error("Error Generating Quiz");
    }
  };
  evaluate_essays = async (
    question: string,
    answer: string,
    rubricData: {
      mimeType: string;
      data: string;
    }
  ): Promise<EssayEvaluation | []> => {
    const instruction = build_essay_evaluation_template();
    const q_and_a = build_essay_question_answer_template(question, answer);

    if (!instruction || !q_and_a) {
      throw new Error("Missing Parameters");
    }

    // Dynamically update system instruction
    const model = this.genAI?.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
        topP: 0.95,
        topK: 65,
      },
      systemInstruction: instruction,
    });

    try {
      // Ensure model is initialized with the latest system instruction
      if (!model) {
        throw new Error("Model initialization failed");
      }
      const result = await model.generateContent([
        { inlineData: rubricData },
        q_and_a,
      ]);
      return JSON.parse(result.response.text());
    } catch (error) {
      console.log(error);
      throw new Error("Error Generating Quiz");
    }
  };
}

export default GenerativeAIService;
