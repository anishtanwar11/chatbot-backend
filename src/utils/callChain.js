import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { template } from "./template.js";
import { configDotenv } from "dotenv";

// getting access to the environment variable
configDotenv();

export const callChain = async (input, pastMessages) => {
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName:"gpt-3.5-turbo",
    temperature: 0.5,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(template),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const memory = new BufferMemory({
    returnMessages: true,
    chatHistory: new ChatMessageHistory(pastMessages),
  });

  const chain = new ConversationChain({
    prompt,
    llm,
    memory,
  });
  const res = await chain.call({ input })
  return res;
};
