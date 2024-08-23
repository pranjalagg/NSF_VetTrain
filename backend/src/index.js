// server/index.js
const cors = require("cors");
const express = require("express");
const OpenAI =  require("openai");
require("dotenv").config()

const PORT = process.env.PORT || 3001
const app = express();
app.use(cors());
app.use(express.json());

// Configure OpenAI
// console.log("prompt", process.env.MY_PROMPT)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.post("/api", async (req, res) => {
    try {
      const { currentQuestion } = req.body;

      // Check length
      const questionLength = currentQuestion.length;
      let prompt;

      if (questionLength <= process.env.LENGTH_THRESHOLD) {
        // console.log("Short");
        prompt = process.env.MY_PROMPT_SUCC_UNDER;
      } else {
        // console.log("Long")
        prompt = process.env.MY_PROMPT_COMP_OVER;
      }

      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": "You are a helpful assistant"
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `${prompt}\n${currentQuestion}`
              }
            ]
          }
        ],
      })
      res.json({ response: completion.choices[0].message.content.trim() });
      console.log(completion.choices[0].message.content.trim());
    }
    catch (error) {
      console.error("Error calling ChatGPT: ", error)
      res.status(500).json({ error: "An error occured while processing your request" })
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});