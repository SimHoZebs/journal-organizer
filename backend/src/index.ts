import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { transcribeAudio } from "./openai";
import { Buffer } from "node:buffer";

new Elysia()
  .onParse(({ request }) => request.arrayBuffer())
  .use(cors())
  // Configure Elysia to accept raw binary data
  .get("/", () => ({ message: "STT API is running!" }))
  // Health check endpoint
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  // Regular transcribe audio endpoint (non-streaming)
  .post("/api/transcribe", async ({ body, request }) => {
    console.log("POST /api/transcribe received");
    console.log("Request headers:", request.headers);
    console.log("Body type:", typeof body);

    let audioBuffer: Buffer | null = null;

    // Handle different potential body types
    if (body instanceof Buffer) {
      console.log("Body is Buffer, size:", body.length, "bytes");
      audioBuffer = body;
    } else if (body instanceof Uint8Array) {
      console.log("Body is Uint8Array, converting to Buffer");
      audioBuffer = Buffer.from(body);
    } else if (body instanceof ArrayBuffer) {
      console.log("Body is ArrayBuffer, converting to Buffer");
      audioBuffer = Buffer.from(new Uint8Array(body));
    } else {
      console.error("request body type is incorrect:", body);
    }

    try {
      if (!audioBuffer || audioBuffer.length === 0) {
        console.error("Invalid or empty audio data");
        return {
          error: "Invalid request. No audio data received",
          status: 400,
        };
      }

      console.log(
        "Calling transcribeAudio with buffer of size:",
        audioBuffer.length,
      );
      const transcription = await transcribeAudio(audioBuffer);
      console.log(
        "Transcription successful:",
        `${transcription.substring(0, 100)}...`,
      );
      return {
        text: transcription,
        status: "success",
      };
    } catch (error) {
      console.error("Error processing transcription request:", error);
      // Ensure we always return a valid JSON object
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        error: `Failed to transcribe audio: ${errorMessage}`,
        status: 500,
      };
    }
  })
  .listen(3000);
