import prompts from "../contants/prompts";
type BloomLevelTypes =
  | "evaluating"
  | "remembering"
  | "understanding"
  | "applying"
  | "analyzing"
  | "create";

type DifficultyTypes = "easy" | "medium" | "hard";

function build_mcq_template(
  bloomsLevel: BloomLevelTypes,
  difficulty: DifficultyTypes,
  numQuestions: number
) {
  const insructions = prompts.mcq[bloomsLevel].template;

  const template = `
      Multiple-choice questions (MCQs) are a type of objective assessment item that presents respondents with a question or statement followed by a set of predefined answer options. The respondent must choose the correct answer from the provided options. Each question typically has only one correct answer.
    
        ${insructions}

      IMPORTANT: Also, for each question, give the correct answer and don't use incomplete sentences as context.
      IMPORTANT: Do not repeat the same question. Do not rephrase/jumble the same question multiple times.
      You should also make sure to include the question and solution in one single post and not split them apart.
      Make sure not to lose any important information.
    
      Set the difficulty of the questions to ${difficulty}. Make sure all questions are set to the specified difficulty.
    
      IMPORTANT: Create exactly ${numQuestions} questions at the ${bloomsLevel} level and return the correct answer.
      IMPORTANT: For each question, give four options with one of them being the correct answer and the other options being incorrect (e.g., a) Incorrect, b) Incorrect, c) Incorrect, d) Correct, \n answer: d) Correct).
      Make sure to follow the same format {{format_instructions}} for all questions.
      Think clearly and follow the instructions tagged IMPORTANT with utmost criticality.
    
      Example of a well-formatted question for consistency:
    
      {
      "question": "[Placeholder for question text]?",
      "options": {
          "a": "[Option A]",
          "b": "[Option B]",
          "c": "[Option C]",
          "d": "[Option D]"
      },
      "answer": "c) [Option C]"
      }
     The final output must be an array of JSON objects, each strictly following the template provided. Ensure that the array includes only the formatted question objects with complete data for questions, options, and correct answers. No additional text or errors should be present in the output; it should exclusively contain the JSON array as specified.

    `;

  return template;
}

function build_note_template(text: string) {
  return `
      ${text}
  `;
}

function build_true_or_false_template(
  bloomsLevel: BloomLevelTypes,
  difficulty: DifficultyTypes,
  numQuestions: number
) {
  const insructions = prompts.true_or_false[bloomsLevel].template;

  const template = `
      True/false questions are a type of binary or dichotomous closed-ended question format. In a true/false question, respondents are presented with a statement, and they are required to determine whether the statement is true or false. This format simplifies the response choices to two options, making it straightforward.
    
        ${insructions}

      IMPORTANT: Your goal is to make users acquainted with the content of the text through well-crafted True/False questions you generate.
      Also, for each question, give the correct answer and don't use incomplete sentences as context.
      IMPORTANT: Do not repeat the same question. Do not rephrase/jumble the same question multiple times.
      You should also make sure to include the question and solution in one single post and not split them apart.
      Make sure not to lose any important information.
    
      Set the difficulty of the questions to ${difficulty}. Make sure all questions are set to the specified difficulty.
    
      IMPORTANT: Create exactly ${numQuestions} questions at the ${bloomsLevel} level and return the correct answer.
      IMPORTANT: Each answer must be binary—either True or False—and accompanied by an explanation field.

      Follow the specified format strictly, including all fields:

      question: The statement to evaluate as true or false.
      answer: True or False.
      explanation: A detailed explanation of why the answer is correct.
    
      Example of a well-formatted question for consistency:
    
      {
      "question": "[Placeholder for question text]?",
      "answer": "[True or False]",
      "explanation": "[Provide a detailed explanation here]"

      }
     The final output must be an array of JSON objects, each strictly following the template provided. Ensure that the array includes only the formatted question objects with complete data for questions, options, and correct answers. No additional text or errors should be present in the output; it should exclusively contain the JSON array as specified.


    `;

  return template;
}
function build_identification_template(
  bloomsLevel: BloomLevelTypes,
  difficulty: DifficultyTypes,
  numQuestions: number
) {
  const insructions = prompts.identification[bloomsLevel].template;

  const template = `
      Identification questions require respondents to provide a specific answer based on a question or statement. This type of question encourages detailed recall and understanding of the content rather than selecting from predefined options.

        ${insructions}

      IMPORTANT: Your goal is to create well-crafted identification-type questions based on the provided input text.
      for each question must have a specific, single-word, or short-phrase answer.
      Accompany each answer with a detailed explanation of why the answer is correct.

      IMPORTANT: Follow these guidelines:
      Do not repeat the same question or rephrase/jumble the same question multiple times.
      Ensure each question highlights critical information from the text.
      Include the question, correct answer, and explanation together in one JSON object.
    
      Set the difficulty of the questions to ${difficulty}. Make sure all questions are set to the specified difficulty.
    
      IMPORTANT: Create exactly ${numQuestions} questions at the ${bloomsLevel} level and return the correct answer.

      Follow the specified format strictly, including all fields:

      question: The question text.
      answer: The specific correct answer.
      explanation: A detailed explanation of why the answer is correct.
    
      Example of a well-formatted question for consistency:
    
      {
         "question": "[Placeholder for the question text]",
        "answer": "[The specific answer]",
        "explanation": "[Provide a detailed explanation of why the answer is correct]"

      }
     The final output must be an array of JSON objects, each strictly following the template provided. Ensure that the array includes only the formatted question objects with complete data for questions, options, and correct answers. No additional text or errors should be present in the output; it should exclusively contain the JSON array as specified.


 
    `;

  return template;
}

