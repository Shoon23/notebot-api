type BloomLevelTypes =
  | "evaluating"
  | "remembering"
  | "understanding"
  | "applying"
  | "analyzing"
  | "create";

export function generateMCQPrompt(
  bloomsLevel: BloomLevelTypes,
  num_questions: number
) {
  let template;

  switch (bloomsLevel) {
    case "analyzing":
      template = `
      Generate ${num_questions} MCQ questions at the **Analyzing level** of Bloom's Taxonomy that require learners to:  
      - Dissect **multi-step causal relationships** or **interacting systems** (e.g., environmental, biological, or chemical processes)  
      - Evaluate how **conflicting factors** or **compounding variables** influence outcomes  
      - Distinguish between primary drivers, secondary effects, and unintended consequences in complex scenarios  

      **Example of a well-formatted Analyzing-level question**:  
      {  
        "question": "A study finds that increased atmospheric CO₂ concentrations enhance plant growth in controlled environments, but regions with depleted soil nitrogen show stunted growth despite high CO₂. What does this imply about the relationship between CO₂ fertilization and nutrient availability?",  
        "options": {  
          "a": "CO₂ fertilization alone is sufficient to maximize plant growth globally.",  
          "b": "Nitrogen availability limits the potential benefits of elevated CO₂ on plant growth.",  
          "c": "High CO₂ levels directly inhibit nitrogen absorption in plants.",  
          "d": "Soil nitrogen depletion is unrelated to CO₂ fertilization effects."  
        },  
        "answer": "b) Nitrogen availability limits the potential benefits of elevated CO₂ on plant growth."  
      }  

      **Requirements**:  
      1. Avoid simple "compare and contrast" questions; focus on **non-linear interactions** or **cascading effects**.  
      2. Ensure questions demand prioritization of factors (e.g., "Which is *more* critical?" or "What is the *primary* cause?").  
      3. Format output as a **strict JSON array** with no additional text.  
      4. Do NOT repeat concepts or rephrase the same underlying scenario.  `;
      break;
    case "remembering":
      template = `
      Generate ${num_questions} MCQ questions at the **Remembering level** of Bloom's Taxonomy that require learners to:  
      - Recall specific facts, terms, or foundational concepts  
      - Identify definitions or straightforward information  
      - Recognize basic components of a system or process  

      **Example**:  
      {  
        "question": "What is the primary product of the light-dependent reactions in photosynthesis?",  
        "options": {  
          "a": "Glucose",  
          "b": "ATP",  
          "c": "Carbon dioxide",  
          "d": "Water"  
        },  
        "answer": "b) ATP"  
      }  

      **Requirements**:  
      1. Focus on unambiguous, universally accepted answers.  
      2. Avoid interpretation or application of knowledge.  
      3. Format output as a **strict JSON array**.  `;

      break;
    case "understanding":
      template = `
       Generate ${num_questions} MCQ questions at the **Understanding level** of Bloom's Taxonomy that require learners to:  
      - Paraphrase or summarize key ideas  
      - Interpret cause-effect relationships in simple systems  
      - Classify information based on explicit criteria  

      **Example**:  
      {  
        "question": "Which statement best describes the role of ribosomes in protein synthesis?",  
        "options": {  
          "a": "They store genetic information.",  
          "b": "They catalyze the formation of peptide bonds between amino acids.",  
          "c": "They modify and package proteins for secretion.",  
          "d": "They break down damaged proteins."  
        },  
        "answer": "b) They catalyze the formation of peptide bonds between amino acids."  
      }  

      **Requirements**:  
      1. Require comprehension of relationships, not just memorization.  
      2. Include distractors that reflect common misunderstandings.  
      3. Format output as a **strict JSON array**.  `;
      break;
    case "applying":
      template = `
      Generate ${num_questions} MCQ questions at the **Applying level** of Bloom's Taxonomy that require learners to:  
      - Use procedures to solve novel problems  
      - Predict outcomes based on established principles  
      - Select appropriate methods for given scenarios  

      **Example**:  
      {  
        "question": "A farmer wants to maximize crop yield in phosphorus-deficient soil. Which action aligns with the Law of the Minimum?",  
        "options": {  
          "a": "Increasing nitrogen fertilization",  
          "b": "Applying phosphorus-rich fertilizer",  
          "c": "Doubling irrigation frequency",  
          "d": "Using pesticides more frequently"  
        },  
        "answer": "b) Applying phosphorus-rich fertilizer"  
      }  

      **Requirements**:  
      1. Present fresh contexts not used in prior examples.  
      2. Focus on practical implementation of knowledge.  
      3. Format output as a **strict JSON array**.  `;
      break;
    case "evaluating":
      template = `
      Generate ${num_questions} MCQ questions at the **Evaluating level** of Bloom's Taxonomy that require learners to:  
      - Assess the validity of arguments or methodologies  
      - Critique solutions based on evidence  
      - Prioritize options using explicit criteria  

      **Example**:  
      {  
        "question": "A study claims vaccines cause autism, citing parental surveys but no controlled trials. What is the strongest critique of this conclusion?",  
        "options": {  
          "a": "Surveys are inexpensive to conduct",  
          "b": "Correlation doesn't imply causation",  
          "c": "Parents often observe behaviors accurately",  
          "d": "Vaccines contain preservatives"  
        },  
        "answer": "b) Correlation doesn't imply causation"  
      }  

      **Requirements**:  
      1. Demand justification through scientific principles or logical reasoning.  
      2. Include plausible but flawed distractors.  
      3. Format output as a **strict JSON array**.  `;

      break;

    case "create":
      template = `
      Generate ${num_questions} MCQ questions at the **Creating level** of Bloom's Taxonomy that require learners to:  
      - Propose solutions to novel problems  
      - Design systems that meet specific constraints  
      - Hypothesize outcomes of original scenarios  

      **Example**:  
      {  
        "question": "To reduce urban heat island effects while maximizing green space, which design integrates photosynthesis, albedo, and water retention?",  
        "options": {  
          "a": "Concrete parking lots with scattered trees",  
          "b": "Rooftop gardens with reflective surfaces and rainwater capture",  
          "c": "Artificial turf football fields",  
          "d": "Glass skyscrapers with central AC systems"  
        },  
        "answer": "b) Rooftop gardens with reflective surfaces and rainwater capture"  
      }  

      **Requirements**:  
      1. Focus on innovative synthesis of multiple concepts.  
      2. Avoid questions with single obvious answers.  
      3. Format output as a **strict JSON array**.  `;
  }

  return template;
}

