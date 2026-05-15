import { Request, Response } from 'express';
import { RegulationService } from '../services/regulationService';
import { LLMService } from '../services/llmService';

class TravelController {
    private regulationService: RegulationService;
    private llmService: LLMService;

    constructor() {
        this.regulationService = new RegulationService();
        this.llmService = new LLMService();
    }

    public async getTravelChecklist(req: Request, res: Response): Promise<void> {
        try {
            console.log('=== Travel Checklist Request ===');
            console.log('Body:', req.body);
            console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
            
            const { origin, destination, species, breed, vaccinationStatus, travelDate } = req.body;
            
            const result = await this.llmService.getTravelChecklist({ 
                origin, 
                destination, 
                species, 
                breed, 
                vaccinationStatus,
                travelDate 
            });
            
            console.log('Result valid:', result.valid);
            console.log('Warnings:', result.warnings);
            
            if (result.valid && result.plan) {
                res.status(200).json({
                    success: true,
                    plan: result.plan
                });
            } else {
                res.status(200).json({
                    success: false,
                    warnings: result.warnings,
                    message: 'Failed to generate a valid travel plan. Please try again or contact support.'
                });
            }
        } catch (error: any) {
            console.error('=== Travel Checklist Error ===');
            console.error('Error:', error);
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
            
            res.status(500).json({ 
                success: false,
                message: 'Error generating travel checklist', 
                error: error.message 
            });
        }
    }

    public async getRegulationSummary(req: Request, res: Response): Promise<void> {
        try {
            const { country } = req.params;
            const summary = this.regulationService.getRegulationSummary(country);
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching regulation summary', error });
        }
    }

    public async queryRegulations(req: Request, res: Response): Promise<void> {
        try {
            const { question, destinationCountry, petType } = req.body;
            if (!question || !destinationCountry || !petType) {
                res.status(400).json({ message: 'question, destinationCountry, and petType are required' });
                return;
            }
            const result = await this.llmService.queryRegulations(question, destinationCountry, petType);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Error querying regulations', error: error.message });
        }
    }

    public async explainDocuments(req: Request, res: Response): Promise<void> {
        try {
            const { documents } = req.body;
            const explanations = await this.llmService.explainDocuments(documents);
            res.status(200).json(explanations);
        } catch (error) {
            res.status(500).json({ message: 'Error explaining documents', error });
        }
    }
}

export default new TravelController();