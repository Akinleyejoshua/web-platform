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

        if (type === 'blog') {
            systemInstruction = `You are an expert technical writer and software engineer. You generate highly informative, professional blog posts.
The response MUST be a JSON object with the following structure:
{
  "title": "A catchy, optimized technical title",
  "excerpt": "A professional 2-sentence summary/excerpt of the article",
  "content": "Clean, rich HTML code for the blog post content. Use headings (<h2>, <h3>), paragraphs (<p>), bullet lists (<ul><li>), blockquotes (<blockquote>), tables, and preformatted code blocks (<pre><code>) styled nicely.",
  "tags": ["tag1", "tag2", "tag3"]
}`;
            modelPrompt = `Generate a technical blog post based on this topic/prompt: "${prompt}". Respond ONLY with the JSON object structure specified. Do not include markdown code block wrapper around the JSON itself. Ensure the content value is a string containing valid HTML code.`;
        } else {
            // Project or Product data
            systemInstruction = `You are a developer portfolio manager. You generate professional, engaging listings for projects and products.
The response MUST be a JSON object with the following structure:
{
  "title": "Catchy project/product title",
  "description": "A detailed, professional description of the project/product showcasing problem solved, engineering highlights, and value.",
  "technologies": ["Tech1", "Tech2", "Tech3"]
}`;
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
