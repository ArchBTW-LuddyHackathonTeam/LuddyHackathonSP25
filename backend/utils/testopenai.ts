import { queryPrompt } from "./llm-webscraper";  // adjust path as needed

async function runTest() {
  try {
    const result = await queryPrompt(
      "Tell me what you see"     // input
    );
    console.log("Response from OpenAI:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

runTest();
