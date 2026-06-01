import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, tripContext } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set');
            return res.status(500).json({ error: 'API key not configured' });
        }

        const systemPrompt = `You are a helpful AI travel assistant for Pawsport, specializing in pet travel and relocation. Your role is to:

1. Help pet owners prepare personalized travel checklists
2. Explain travel regulations for different countries
3. Guide users through required documentation (health certificates, vaccination records, import permits, etc.)
4. Provide timeline recommendations for travel preparation
5. Answer questions about pet travel requirements, microchipping, quarantine periods, and airline policies

Be friendly, clear, and concise. Always ask for necessary details like origin, destination, pet type, and travel date when creating customized advice. Use emojis sparingly to make responses engaging but professional.

When discussing regulations or requirements, always remind users to verify with official sources as rules can change.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: tripContext ? `${systemPrompt}\n\n${tripContext}` : systemPrompt },
                    ...messages,
                ],
                temperature: 0.7,
                max_tokens: 500,
                stream: false,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenAI API Error:', error);
            return res.status(response.status).json({ 
                error: 'Failed to get AI response',
                details: error 
            });
        }

        const data = await response.json();
        const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        return res.status(200).json({ 
            message: assistantMessage,
            usage: data.usage 
        });
    } catch (error: any) {
        console.error('AI Chat Error:', error);
        return res.status(500).json({ 
            error: 'Failed to process chat request',
            details: error.message 
        });
    }
}
