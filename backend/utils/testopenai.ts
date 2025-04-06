import { queryPrompt } from "./openai";  // adjust path as needed

async function runTest() {
  try {
    const result = await queryPrompt(
      "You are a university-level academic advisor.", // instructions
      "Tell me a general sentence"     // input
    );
    console.log("Response from OpenAI:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

runTest();
