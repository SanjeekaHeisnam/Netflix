import { GEMINI_KEY } from "./constants";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI({
  apiKey: GEMINI_KEY,
});

export default genAI;