export function generateTFPrompt(
  bloomsLevel: BloomLevelTypes,
  num_questions: number
) {
  let template;
  const balanceInstruction = `5. **Balance**: Ensure exactly 50% of the questions have the answer **True** and 50% have the answer **False**.`;
  switch (bloomsLevel) {
    case "analyzing":
      template = `
      Generate ${num_questions} True/False questions targeting the **Analyzing** tier of Bloom’s Taxonomy.

      **Requirements**:
      1. **Focus**: Questions must require dissection of **multi-step cause-effect chains**, **hidden system dependencies**, or **non-linear interactions**.
      2. **Distractors**: Embed partial truths (e.g., correct facts used to support flawed conclusions).
      3. **Format**: Output as a **strict JSON array**.
      4. **Explanation**: Justify the answer (*True* or *False*) by explicitly analyzing the logical structure, assumptions, and systemic complexities. Prioritize *why* the answer is correct, not just why alternatives are wrong.
      ${balanceInstruction}

      **Examples**:
        [
          {
            "question": "Switching from conventional to organic farming practices always results in higher biodiversity in local ecosystems.",
            "answer": "False",
            "explanation": "An analysis is required of multiple factors such as pesticide use, crop rotation, soil management, and local ecosystem variability. While organic practices can promote biodiversity, exceptions exist where ecological factors or management practices may not lead to higher biodiversity. Students must dissect these factors to understand why the statement is not universally true."
          },
          {
            "question": "Implementing a comprehensive public transportation network in urban areas consistently reduces traffic congestion and carbon emissions.",
            "answer": "True",
            "explanation": "Students must analyze the interplay between urban planning, transit system design, and commuter behavior. Evidence from multiple case studies shows that well-integrated public transportation can effectively reduce the number of private vehicles, thereby lowering congestion and emissions. However, this conclusion depends on system efficiency and user adoption, making it essential to break down each component of the claim."
          }
        ]
 `;
      break;
    case "remembering":
      template = `
      Generate ${num_questions} True/False questions targeting the **Remembering** tier of Bloom’s Taxonomy.

      **Requirements**:
      1. **Focus**: Factual accuracy of definitions, terms, or sequences.
      2. **Distractors**: Use plausible distractors (e.g., swapped terms, common misconceptions).
      3. **Format**: Output as a **strict JSON array**.
      4. **Explanation**: Justify the answer (*True* or *False*) by explicitly analyzing the logical structure, assumptions, and systemic complexities. Prioritize *why* the answer is correct, not just why alternatives are wrong.
      ${balanceInstruction}

      **Examples**:
        [
          {
            "question": "The chemical symbol for gold is 'Ag'.",
            "answer": "False",
            "explanation": "'Au' is gold; 'Ag' is silver."
          },
          {
            "question": "Homer is credited with composing 'The Odyssey'.",
            "answer": "True",
            "explanation": "Homer is traditionally recognized as the author of the epic poem 'The Odyssey', an essential work of ancient Greek literature."
          }
        ]
      `;
      break;
    case "understanding":
      template = `
     Generate ${num_questions} True/False questions targeting the **Understanding** tier of Bloom’s Taxonomy.

      **Requirements**:
      1. Require identification of relationships, paraphrased principles, or summarized ideas.
      2. **Distractors**: Oversimplified causality or misapplied definitions.
      3. **Format**: Output as a **strict JSON array**.
      4. **Explanation**: Justify the answer (*True* or *False*) by explicitly analyzing the logical structure, assumptions, and systemic complexities. Prioritize *why* the answer is correct, not just why alternatives are wrong.
      ${balanceInstruction}

      **Examples**:
      [
        {
          "question": "In economies where an excessive money supply is the primary driver of inflation, reducing the money supply can effectively lower inflation rates—provided that other demand factors remain constant.",
          "answer": "True",
          "explanation": "While inflation often results from multiple factors (such as demand-pull and cost-push pressures), a careful analysis shows that when monetary expansion is the dominant cause, a reduction in the money supply can lower inflation. Students must evaluate the conditional nature of this claim, examining how other economic variables interact with monetary policy."
        },
        {
        "question": "All genetic mutations are harmful because they disrupt DNA sequences.",
        "answer": "False",
        "explanation": "Neutral or beneficial mutations can occur, contributing to genetic diversity and evolution."
        }
      ]
     `;
      break;
    case "applying":
      template = `
      Generate ${num_questions} True/False questions targeting the **Applying** tier of Bloom’s Taxonomy.

        **Requirements**:
        1. Present novel scenarios requiring correct application of rules/principles.
        2. **Distractors**: Misused formulas or ignored contextual constraints.
        3. **Format**: Output as a **strict JSON array**.
        4. **Explanation**: Justify the answer (*True* or *False*) by explicitly analyzing the logical structure, assumptions, and systemic complexities. Prioritize *why* the answer is correct, not just why alternatives are wrong.
        ${balanceInstruction}

        **Examples**:
        [
          {
            "question": "A 10kg object dropped from 20m height has twice the kinetic energy at impact as one dropped from 10m.",
            "answer": "False",
            "explanation": "Kinetic energy depends on velocity squared, which scales with the square root of height, not linearly."
          },
          {
            "question": "Using 5W-30 oil in a car engine designed for 5W-30 improves fuel efficiency under normal operating conditions.",
            "answer": "True",
            "explanation": "In engines specified for 5W-30 oil, this viscosity provides optimal lubrication, reducing friction losses and promoting efficient engine performance. When used as recommended, it contributes to improved fuel economy by ensuring that moving parts operate smoothly under typical temperature conditions."
          }
        ]
      `;
      break;
    case "evaluating":
      template = `
      Generate ${num_questions} True/False questions targeting the **Evaluating** tier of Bloom’s Taxonomy.

      **Requirements**:
      1. Require judgment of validity, ethics, or efficacy using explicit criteria.
      2. **Distractors**: Unstated biases or incomplete evaluation frameworks.
      3. **Format**: Output as a **strict JSON array**.
      4. **Explanation**: Justify the answer (*True* or *False*) by explicitly analyzing the logical structure, assumptions, and systemic complexities. Prioritize *why* the answer is correct, not just why alternatives are wrong.
      ${balanceInstruction}

      **Examples**:
      [
        {
          "question": "Blockchain technology enhances payment security by providing a decentralized and tamper-resistant ledger.",
          "answer": "True",
          "explanation": "Blockchain’s decentralized structure and cryptographic security make transactions more resistant to fraud and unauthorized alterations. However, overall security also depends on implementation factors such as wallet protection and exchange security."
        },
        {
          "question": "Standardized testing is the fairest way to assess student ability because it treats everyone equally.",
          "answer": "False",
          "explanation": "Overlooks socioeconomic biases and individual learning-style diversity, which can disadvantage certain groups."
        }
      ]
      `;
      break;
    case "create":
      template = `
      Generate ${num_questions} True/False questions targeting the **Creating** tier of Bloom’s Taxonomy.

        **Requirements**:
        1. Assess feasibility/coherence of novel solutions or designs.
        2. **Distractors**: Physically impossible integrations or overlooked emergent properties.
        3. **Format**: Output as a **strict JSON array**.
        4. **Explanation**: Justify the answer (*True* or *False*) by explicitly analyzing the logical structure, assumptions, and systemic complexities. Prioritize *why* the answer is correct, not just why alternatives are wrong.
        ${balanceInstruction}

        **Examples**:
        [
          {
            "question": "Combining wind turbines with solar panels guarantees 24/7 renewable energy without storage systems.",
            "answer": "False",
            "explanation": "Weather patterns may synchronize low wind/sun, requiring storage for gaps."
          },
          {
            "question": "Using AI to moderate all online content eliminates misinformation while preserving free speech.",
            "answer": "False",
            "explanation": "AI biases and context misinterpretation create false positives/negatives in moderation."
          }
        ]
    `;
      break;
  }

  return template;
}


