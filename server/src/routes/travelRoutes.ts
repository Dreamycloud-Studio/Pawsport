import { Router } from 'express';
import travelController from '../controllers/travelController';

const router = Router();

// Route to get personalized travel checklist
router.post('/checklist', travelController.getTravelChecklist.bind(travelController));

// Route to get regulation summary
router.get('/regulations/:country', travelController.getRegulationSummary.bind(travelController));

// Route for LLM-powered regulation Q&A
router.post('/regulations/query', travelController.queryRegulations.bind(travelController));

// Route to get document explanation
router.post('/documents', travelController.explainDocuments.bind(travelController));

export default router;