import Groq from 'groq-sdk';

export const getGroqResponse = async (query, previousContext) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const systemPrompt = `
    You are a Senior Career Mentor and Expert Backend Developer on the DevMentor AI platform.
    Your goal is to provide high-level, technical, and actionable career advice.
    
    CRITICAL INSTRUCTIONS:
    1. Respond ONLY with a valid JSON object.
    2. Use the provided context from the user's past interactions to make your advice personalized.
    3. If the user makes a technical mistake (e.g., incorrect syntax, flawed architectural logic), identify it in the "mistakes" array.
    4. Keep the "response" professional, encouraging, and deeply insightful.

    Context from user's memory:
    ${previousContext}

    SCHEMA:
    {
      "response": "Your detailed markdown-formatted response",
      "mistakes": ["Mistake 1", "Mistake 2"]
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const contentString = chatCompletion.choices[0]?.message?.content || '{}';
    return JSON.parse(contentString);
  } catch (error) {
    console.error('Groq Error:', error);
    throw new Error('Failed to generate response from Groq');
  }
};

export const analyzeResumeText = async (text) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const prompt = `
    Analyze the following resume text as an expert ATS (Applicant Tracking System) and Senior Recruiter.
    Provide a quantitative and qualitative breakdown of the candidate's profile.

    RESUME TEXT:
    ${text}

    INSTRUCTIONS:
    1. Calculate an "atsScore" (0-100) based on industry standards for modern software engineering roles.
    2. Extract a list of "skills" found in the text.
    3. Identify "missingKeywords" that are common in high-tier engineering roles but missing here.
    4. Provide actionable "suggestions" for improvement.
    5. Write a professional "summary" of the profile.
    6. Return ONLY the JSON object.

    SCHEMA:
    {
      "atsScore": number,
      "skills": ["Skill 1", "Skill 2"],
      "missingKeywords": ["Keyword 1", "Keyword 2"],
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "summary": "String"
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2, // low temperature for structured output
      response_format: { type: "json_object" }
    });

    const contentString = chatCompletion.choices[0]?.message?.content || '{}';
    return JSON.parse(contentString);
  } catch (error) {
    console.error('Groq Resume Analysis Error:', error);
    throw new Error('Failed to analyze resume with Groq');
  }
};
