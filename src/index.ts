import express, { Request, Response } from "express";
import dotenv from "dotenv";
import GenerativeAIService from "./services/gemini_service";
import ChatService from "./services/gemini_chat_service";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { constants } from "fs";
import { interleaveUserContent } from "./utils/normalize-utils";
import fs from "fs";
import path from "path";
import tmp from "tmp";
import { removeMarkdownTags } from "./utils/text-utils";
// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genertive_ai_service = GenerativeAIService.get_instance();
const chat_service = ChatService.get_instance();
export interface iMessage {
  sender_type: "PERSON" | "BOT"; // Type of sender (either 'PERSON' or 'BOT')
  message_content: string; // The content of the message
}
// Store chat sessions in-memory (a simple session store for this example)
const chatSessions: { [sessionId: string]: any } = {};

export interface iGenQuizzes {
  raw_text: string;
}

// Uploaded files will be available as a Buffer at req.file.buffer.
const storage = multer.memoryStorage();

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    // When rejecting a file, pass the error only (do not provide a second argument)
    cb(new Error("Only PDF and DOCX files are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });
app.post(
  "/generate-questions",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    // Destructure parameters from the request body.
    let { blooms_taxonomy_level, num_questions, content_text, question_type } =
      req.body as {
        blooms_taxonomy_level: string;
        num_questions: number;
        question_type: any;
        content_text?: string;
      };

    // If no content_text is provided but a file is uploaded, extract its content from the in-memory buffer.
    if (!content_text && req.file) {
      try {
        const fileBuffer = req.file.buffer; // Directly access the file buffer
        if (req.file.mimetype === "application/pdf") {
          const pdfData = await pdfParse(fileBuffer);
          content_text = pdfData.text;
        } else if (
          req.file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ buffer: fileBuffer });
          content_text = result.value;
        }
      } catch (error) {
        console.error("Error extracting file content:", error);
        res.status(500).json({ error: "Error extracting file content" });
        return;
      }
    }

    // If we still don't have content_text, return an error.
    if (!content_text) {
      res
        .status(400)
        .json({ error: "No notes content was provided or extracted." });
      return;
    }

    // Call the generative AI service to generate questions.
    const generated_questions = await genertive_ai_service.generate_questions(
      content_text,
      blooms_taxonomy_level,
      question_type,
      num_questions
    );
    // If only one question is returned, treat it as an error (as per the original logic).
    if (
      generated_questions.length === 1 &&
      "message" in generated_questions[0]
    ) {
      res.status(400).json(generated_questions[0]);
      return;
    }

    res.status(201).json(generated_questions);
  }
);

app.post(
  "/generate-questions-set",
  upload.single("file"),
  async (req: Request, res: Response) => {
    let {
      content_text,
      quiz_history,
      blooms_taxonomy_level,
      num_questions,
      question_type,
    } = req.body as {
      content_text?: string;
      // Allow quiz_history to be either an array or a JSON string
      quiz_history: string;
      blooms_taxonomy_level: string;
      num_questions: number;
      question_type: any;
    };

    // If no content_text is provided but a file is uploaded, extract its content from the in-memory buffer.
    if (!content_text && req.file) {
      try {
        const fileBuffer = req.file.buffer; // Directly access the file buffer
        if (req.file.mimetype === "application/pdf") {
          const pdfData = await pdfParse(fileBuffer);
          content_text = pdfData.text;
        } else if (
          req.file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ buffer: fileBuffer });
          content_text = result.value;
        }
      } catch (error) {
        console.error("Error extracting file content:", error);
        res.status(500).json({ message: "Error extracting file content" });
        return;
      }
    }

    // If we still don't have content_text, return an error.
    if (!content_text) {
      res
        .status(400)
        .json({ message: "No notes content was provided or extracted." });
      return;
    }

    // Create the structured chat history by interleaving the quiz_history with the user content.
    const structuredChatHistory = interleaveUserContent(
      JSON.parse(quiz_history) as iGenQuizzes[],
      content_text
    );

    try {
      const regenerated_question =
        await genertive_ai_service.regenete_questions_set(
          blooms_taxonomy_level,
          question_type,
          num_questions,
          structuredChatHistory,
          content_text
        );
      if (
        regenerated_question.length === 1 &&
        "message" in regenerated_question[0]
      ) {
        res.status(400).json(regenerated_question[0]);
        return;
      }
      res.status(201).json(regenerated_question);
    } catch (error) {
      res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  }
);

