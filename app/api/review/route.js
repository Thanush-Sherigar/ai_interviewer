﻿import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    console.log('ðŸ“ Review API called');
    const { role, messages } = await req.json();
    
    if (!role || !messages || messages.length === 0) {
      console.log('âŒ Missing required data');
      return Response.json({ error: 'Missing role or messages' }, { status: 400 });
    }

    console.log(`ðŸ“‹ Generating review for ${role} role with ${messages.length} messages`);

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
â€¢ [Point about communication style]
â€¢ [Point about problem-solving approach]

**Technical Strengths:**
â€¢ [Specific strength 1]
â€¢ [Specific strength 2]

**Areas for Improvement:**
â€¢ [Improvement area 1]
â€¢ [Improvement area 2]

**Overall Assessment:**
â€¢ [Overall fit assessment]
â€¢ [Recommendation]

**Key Takeaways:**
â€¢ [Main takeaway 1]
â€¢ [Main takeaway 2]

Keep each bullet point concise (1-2 sentences max). Be honest but constructive.

Interview Transcript:
${transcript}
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('ðŸ¤– Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const review = result.response.text();
    console.log('âœ… Review generated successfully');

    // âœ… Save to database (optional, can be removed if causing issues)
    try {
      await prisma.interview.create({
        data: {
          userId: 'anonymous',
          role,
          chat: messages,
          review,
        },
      });
      console.log('ðŸ’¾ Saved to database');
    } catch (dbError) {
      console.log('âš ï¸ Database save failed (continuing anyway):', dbError.message);
    }

    return Response.json({ review });
  } catch (err) {
    console.error('âŒ Review API Error:', err);
    
    // Return a proper JSON error response
    return Response.json({ 
      error: 'Failed to generate review',
      details: err.message 
    }, { status: 500 });
  }
}
