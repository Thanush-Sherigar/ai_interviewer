import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { role, difficulty, messages } = await req.json();

    // 1. Remove non-user messages at the beginning
    const trimmed = [...messages];
    while (trimmed.length && trimmed[0].role !== 'user') {
      trimmed.shift();
    }

    // 2. Role + difficulty-based prompt
    const rolePrompts = {
      frontend: {
        easy: `You are a senior frontend interviewer. Ask beginner-level questions about HTML, CSS, or basic JavaScript.one q at a time wait for response`,
        medium: `You are a senior frontend interviewer. Ask intermediate-level questions about JavaScript, React, and DOM manipulation.one q at a time wait for response`,
        hard: `You are a senior frontend interviewer. Ask advanced-level questions about React internals, performance, and architecture.one q at a time wait for response`,
      },
      backend: {
        easy: `You are a backend interviewer. Ask simple questions about APIs, HTTP, and Node.js basics.one q at a time wait for response`,
        medium: `You are a backend interviewer. Ask moderate questions about Express, database queries, and authentication.one q at a time wait for response`,
        hard: `You are a backend interviewer. Ask advanced questions about architecture, scaling, and security.one q at a time wait for response`,
      },
      devops: {
        easy: `You are a DevOps interviewer. Ask beginner-level questions on Git, Linux commands, and system basics.one q at a time wait for response`,
        medium: `You are a DevOps interviewer. Ask about CI/CD pipelines, Docker, and basic automation.one q at a time wait for response`,
        hard: `You are a DevOps interviewer. Ask about Kubernetes, monitoring, incident handling, and high-availability systems.one q at a time wait for response`,
      },
    };

    const prompt =
      rolePrompts[role?.toLowerCase()]?.[difficulty?.toLowerCase()] ||
      'You are a technical interviewer. Ask one question at a time.';

    // 3. Build chat history
    const history = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
      ...trimmed.slice(0, -1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    ];

    // 4. Start Gemini chat
    const chat = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).startChat({
      history,
    });

    const userInput = trimmed[trimmed.length - 1]?.content || 'Hello';

    const result = await chat.sendMessage(userInput);
    const reply = result.response.text();

    return Response.json({ reply });
  } catch (err) {
    console.error('❌ Gemini Chat API Error:', err);
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}