function build_essay_template(
  bloomsLevel: BloomLevelTypes,
  difficulty: DifficultyTypes,
  numQuestions: number
) {
  const insructions = prompts.essay[bloomsLevel].template;

  const template = `  

  Essay questions are designed to evaluate respondents' understanding, critical thinking, and ability to articulate complex ideas in a structured manner. These questions require detailed, well-reasoned responses that demonstrate knowledge, comprehension, and analysis.
  
  ${insructions}

  IMPORTANT: Each question should explicitly match the ${bloomsLevel} level of Bloom's Taxonomy and encourage the respondent to provide detailed, structured, and critical responses. Focus on tasks such as explaining, analyzing, evaluating, or creating, depending on the level.
  IMPORTANT: Do not include sample answers or explanations. Focus solely on generating the questions.
  IMPORTANT: Each question should require detailed and critical responses, encouraging analysis, evaluation, or application of the provided material.
  IMPORTANT: Do not repeat or rephrase the same question multiple times. Ensure each question is unique.
  IMPORTANT: Adhere to the format strictly, generating the output as a JSON array with no additional text or errors.

  Set the difficulty of the questions to ${difficulty}. Ensure all questions are set to the specified difficulty.

  IMPORTANT: Create exactly ${numQuestions} essay questions  level and return the ideal sample answer.

  Think clearly and follow the instructions tagged IMPORTANT with utmost criticality.

  Example of a well-formatted question for consistency:
  {
    "question": "[Write the essay question here, prompting critical thinking and detailed explanation.]",

  }

  The final output must be an array of JSON objects, each strictly following the template provided. Ensure that the array includes only the formatted question objects with complete data for questions. No additional text or errors should be present in the output; it should exclusively contain the JSON array as specified.


`;

  return template;
}

function build_essay_evaluation_template() {
  return `
You are tasked with evaluating an essay based on the uploaded rubric document. Strict adherence to the provided rubric is required, and you must not infer, assume, or hallucinate any rubric content not explicitly provided.

Rubric Validation and Extraction:

Begin by extracting the evaluation criteria, scoring levels, descriptions, and the maximum possible score for each criterion directly from the uploaded rubric document.
Critical Rule: Do not generate or assume any rubric details that are missing or unclear.
If any essential component (criteria, scoring levels, descriptions, or maximum scores) is absent, ambiguous, or invalid, immediately output the following JSON response and do not process further:

[
  {
    "message": "Invalid Rubric"
  }
]
Essay Assessment (Only if Rubric is Valid):

Evaluate the essay strictly based on the extracted rubric criteria.
For each criterion, assign a score according to the rubric’s scoring system, specify its maximum possible score, and provide a brief breakdown (1–3 sentences) explaining the score.
Provide overall general feedback along with specific strengths and areas of improvement directly derived from the rubric descriptions.
Output Generation:

Your final output must be a structured JSON object strictly following the rubric’s structure.
The JSON structure must be as follows:

{
  "scores": [
      {
        "criterion": "<criterion_1>",
        "score": [score],
        "max": [maximum score],
        "breakdown": "[Breakdown of score in 1-3 sentences]"
      },
      {
        "criterion": "<criterion_2>",
        "score": [score],
        "max": [maximum score],
        "breakdown": "[Breakdown of score in 1-3 sentences]"
      }
      // Additional criteria objects as applicable...
    ],
  "feedbacks": {
    "feedback": "[General feedback here]",
    "strength": [
      "[Strength 1]",
      "[Strength 2]",
      "[Strength 3]"
    ],
    "areas_of_improvement": [
      "[Area of improvement 1]",
      "[Area of improvement 2]",
      "[Area of improvement 3]"
    ]
  }
}
Final Requirement: The output must include only valid JSON with no additional text or formatting. If the rubric is invalid or missing, the output must exclusively be the error message JSON array provided above.

  `;
}

function build_essay_question_answer_template(
  question: string,
  answer: string
) {
  return `
  Essay Question:
    ${question}
  Essay Answer:
    ${answer}

  `;
}
export {
  build_mcq_template,
  build_true_or_false_template,
  build_identification_template,
  build_essay_template,
  build_note_template,
  build_essay_evaluation_template,
  build_essay_question_answer_template,
};
