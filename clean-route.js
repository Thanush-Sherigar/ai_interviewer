import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    console.log('📝 Review API called');
    const { role, messages } = await req.json();
    
    if (!role || !messages || messages.length === 0) {
      console.log('❌ Missing required data');
      return Response.json({ error: 'Missing role or messages' }, { status: 400 });
    }

    console.log(`📋 Generating review for ${role} role with ${messages.length} messages`);

    // Clean the messages: remove any assistant welcome message at the start
    const trimmed = [...messages];
    if (trimmed[0]?.role === 'assistant') trimmed.shift();

    const transcript = trimmed.map((m) =>
      `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`
    ).join('\n');

    const prompt = `
You are a senior technical interviewer. 
Based on the following interview for a ${role} role, provide a CONCISE and STRUCTURED review in bullet points.

Format your response exactly like this:

**Communication & Problem-Solving:**
• [Point about communication style]
• [Point about problem-solving approach]

**Technical Strengths:**
• [Specific strength 1]
• [Specific strength 2]

**Areas for Improvement:**
• [Improvement area 1]
• [Improvement area 2]

**Overall Assessment:**
• [Overall fit assessment]
• [Recommendation]

**Key Takeaways:**
• [Main takeaway 1]
• [Main takeaway 2]

Keep each bullet point concise (1-2 sentences max). Be honest but constructive.

Interview Transcript:
${transcript}
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('🤖 Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const review = result.response.text();
    console.log('✅ Review generated successfully');

    // ✅ Save to database (optional, can be removed if causing issues)
    try {
      await prisma.interview.create({
        data: {
          userId: 'anonymous',
          role,
          chat: messages,
          review,
        },
      });
      console.log('💾 Saved to database');
    } catch (dbError) {
      console.log('⚠️ Database save failed (continuing anyway):', dbError.message);
    }

    return Response.json({ review });
  } catch (err) {
    console.error('❌ Review API Error:', err);
    
    // Return a proper JSON error response
    return Response.json({ 
      error: 'Failed to generate review',
      details: err.message 
    }, { status: 500 });
  }
}
