import "dotenv/config";
import axios from "axios";

const API_KEY = process.env.GROK_API_KEY;

console.log("GROK_API_KEY:", API_KEY ? "SET ✅" : "NOT SET ❌");

async function testGroq() {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "user",
            content: "Reply with exactly: Groq API is working!",
          },
        ],
        max_tokens: 50,
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("\n✅ GROQ API WORKING");
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.log("\n❌ GROQ API FAILED");

    console.log("Status:", error.response?.status);

    console.log("Error:", error.response?.data || error.message);
  }
}

testGroq();
