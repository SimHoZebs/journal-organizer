import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Initialize the OpenAI client
export const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribes audio using OpenAI's API
 * @param audioBuffer The buffer containing audio data
 * @returns The transcribed text
 */
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
	try {
		console.log("transcribeAudio called with buffer size:", audioBuffer.length);

		// Check if API key is configured
		if (!process.env.OPENAI_API_KEY) {
			console.error("OPENAI_API_KEY is not set in environment variables");
			throw new Error("OpenAI API key is missing");
		}

		// Create a temporary file from the buffer
		const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.m4a`);
		console.log("Writing buffer to temporary file:", tempFilePath);
		fs.writeFileSync(tempFilePath, audioBuffer);

		console.log(
			"Temporary file created, size:",
			fs.statSync(tempFilePath).size,
		);

		// Use fs.createReadStream for the file
		console.log("Calling OpenAI API with model: gpt-4o-mini-transcribe");
		const response = await openai.audio.transcriptions.create({
			file: fs.createReadStream(tempFilePath),
			model: "gpt-4o-mini-transcribe",
			response_format: "text",
		});

		console.log("OpenAI API response received");
		console.log(
			"Transcription result (first 100 chars):",
			`${response.substring(0, 100)}...`,
		);

		// Clean up the temporary file
		console.log("Cleaning up temporary file:", tempFilePath);
		fs.unlinkSync(tempFilePath);

		return response;
	} catch (error) {
		console.error("Error transcribing audio:", error);
		throw new Error(
			`Failed to transcribe audio: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Streams audio transcription using OpenAI's API
 * @param audioFile The audio file to process
 * @param onChunk Callback function that receives each text chunk
 * @param onComplete Callback function called when transcription completes
 */
export const streamTranscribeAudio = async (
	audioFile: File,
	onChunk: (chunk: string, isDelta: boolean) => void,
	onComplete: (fullTranscript: string) => void,
): Promise<void> => {
	try {
		// Convert File to Buffer and save to temporary file
		const arrayBuffer = await audioFile.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const tempFilePath = path.join(
			os.tmpdir(),
			`audio-stream-${Date.now()}.m4a`,
		);
		fs.writeFileSync(tempFilePath, buffer);

		// Use fs.createReadStream for the file
		const stream = await openai.audio.transcriptions.create({
			file: fs.createReadStream(tempFilePath),
			model: "gpt-4o-transcribe",
			response_format: "text",
			stream: true,
		});

		for await (const chunk of stream) {
			console.log("Received chunk:", chunk);
			// Check if it's a delta event
			if (chunk.type === "transcript.text.delta") {
				onChunk(chunk.delta, true);
			}
			// Check if it's the final complete text
			else if (chunk.type === "transcript.text.done") {
				onComplete(chunk.text);
			}
		}

		// Clean up the temporary file
		fs.unlinkSync(tempFilePath);
	} catch (error) {
		console.error("Error streaming transcription:", error);
		throw error;
	}
};
