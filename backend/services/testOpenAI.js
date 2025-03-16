import { extractTags } from "./openaiService.cjs";

async function testOpenAI() {
  // Sample text for testing
  const sampleText =
    "At the Madison Square Garden, Andry and William played Magic The Gathering. William was a veteran so he clapped Andry pretty bad.";

  // 1. Extract Tags
  const tags = await extractTags(sampleText);
  console.log("Extracted Tags:", tags);
}

testOpenAI();
