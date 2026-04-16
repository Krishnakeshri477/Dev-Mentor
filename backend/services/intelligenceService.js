import Groq from 'groq-sdk';
import axios from 'axios';

/**
 * Analyzes aggregated user data to provide high-level career coaching intelligence.
 * @param {Object} userData - User profile, Resume, and Interaction history.
 */
export const generateCareerIntelligence = async ({ user, resume, interactions }) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Prepare context strings
  const resumeContext = resume 
    ? `Latest Resume (ATS Score: ${resume.atsScore}): Skills extracted: ${resume.skills.join(', ')}. Summary: ${resume.summary}`
    : "No resume uploaded yet.";

  const interactionContext = interactions.length > 0
    ? interactions.slice(0, 10).map(i => `User: ${i.query}\nAI: ${i.aiResponse.slice(0, 100)}...\nWeakSpots: ${i.identifiedWeakSpots.join(', ')}`).join('\n---\n')
    : "No past interactions recorded.";

  const systemPrompt = `
    You are the Chief Intelligence Officer of DevMentor AI. 
    Analyze the user's career trajectory based on their resume and recent chat interactions.

    RESUME CONTEXT:
    ${resumeContext}

    INTERACTION HISTORY:
    ${interactionContext}

    GOAL:
    1. Assess the current "atsScore" (use the latest resume score if available).
    2. Consolidate "skills" from the resume.
    3. Identify "weakAreas" by looking at where the user struggled in interactions or what is missing from their resume compared to industry demands.
    4. Write a "userSummary" that sounds like a human coach giving a weekly briefing.
    5. Create a 3-step "actionPlan" for the next 7 days.
    6. Return the response as a strict JSON object.

    SCHEMA:
    {
      "atsScore": number,
      "skills": ["Skill 1"],
      "weakAreas": ["Topic 1"],
      "userSummary": "String",
      "actionPlan": ["Action 1", "Action 2", "Action 3"]
    }
  `;


  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: "Generate my comprehensive dashboard intelligence report." }
      ],
      model: 'openai/gpt-oss-20b',
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    return content;
  } catch (error) {
    console.error('Intelligence Engine Error:', error);
    throw new Error('Failed to generate career intelligence');
  }
};

/**
 * Matches user profile and resume with job listings to predict shortlist probability and skill gaps.
 * @param {Object} params - experienceLevel, preferredLocation, resume, jobs list.
 */
export const matchJobsWithResume = async ({ experienceLevel, preferredLocation, resume, jobs }) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const jobContext = JSON.stringify(jobs, null, 2);
  

  const systemPrompt = `
    You are an Expert Talent Matcher. 
    Compare the candidate's profile with the provided job listings.

    CANDIDATE PROFILE:
    Experience: ${experienceLevel}
    Preferred Location: ${preferredLocation}
    Skills: ${resume?.skills?.join(', ') || 'Not specified'}
    Resume Summary: ${resume?.summary || 'Not specified'}

    JOBS LIST:
    ${jobContext}

    INSTRUCTIONS:
    1. For each job, calculate a "matchScore" (0-100) and "shortlistProbability" (0-100).
    2. Determine a "matchLevel" (e.g., "High Match", "Potential", "Stretch").
    3. Identify "missingSkills" from the candidate's profile required for the job.
    4. Provide a punchy "insight" for each job.
    5. Return the results in the "jobs" array as a JSON object.

    SCHEMA:
    {
      "jobs": [
        {
          "jobTitle": "String",
          "matchScore": number,
          "shortlistProbability": number,
          "matchLevel": "String",
          "experienceRequired": "String",
          "requiredSkills": ["Skill 1"],
          "missingSkills": ["Skill 1"],
          "insight": "String",
          "applyUrl": "String",
          "companyName": "String",
          "location": "String",
          "jobDescription": "String"
        }
      ]
    }
  `;


  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: "Perform matching analysis for the provided jobs." }
      ],
      model:'openai/gpt-oss-20b',
      temperature: 0.2, // Lower temperature for more deterministic scoring
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    return content;
  } catch (error) {
    console.error('Job Matching Error:', error);
    throw new Error('Failed to match jobs with resume');
  }
};

/**
 * Searches the web for real job listings and parses them into structured data.
 * @param {Object} resume - User resume data.
 * @param {string} preferredLocation - Target location.
 */
export const searchJobsOnWeb = async (resume, preferredLocation, experienceLevel) => {
  if (!process.env.SERPER_API_KEY) {
    throw new Error('Serper API Key missing');
  }

  // Optimize search query for freshness and relevance
  const primarySkills = resume.skills.slice(0, 3).join(' ');
  const dateLimit = 'after:2025-01-01'; // Get relatively recent jobs
  const searchQuery = `jobs "${primarySkills}" "${experienceLevel}" "${preferredLocation}" ${dateLimit} site:linkedin.com/jobs OR site:indeed.com OR site:glassdoor.com`;

  try {
    const response = await axios.post('https://google.serper.dev/search', {
      q: searchQuery,
      num: 10
    }, {
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const searchResults = response.data.organic || [];
    if (searchResults.length === 0) return [];

    // Use Groq to parse search snippets into robust structured job objects
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const extractionPrompt = `
      Extract structured job opportunities from these raw search results:
      ${JSON.stringify(searchResults)}

      INSTRUCTIONS:
      1. Extract Job Title, Company, Location, and a clean Description.
      2. Guess the "experienceRequired" (e.g., "Entry", "Senior") based on the text.
      3. Return ONLY a JSON object with a "jobs" array.

      SCHEMA:
      {
        "jobs": [
          {
            "jobTitle": "String",
            "company": "String",
            "location": "String",
            "jobDescription": "String",
            "applyUrl": "String",
            "experienceRequired": "String"
          }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: extractionPrompt }],
      model: 'openai/gpt-oss-20b',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(chatCompletion.choices[0]?.message?.content || '{"jobs": []}');
    return parsed.jobs;

  } catch (error) {
    console.error('Web Job Search Error:', error.message);
    throw new Error('Failed to search and parse web jobs');
  }
};
