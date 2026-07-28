const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


function getCleanJsonSchema(zodSchema) {
  return zodToJsonSchema(zodSchema, { target: "openApi3" });
}

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z.string().describe("Technical question for the interview"),
        intention: z.string().describe("Interviewer intention behind asking"),
        answer: z.string().describe("How to answer with key points and approach"),
      })
    )
    .describe("Technical interview questions"),
  behavioralQuestions: z
    .array(
      z.object({
        question: z.string().describe("Behavioral question for the interview"),
        intention: z.string().describe("Interviewer intention behind asking"),
        answer: z.string().describe("How to answer with STAR technique/key points"),
      })
    )
    .describe("Behavioral interview questions"),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("Lacking skill"),
        severity: z.enum(["low", "medium", "high"]).describe("Skill gap severity"),
      })
    )
    .describe("Candidate skill gaps"),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("Day number starting from 1"),
        focus: z.string().describe("Main focus area for the day"),
        tasks: z.array(z.string()).describe("Actionable task items"),
      })
    )
    .describe("Day-wise preparation plan"),
  title: z.string().describe("Job title"),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: getCleanJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

module.exports = { generateInterviewReport };