import axios from 'axios';
import planValidationService from './planValidationService';
import { PlanValidationResult } from '../types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MAX_RETRIES = 2;

export class LLMService {
    public async getTravelChecklist(params: any): Promise<PlanValidationResult> {
        console.log('=== LLM Service getTravelChecklist ===');
        console.log('OPENAI_API_KEY exists:', !!OPENAI_API_KEY);
        console.log('OPENAI_API_KEY length:', OPENAI_API_KEY?.length);
        console.log('Params:', params);
        
        if (!OPENAI_API_KEY) {
            console.error('ERROR: OPENAI_API_KEY is not set!');
            return {
                valid: false,
                warnings: ['OPENAI_API_KEY environment variable is not set. Please check server/.env file.']
            };
        }
        
        let lastResult: PlanValidationResult | null = null;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`Attempt ${attempt + 1} of ${MAX_RETRIES + 1}`);
                const prompt = planValidationService.createPromptForStructuredPlan(params);
                
                console.log('Calling OpenAI API...');
                const response = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-4',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a pet travel planning assistant. Always respond with valid JSON only, no markdown formatting.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 2000
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${OPENAI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('OpenAI response received');
                let data: any = response.data;
                
                // Extract the content from OpenAI response
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    const content = data.choices[0].message.content;
                    console.log('Content length:', content.length);
                    
                    // Parse JSON from content
                    try {
                        data = JSON.parse(content);
                        console.log('Successfully parsed JSON from OpenAI');
                    } catch (parseError: any) {
                        console.error('Failed to parse JSON:', parseError.message);
                        lastResult = {
                            valid: false,
                            warnings: [`Attempt ${attempt + 1}: Failed to parse JSON from OpenAI response - ${parseError.message}`]
                        };
                        continue;
                    }
                } else {
                    console.error('Invalid OpenAI response structure');
                    lastResult = {
                        valid: false,
                        warnings: [`Attempt ${attempt + 1}: Invalid OpenAI response format`]
                    };
                    continue;
                }
                
                // Validate the plan
                console.log('Validating plan...');
                const validationResult = planValidationService.validatePlan(data);
                console.log('Validation result:', validationResult.valid);
                
                if (validationResult.valid) {
                    console.log('Plan is valid!');
                    return validationResult;
                } else {
                    console.log('Plan validation failed:', validationResult.warnings);
                    lastResult = {
                        valid: false,
                        warnings: [...(lastResult?.warnings || []), `Attempt ${attempt + 1}:`, ...validationResult.warnings]
                    };
                }

            } catch (error: any) {
                console.error(`Attempt ${attempt + 1} error:`, error.message);
                console.error('Error details:', error.response?.data || error);
                lastResult = {
                    valid: false,
                    warnings: [...(lastResult?.warnings || []), `Attempt ${attempt + 1} error: ${error.message}`]
                };
            }
        }

        console.log('All attempts failed');
        return lastResult || {
            valid: false,
            warnings: ['Failed to generate valid plan after all retries']
        };
    }

    public async chat(messages: { role: string; content: string }[]): Promise<string> {
        if (!OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set');
        }
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are Pawsport AI, a friendly and expert pet travel assistant. Help pet owners plan international travel with their pets — covering regulations, vaccinations, documentation, timelines, and logistics. Be concise and practical.'
                    },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 800
            },
            { headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
        );
        return response.data.choices[0].message.content;
    }

    public async queryRegulations(question: string, destinationCountry: string, petType: string): Promise<{ answer: string; sources: { name: string; url: string; topic: string }[] }> {
        if (!OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set');
        }
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `You are a pet travel regulation expert. Answer questions about importing ${petType}s into ${destinationCountry}. Be accurate, cite official sources where possible, and flag anything time-sensitive. Respond as JSON: { "answer": "...", "sources": [{ "name": "...", "url": "...", "topic": "..." }] }`
                    },
                    { role: 'user', content: question }
                ],
                temperature: 0.3,
                max_tokens: 1000
            },
            { headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
        );
        const content = response.data.choices[0].message.content;
        try {
            return JSON.parse(content);
        } catch {
            return { answer: content, sources: [] };
        }
    }

    public async getRegulationSummary(params: any): Promise<any> {
        try {
            // Mock implementation - replace with actual OpenAI call if needed
            return {
                summary: 'Regulation summary not yet implemented with OpenAI'
            };
        } catch (error: any) {
            throw new Error('Error fetching regulation summary: ' + error.message);
        }
    }

    public async explainDocuments(documents: any[]): Promise<any> {
        try {
            // Mock implementation - replace with actual OpenAI call if needed
            return {
                explanation: 'Document explanation not yet implemented with OpenAI'
            };
        } catch (error: any) {
            throw new Error('Error explaining documents: ' + error.message);
        }
    }

    public async getCulturalNotes(params: any): Promise<any> {
        try {
            // Mock implementation - replace with actual OpenAI call if needed
            return {
                notes: 'Cultural notes not yet implemented with OpenAI'
            };
        } catch (error: any) {
            throw new Error('Error fetching cultural notes: ' + error.message);
        }
    }

    public async getTravelRuleExplanation(origin: string, destination: string, petType: string): Promise<any> {
        try {
            // Mock implementation - replace with actual OpenAI call if needed
            return {
                explanation: 'Travel rule explanation not yet implemented with OpenAI'
            };
        } catch (error: any) {
            throw new Error('Error explaining travel rules: ' + error.message);
        }
    }

    public async summarizeDocuments(documents: any[]): Promise<any> {
        try {
            // Mock implementation - replace with actual OpenAI call if needed
            return {
                summary: 'Document summarization not yet implemented with OpenAI'
            };
        } catch (error: any) {
            throw new Error('Error summarizing documents: ' + error.message);
        }
    }
}

export default new LLMService();