export function generateIdentification(
  bloomsLevel: BloomLevelTypes,
  num_questions: number
) {
  let template;
  switch (bloomsLevel) {
    case "analyzing":
      template = `
      Generate ${num_questions} short-answer questions targeting Bloom's **Analyzing** level.  

      **Requirements**:  
      - Answers: 1-5 words (missing factors/flaws).  
      - Focus: Dissection of multi-step cause-effect chains, hidden system dependencies, or non-linear interactions.
      - Explanation: Write a **student-friendly explanation** that:  
          - Starts with a simple, direct statement of *why* the answer is correct.  
          - Unpacks the logic step-by-step (e.g., "First... Next... Finally...").  
          - Uses relatable analogies or examples to clarify complex relationships.  
          - Highlights a common mistake students might make and why it’s incorrect. 
    
      - Format Output as a **strict JSON array**.   

      **Examples**:  

      [  
        {  
          "question": "Key flaw in 'all AI will replace artists'?",  
          "answer": "Human creativity irreplaceable",  
          "explanation": "Analyzes limitations of algorithmic art."  
        }  ,
      {  
          "question": "Critical missing link in linear climate models?",  
          "answer": "Feedback loops",  
          "explanation": "Identifies oversimplified systemic interactions."  
        }  
      ]  
      `;
      break;
    case "remembering":
      template = `  
    Generate ${num_questions} short-answer questions targeting Bloom's **Remembering** level.  

    **Requirements**:  
    - Answers: 1-3 words (terms, dates, names).  
    - Focus: Verbatim recall of facts/definitions.  
    - Explanation: Write a **student-friendly explanation** that:  
          - Starts with a simple, direct statement of *why* the answer is correct.  
          - Unpacks the logic step-by-step (e.g., "First... Next... Finally...").  
          - Uses relatable analogies or examples to clarify complex relationships.  
          - Highlights a common mistake students might make and why it’s incorrect. 
 
    - Distractors: Common misconceptions.  
    - Format Output as a **strict JSON array**.   

    **Examples**:  
    [  
      {  
        "question": "Primary pigment in plant photosynthesis?",  
        "answer": "Chlorophyll",  
        "explanation": "Recalls foundational biology fact."  
      }, 
      {  
        "question": "Newton's first law of motion?",  
        "answer": "Inertia",  
        "explanation": "Recalls core physics terminology."  
      }  
    ]  `;
      break;
    case "understanding":
      template = `
      Generate ${num_questions} short-answer questions targeting Bloom's **Understanding** level.  

      **Requirements**:  
      - Answers: 2-5 words (paraphrased principles).  
      - Focus: Relationships between ideas. 
      - Explanation: Write a **student-friendly explanation** that:  
          - Starts with a simple, direct statement of *why* the answer is correct.  
          - Unpacks the logic step-by-step (e.g., "First... Next... Finally...").  
          - Uses relatable analogies or examples to clarify complex relationships.  
          - Highlights a common mistake students might make and why it’s incorrect. 
 
      - Format Output as a **strict JSON array**.   

      **Examples**:  
      [  
        {  
          "question": "Why do prices rise during shortages?",  
          "answer": "Supply-demand imbalance",  
          "explanation": "Demonstrates understanding of economic cause-effect."  
        },
        {  
          "question": "What makes viruses non-living?",  
          "answer": "No cellular structure",  
          "explanation": "Shows comprehension of life criteria."  
        } 
      ]  
      
      `;
      break;
    case "applying":
      template = `
      Generate ${num_questions} short-answer questions targeting Bloom's **Applying** level.  

      **Requirements**:  
      - Answers: 2-5 words (methods/tools).  
      - Focus: Correct implementation in novel scenarios.  
      - Explanation: Write a **student-friendly explanation** that:  
          - Starts with a simple, direct statement of *why* the answer is correct.  
          - Unpacks the logic step-by-step (e.g., "First... Next... Finally...").  
          - Uses relatable analogies or examples to clarify complex relationships.  
          - Highlights a common mistake students might make and why it’s incorrect. 
 
      - Format Output as a **strict JSON array**.   

      **Examples**:  
      [  
        {  
          "question": "Best method to test drug efficacy?",  
          "answer": "Double-blind trial",  
          "explanation": "Applies research design principles."  
        },
        {  
          "question": "Tool to measure earthquake magnitude?",  
          "answer": "Richter scale",  
          "explanation": "Applies geology instrumentation knowledge."  
        }  
      ]  
      
      `;
    case "evaluating":
      template = `
      Generate ${num_questions} short-answer questions targeting Bloom's **Evaluating** level.  

      **Requirements**:  
      - Answers: 2-5 words (criteria/priorities).  
      - Focus: Validity or ethical trade-offs.  
      - Explanation: Write a **student-friendly explanation** that:  
          - Starts with a simple, direct statement of *why* the answer is correct.  
          - Unpacks the logic step-by-step (e.g., "First... Next... Finally...").  
          - Uses relatable analogies or examples to clarify complex relationships.  
          - Highlights a common mistake students might make and why it’s incorrect. 
 
      - Format Output as a **strict JSON array**.   

      **Examples**:  
      [  
        {  
          "question": "Most ethical issue in facial recognition?",  
          "answer": "Privacy violation",  
          "explanation": "Evaluates societal impact priorities."  
        }, 
        {  
          "question": "Weakest link in blockchain security?",  
          "answer": "Human error",  
          "explanation": "Critiques system vulnerability hierarchy."  
        }  
      ]  
      `;
      break;
    case "create":
      template = `
        Generate ${num_questions} short-answer questions targeting Bloom's **Creating** level.  

      **Requirements**:  
      - Answers: 2-5 words (innovative components).  
      - Focus: Feasibility of novel solutions.
      - Explanation: Write a **student-friendly explanation** that:  
          - Starts with a simple, direct statement of *why* the answer is correct.  
          - Unpacks the logic step-by-step (e.g., "First... Next... Finally...").  
          - Uses relatable analogies or examples to clarify complex relationships.  
          - Highlights a common mistake students might make and why it’s incorrect. 
 
      - Format Output as a **strict JSON array**.   

      **Examples**:  
      [  
        {  
          "question": "Essential element for sustainable megacities?",  
          "answer": "Vertical green spaces",  
          "explanation": "Synthesizes urban ecology/design principles."  
        },
        {  
          "question": "Core feature of unhackable quantum networks?",  
          "answer": "Entanglement encryption",  
          "explanation": "Creates novel security architecture."  
        }  
      ]  
        `;
  }

  return template;
}
