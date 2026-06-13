import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in .env' }, { status: 500 });
        }

        const data = await request.json();
        const { prompt, type } = data;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

        let systemInstruction = '';
        let modelPrompt = '';

        if (type === 'cover-letter') {
            systemInstruction = `You are a professional cover letter writer. Generate a compelling cover letter based on the provided information. The response MUST be a JSON object with this exact structure: { "greeting": "Dear Hiring Manager,", "intro": "2-3 sentence opening introducing the candidate and role interest written as clean HTML (use <p> tags for paragraphs)", "body": "3-4 paragraphs of relevant experience, skills, and achievements written as clean HTML (use <p> tags for paragraphs)", "closing": "Sincerely," }. Rules: greeting should be professional, intro 2-3 sentences, body 3-4 paragraphs each 3-5 sentences, closing 2-3 words. Do NOT include candidate name or signature. Return ONLY valid JSON.`;
            modelPrompt = `Generate a professional cover letter based on this context: "${prompt}". Respond ONLY with the JSON object structure specified. Do not include markdown code block wrapper around the JSON itself.`;
        } else if (type === 'resume') {
            systemInstruction = `You are a professional resume writer. Generate resume content based on the provided information. The response MUST be a JSON object with this exact structure: { "summary": "3-4 sentence professional summary", "skills": ["Skill1", "Skill2", "Skill3"], "highlights": ["Achievement 1", "Achievement 2", "Achievement 3"] }. Rules: summary 3-4 sentences, skills array of 8-12 items, highlights array of 4-6 items. Make it ATS-friendly. Return ONLY valid JSON.`;
            modelPrompt = `Generate professional resume content based on this context: "${prompt}". Respond ONLY with the JSON object structure specified. Do not include markdown code block wrapper around the JSON itself.`;
        } else if (type === 'blog') {
            systemInstruction = `You are an expert technical writer and software engineer. You generate highly informative, professional blog posts. The response MUST be a JSON object with the following structure: { "title": "A catchy, optimized technical title", "excerpt": "A professional 2-sentence summary/excerpt of the article", "content": "Clean, rich HTML code for the blog post content. Use headings (<h2>, <h3>), paragraphs (<p>), bullet lists (<ul><li>), blockquotes (<blockquote>), tables, and preformatted code blocks (<pre><code>) styled nicely.", "tags": ["tag1", "tag2", "tag3"] }`;
            modelPrompt = `Generate a technical blog post based on this topic/prompt: "${prompt}". Respond ONLY with the JSON object structure specified. Do not include markdown code block wrapper around the JSON itself. Ensure the content value is a string containing valid HTML code.`;
        } else {
            // Project or Product data
            systemInstruction = `You are a developer portfolio manager. You generate professional, engaging listings for projects and products. The response MUST be a JSON object with the following structure: { "title": "Catchy project/product title", "description": "A detailed, professional description of the project/product showcasing problem solved, engineering highlights, and value.", "technologies": ["Tech1", "Tech2", "Tech3"] }`;
            modelPrompt = `Generate project/product details based on this prompt: "${prompt}". Respond ONLY with the JSON object structure specified. Do not include markdown code block wrapper around the JSON itself.`;
        }

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: modelPrompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
            },
            systemInstruction: systemInstruction
        });

        const responseText = result.response.text();
        const generatedData = JSON.parse(responseText);

        return NextResponse.json(generatedData, { status: 200 });
    } catch (error: any) {
        console.error('Gemini Generate error:', error);
        return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 });
    }
}
