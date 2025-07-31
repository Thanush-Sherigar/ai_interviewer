import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // adjust if you use a different path

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { role, messages } = await req.json();
    const session = await getServerSession(authOptions);

    // Clean the messages: remove any assistant welcome message at the start
    const trimmed = [...messages];
    if (trimmed[0]?.role === 'assistant') trimmed.shift();

    const transcript = trimmed.map((m) =>
      `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`
    ).join('\n');

    const prompt = `
You are a senior technical interviewer. 
Based on the following interview for a ${role} role, provide a concise and honest review.

Include:
- The candidate’s communication and problem-solving
- Strengths and weaknesses
- Whether they are a good fit
- On what should they improve
- Any red flags
Interview Transcript:
${transcript}
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const review = result.response.text();

    // ✅ Save to database
    await prisma.interview.create({
      data: {
        userId: session?.user?.email || 'anonymous',
        role,
        chat: messages,
        review,
      },
    });

    return Response.json({ review });
  } catch (err) {
    console.error('❌ Review API Error:', err);
    return Response.json({ error: 'Failed to generate review' }, { status: 500 });
  }
}