app.post(
  "/evaluate-essay",
  upload.single("rubric"),
  async (req: Request, res: Response) => {
    const { answer, question } = req.body as any;

    if (!answer) {
      res.status(400).json({
        message: "Missing Answer For the essay",
      });
      return;
    }

    if (!question) {
      res.status(400).json({
        message: "Missing Question For the essay",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        message: "Missing Rubric For the essay",
      });
      return;
    }

    const rubricData = {
      mimeType: req.file.mimetype,
      data: req.file.buffer.toString("base64"),
    };
    const evaluation = await genertive_ai_service.evaluate_essays(
      question,
      answer,
      rubricData
    );

    if (Array.isArray(evaluation)) {
      res.status(400).json(evaluation);
      return;
    }

    res.status(201).json(evaluation);
  }
);

// Chat endpoint - Handling chat session and user messages
app.post(
  "/chat",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "note", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    let { messageHistory, message } = req.body as {
      message: string | null;
      messageHistory: string;
    };

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    try {
      if (!message && files && files["file"] && files["file"][0]) {
        try {
          const uploadedFile = files["file"][0];
          const fileBuffer = uploadedFile.buffer;
          if (uploadedFile.mimetype === "application/pdf") {
            const pdfData = await pdfParse(fileBuffer);
            message = pdfData.text;
          } else if (
            uploadedFile.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            message = result.value;
          }
        } catch (error) {
          console.error("Error extracting file content:", error);
          res.status(500).json({ message: "Error extracting file content" });
          return;
        }
      }

      if (!message) {
        res
          .status(400)
          .json({ error: "No notes content was provided or extracted." });
        return;
      }
      let noteContent = "";

      // Process the "note" field if available.
      if (files && files["note"] && files["note"][0]) {
        try {
          const noteFile = files["note"][0];
          const noteBuffer = noteFile.buffer;
          if (noteFile.mimetype === "application/pdf") {
            const pdfData = await pdfParse(noteBuffer);
            noteContent = pdfData.text;
          } else if (
            noteFile.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            const result = await mammoth.extractRawText({ buffer: noteBuffer });
            noteContent = result.value;
          }
        } catch (error) {
          console.error("Error extracting note content:", error);
          res.status(500).json({ message: "Error extracting note content" });
          return;
        }
      }

      const convertedtoChatSession = (
        JSON.parse(messageHistory) as iMessage[]
      ).map((msg) => {
        return {
          role: msg.sender_type === "BOT" ? "model" : "user",
          parts: [
            {
              text: msg.message_content,
            },
          ],
        };
      });
      // If note exists, insert its content at the beginning of the chat session.
      if (noteContent) {
        convertedtoChatSession.unshift({
          role: "user",
          parts: [
            {
              text: noteContent,
            },
          ],
        });
      }

      const chatResponse = await chat_service.sendMessage(
        message as string,
        convertedtoChatSession
      );
      const responseText = removeMarkdownTags(chatResponse.text);

      // Check if the responseText is valid JSON that matches the given object
      try {
        const jsonData = JSON.parse(responseText);
        if (Array.isArray(jsonData)) {
          res.status(400).json(jsonData);
          return;
        }
      } catch (error) {
        // Not valid JSON, so continue
      }
      res.status(200).json({
        response: responseText,
      });
    } catch (error) {
      console.error("Error during chat:", error);
      res.status(500).json({ message: "Error during chat" });
    }
  }
);

app.post("/summarized-chat",async(req: Request, res: Response)=>{
  const {transcript} = req.body as {
    transcript: string;
  };

  if(!transcript){
    res.status(400).json({ error: "Missign Transcript" });
    return;
  }
  try {
    const summarizedChats = await chat_service.summarizedChat(transcript)
    res.status(200).json(summarizedChats);
  } catch (error) {
    console.error("Error during summarizing:", error);
      res.status(500).json({ message: "Error during chat" });
  }
})
// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
