import { default as OpenAI } from "openai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

dotenv.config({ path: "../../.env" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ProfileSchema = z.object({
  name: z.string(),
  nickname: z.string().nullable(),
  birthday: z.string().nullable(),
  age: z.number().nullable(),
  occupation: z.string().nullable(),
  location: z.string().nullable(),
  education: z.string().nullable(),
  interests: z.array(z.string()),
  hobbies: z.array(z.string()),
  skills: z.array(z.string()),
  experience: z.string().nullable(),
  personalityTraits: z.array(z.string()),
  goals: z.string().nullable(),
  challenges: z.string().nullable(),
  background: z.string().nullable(),
  affiliations: z.array(z.string()),
  favoriteBooks: z.array(z.string()),
  favoriteMovies: z.array(z.string()),
  favoriteMusic: z.array(z.string()),
  achievements: z.array(z.string()),
  family: z.string().nullable(),
  relationshipStatus: z.string().nullable(),
  memorableQuotes: z.array(z.string()),
  additionalNotes: z.string().nullable(),
});

export async function extractTags(journalContent) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful assistant that extracts names from text. Return only a valid JSON array of names with no extra text.",
    },
    {
      role: "user",
      content: `Extract only the main subject(s) — the primary person or people being described in detail — from the following text. Ignore passing mentions of others. Return only a valid JSON array of names. Example: ["Mary", "John"]. If no main subjects are found, return []. Text: "${journalContent}"`,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages,
    });

    const rawText = response.choices[0].message.content.trim();
    const namesArray = JSON.parse(rawText);

    if (!Array.isArray(namesArray)) throw new Error("Not an array");

    return namesArray;
  } catch (error) {
    console.error("Error extracting names:", error);
    return [];
  }
}

function buildProfilePrompt(name, notebookContents) {
  const combinedNotes = notebookContents.join("\n\n");
  return [
    {
      role: "system",
      content:
        "You are a helpful assistant that builds structured profiles. Return valid JSON with no extra text.",
    },
    {
      role: "user",
      content: `
We have a person named "${name}".
Use ONLY the content in the notes to generate a detailed profile for ${name} and about them only. The content may include information about other people, but you must extract information just about ${name}. Do not guess or assume anything not explicitly mentioned in the notes.

Return valid JSON with the following fields:
  - name (string)
  - nickname (string or null)
  - birthday (ISO date string or null)
  - age (number or null)
  - occupation (string or null)
  - location (string or null)
  - education (string or null)
  - interests (array of strings)
  - hobbies (array of strings)
  - skills (array of strings)
  - experience (string or null)
  - personalityTraits (array of strings)
  - goals (string or null)
  - challenges (string or null)
  - background (string or null)
  - affiliations (array of strings)
  - favoriteBooks (array of strings)
  - favoriteMovies (array of strings)
  - favoriteMusic (array of strings)
  - achievements (array of strings)
  - family (string or null)
  - relationshipStatus (string or null)
  - memorableQuotes (array of strings)
  - additionalNotes (string or null)

For any field that cannot be determined, set it to null (or an empty array for arrays). Do not include any extra text.

NOTES:
${combinedNotes}
      `,
    },
  ];
}

export async function createProfile(name, notebookContents) {
  const messages = buildProfilePrompt(name, notebookContents);
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages,
      response_format: zodResponseFormat(ProfileSchema, "profile"),
    });
    const profileData = completion.choices[0].message.parsed;
    return profileData;
  } catch (error) {
    console.error("Error creating profile:", error);
    return null;
  }
}
