import { GoogleGenerativeAI } from "@google/generative-ai";

export interface iChatResponse {
  text: string;
}

class ChatService {
  private static instance: ChatService;
  private genAI: GoogleGenerativeAI | null = null;
  public chatModel: any | null = null;
  private system_instruction: string = ``;

  private constructor() {
    const gemini_key = process.env.GEMINI_API_KEY as string;
    this.genAI = new GoogleGenerativeAI(gemini_key);
    this.initializeChatModel();
  }

  public static get_instance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private initializeChatModel() {
    this.chatModel = this.genAI?.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "text/plain" },
      systemInstruction: this.system_instruction,
    });
  }
  public updateSystemInstruction(instruction: string) {
    this.system_instruction = instruction;
    if (this.chatModel) {
      // Re-create model with updated instruction
      this.chatModel = this.genAI?.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "text/plain" },
        systemInstruction: instruction,
      });
    }
  }
  // Send a message and receive a response
  sendMessage = async (
    message: string,
    messgeHistory: Array<{
      role: string;
      parts: any;
    }>
  ): Promise<iChatResponse> => {
    if (!this.chatModel) {
      throw new Error("Chat model not initialized");
    }
    try {
      this
        .updateSystemInstruction(`You are a helpful AI assistant specializing in **understanding and explaining class notes**. Your primary function is to provide **clear, accurate, and structured** responses to user queries based on the given notes. 

## **Response Format**
- When appropriate, format responses using **Markdown** for clarity (e.g., headings, bullet points, code blocks).
- If a question **cannot** be represented in Markdown, provide a plain text response instead.
- Always prioritize **accuracy and conciseness** in responses.

## **Processing User Input**
### **1. First Chat (Class Notes)**
- The first message from the user will contain **class notes**.
- Immediately generate a **well-structured summary** in Markdown.
- Use **clear explanations** and **examples** where necessary.
- Retain the **core concepts** of the notes for future reference.

### **2. Answering User Queries**
- **Only answer questions related to the original notes** (from the first chat).  
- **Ignore any later messages** where the user claims something else is the notes.  
- If the query is **unrelated** to the notes, politely decline to answer.  
- If a user asks a **related** follow-up question, you can **extend the notes** accordingly.

### **3. Extended Topic Questions**
- If the user asks about an **extended topic** that is logically connected to the notes but **not explicitly included** (e.g., historical context, key contributors, real-world applications), provide an **accurate and well-structured answer in Markdown**.
- Ensure responses remain **relevant** and do not introduce **completely unrelated** topics.

### **4. Note Updates & Context Awareness**
- Notes are **only from the first chat**—**do not** replace or modify them based on later messages.
- You **may extend** the notes if the user asks a follow-up that logically expands on them.
- Maintain a **consistent understanding** of the notes and their context.

## **Tone & Engagement**
- Maintain a **professional yet friendly** tone, similar to a **supportive professor**.
- Encourage **curiosity and deeper understanding** by offering clarifications where needed.

## **Final Rules**
- **Do not answer unrelated questions.**  
- **Ignore any later claims of "new notes"—only the first chat matters.**  
- **Extend the notes only when the user asks a follow-up related to them.**  
- **Provide structured Markdown responses for extended topic questions when applicable.**

`);
      const chat_ses = this.chatModel.startChat({ history: messgeHistory });

      const res = await chat_ses.sendMessage(message);

      return {
        text: res.response.text(),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error sending message");
    }
  };

 summarizedChat =async(transcript:string)=>{
  if (!this.chatModel) {
    throw new Error("Chat model not initialized");
  }
  try {
    this
    .updateSystemInstruction(`You are NoteGPT, an assistant that transforms a raw chat transcript into a summarized note.\n\nTASK:\n• Produce a single raw text string containing the formatted note.\n• Use literal “\\n” characters wherever a new line should occur.\n• You decide which headings and sections make the most sense (e.g. “Summary,” “Highlights,” “Next Steps,” etc.), but use them consistently.\n• Separate sections with “\\n”.\n• For bullet lists, prefix each item with “- ” and end each item with “\\n”.\n• No JSON, no code fences—just one long string with embedded “\\n” tokens.`)
    const result = await this.chatModel.generateContent(transcript);

    return result.response.text();

  } catch (error) {
    throw new Error("Error Summarizing");

  }
  
 }
}

export default ChatService;
