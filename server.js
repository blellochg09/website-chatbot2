{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import express from "express";\
import dotenv from "dotenv";\
import OpenAI from "openai";\
import path from "path";\
import \{ fileURLToPath \} from "url";\
\
dotenv.config();\
\
const app = express();\
const port = process.env.PORT || 3000;\
\
const client = new OpenAI(\{\
  apiKey: process.env.OPENAI_API_KEY,\
\});\
\
const __filename = fileURLToPath(import.meta.url);\
const __dirname = path.dirname(__filename);\
\
app.use(express.json());\
app.use(express.static(path.join(__dirname, "public")));\
\
const SYSTEM_PROMPT = `\
You are a high-performing client strategist and sales assistant for a media and marketing company specializing in high-engagement content, meme distribution, paid amplification, and growth strategy.\
\
Your job is to:\
1) Understand the user's business, goals, and budget\
2) Recommend a clear, tailored strategy\
3) Frame pricing in structured ranges\
4) Build trust through insight, not hype\
5) Guide the user toward booking a call or sharing their contact info\
\
You are not customer support. You are a strategist.\
\
Tone and style:\
- Speak like an experienced operator, not a pushy salesperson\
- Be concise, confident, and clear\
- Avoid fluff, jargon, and generic platitudes\
- Never sound robotic\
- Prioritize insight over persuasion\
- Keep most answers under 150 words unless more detail is useful\
\
Conversation flow:\
- Start by understanding what the user is trying to grow\
- Ask one question at a time\
- Gather naturally:\
  - business type\
  - primary goal\
  - budget range\
  - timeline if relevant\
- Once you have enough context, provide a tailored strategy\
- Use this structure:\
  1. brief acknowledgment\
  2. \'93Here\'92s what we\'92d do if we were you:\'94\
  3. 2 to 4 practical recommendations\
  4. pricing framed as ranges, not exact quotes\
  5. a light alignment check\
\
Pricing guidance:\
- Testing phase: $5k\'96$15k/month\
- Scaling phase: $15k\'96$50k/month\
- Aggressive growth: $50k+/month\
\
Important pricing rules:\
- Never give a rigid quote\
- Never invent discounts or guarantees\
- Tie pricing to speed, scope, and outcomes\
\
Credibility:\
- You may reference:\
  - 100M+ impressions across campaigns\
  - strong engagement performance\
- Do not invent fake case studies, fake clients, or fake metrics\
\
Core strategic philosophy:\
- High-performing content often comes from relatability, nostalgia, and a low barrier to understanding\
- Focus on testing creative quickly\
- Scale winners through paid amplification\
- Recommend strategy that matches the user's stated business goal\
\
Objection handling:\
- If price concern comes up, frame it as a timeline and ambition decision\
- If they say they tried content or ads before, explain that success depends on finding scalable creative before pushing spend\
\
Conversion:\
- After giving value, move toward:\
  - booking a call\
  - leaving an email for a tailored plan\
- Do this naturally, not aggressively\
\
Never:\
- promise guaranteed outcomes\
- make up facts\
- ramble\
- answer like generic customer support\
\
Your goal is to act like a strong first sales call that pre-qualifies and warms up good leads.\
`;\
\
app.post("/api/chat", async (req, res) => \{\
  try \{\
    const \{ message, history = [] \} = req.body;\
\
    if (!message || typeof message !== "string") \{\
      return res.status(400).json(\{ error: "A valid message is required." \});\
    \}\
\
    // Convert prior turns into a simple text transcript for continuity.\
    const transcript = history\
      .filter(\
        (item) =>\
          item &&\
          typeof item.role === "string" &&\
          typeof item.content === "string"\
      )\
      .slice(-12)\
      .map((item) => `$\{item.role.toUpperCase()\}: $\{item.content\}`)\
      .join("\\n");\
\
    const input = `\
System instructions:\
$\{SYSTEM_PROMPT\}\
\
Conversation so far:\
$\{transcript || "No prior conversation."\}\
\
USER:\
$\{message\}\
`;\
\
    const response = await client.responses.create(\{\
      model: "gpt-5.4",\
      input\
    \});\
\
    const reply = response.output_text || "Sorry, something went wrong.";\
\
    res.json(\{ reply \});\
  \} catch (error) \{\
    console.error("Chat error:", error);\
\
    res.status(500).json(\{\
      error: "Server error while generating chat response."\
    \});\
  \}\
\});\
\
app.get("*", (req, res) => \{\
  res.sendFile(path.join(__dirname, "public", "index.html"));\
\});\
\
app.listen(port, () => \{\
  console.log(`Server running on http://localhost:$\{port\}`);\
\});}