import dotenv from 'dotenv';
dotenv.config();

// FOR CONNECT DATABASE
import { dbConnect } from './src/configs/database.config.js';
dbConnect();

import express from "express";
import cors from 'cors';
import { callChain } from "./src/utils/callChain.js";
import { HumanMessage, AIMessage } from "langchain/schema";

const app = express();
// created this middleware so that we can get the data in the post method, as by default req.body in post method will return undefined.
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
)


app.get("/", async (req, res) => {
  res.send("Welcom!👋 How can i help you.");
});

app.post("/chat", async (req, res) => {
  const body = await req.body;

  if (!body || !body.pastMessages) {
    // Handle the case where body or pastMessages is undefined
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const input = body.input;
  const pastMessages = body.pastMessages.map((msg) => {
    if (msg.type === "human") return new HumanMessage(msg.text);
    if (msg.type === "ai"){
      for(let i = 0; i < msg.paras.length; i++){
        return new AIMessage(msg.paras[i]);
      }
    } 
  });
  const answer = await callChain(input, pastMessages);
  res.json(answer);
});


const port = process.env.PORT || 5000;
app.listen(port,() => {
  console.log("Chatbot served on http://localhost:" + port);
});
