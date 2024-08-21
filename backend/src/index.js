// server/index.js
const cors = require("cors");
const express = require("express");
const OpenAI =  require("openai");

const PORT = process.env.PORT || 3001
const app = express();
app.use(cors());
app.use(express.json());

// Configure OpenAI
const client = new OpenAI({
  apiKey: 'sk-proj-EAwdhbxQQJh6ov9XiVrAT3BlbkFJext50ovrgzJQlDK78H4k'
})

app.post("/api", async (req, res) => {
    req.body;
    try {
      const { currentQuestion } = req.body;

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
                "text": `Classify the answer as succinct or under-explained\n${currentQuestion}`
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