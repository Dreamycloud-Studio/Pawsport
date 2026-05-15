import { Request, Response } from 'express';
import { LLMService } from '../services/llmService';

const llmService = new LLMService();

export async function handleChat(req: Request, res: Response): Promise<void> {
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            res.status(400).json({ message: 'messages array is required' });
            return;
        }
        const reply = await llmService.chat(messages);
        res.status(200).json({ message: reply });
    } catch (error: any) {
        res.status(500).json({ message: 'Error generating response', error: error.message });
    }
}
