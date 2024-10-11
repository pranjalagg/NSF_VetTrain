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
// console.log("prompt", process.env.MY_PROMPT_COMP_OVER)

app.post("/api", async (req, res) => {
    try {
      const { currentQuestion, currentAnswer } = req.body;
      console.log("currentQuestion", currentQuestion);
      let completion;

      // Check length
      const answerLength = currentAnswer.length;
      let prompt;

      if (answerLength <= process.env.LENGTH_THRESHOLD) {
        // console.log("Short");
        prompt = process.env.MY_PROMPT_SUCC_UNDER;
        model = process.env.GEMINI_MODEL_NAME;
        // modelCall = ''
        completion = await callGPT("gpt-3.5-turbo", prompt, currentQuestion, currentAnswer);
      } else {
        // console.log("Long")
        prompt = process.env.MY_PROMPT_COMP_OVER;
        model = process.env.GPT_MODEL_NAME;
        // modelCall = callGPT
        completion = await callGPT(model, prompt, currentQuestion, currentAnswer);
      }

      res.json(JSON.parse(completion.choices[0].message.content.trim()));
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

// const callGemini = (modelName, prompt, question, answer) => {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: modelName });
//   const promptGem = `${prompt}\nInterviewer: ${question}\nVeteran: ${answer}\n\nThink about it step by step and give the reason and the final answer in a json format like {{"reason": "<reason>", "ans": "<answer>"}}.`;
//   const result = model.generateContent(promptGem);
//   console.log("result", result);
//   return result;
// }

const callGPT = (modelname, prompt, question, answer) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  return client.chat.completions.create({
    model: modelname,
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
            "text": `${prompt}\nInterviewer: ${question}\nVeteran: ${answer}\n\nThink about it step by step and give the reason and the final answer in a json format like {{"reason": "<reason>", "ans": "<answer>"}}.`
          }
        ]
      }
    ],
  })
}