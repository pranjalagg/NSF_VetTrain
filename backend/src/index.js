// server/index.js
const cors = require("cors");
const express = require("express");
const OpenAI =  require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config()

const PORT = process.env.PORT || 3001
const app = express();
app.use(cors());
app.use(express.json());

// Configure OpenAI
// console.log("prompt", process.env.MY_PROMPT_COMP_OVER)
const pattern = /{[^}]*}/

app.post("/api", async (req, res) => {
    try {
      const { currentQuestion, currentAnswer } = req.body;
      console.log("currentQuestion", currentQuestion);
      
      let completion;
      let responseJson;

      // Check length
      const answerLength = currentAnswer.length;
      let prompt;

      if (answerLength <= process.env.LENGTH_THRESHOLD) {
        // console.log("Short");
        prompt = process.env.MY_PROMPT_SUCC_UNDER;
        model = process.env.GEMINI_MODEL_NAME;
        
        completion = await callGemini(model, prompt, currentQuestion, currentAnswer);
        match = completion.response.text().match(pattern)
        responseJson=JSON.parse(match);

      } else {
        prompt = process.env.MY_PROMPT_COMP_OVER;
        model = process.env.GPT_MODEL_NAME;
        // modelCall = callGPT
        completion = await callGPT(model, prompt, currentQuestion, currentAnswer);
        responseJson=JSON.parse(completion.choices[0].message.content.trim());
      }
      res.json(responseJson)
      console.log(responseJson);
    }
    catch (error) {
      console.error("Error calling Language model: ", error)
      res.status(500).json({ error: "An error occured while processing your request" })
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const callGemini = (modelName, prompt, question, answer) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName, systemInstructions: "You are a helpful assistant" });

  chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: prompt
          }
        ]
      },
    ]
  });
  return chat.sendMessage(`\nInterviewer: ${question}\nVeteran: ${answer}\n\nThink about it step by step and give the reason and the final answer in a json format like {{"reason": "<reason>", "ans": "<answer>"}}.`);

  // const promptGem = `${prompt}\nInterviewer: ${question}\nVeteran: ${answer}\n\nThink about it step by step and give the reason and the final answer in a json format like {{"reason": "<reason>", "ans": "<answer>"}}.`;
  // return model.generateContent(promptGem);
}

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