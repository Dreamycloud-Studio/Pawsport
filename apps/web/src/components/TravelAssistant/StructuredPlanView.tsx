import React, { useState } from 'react';
import { StructuredTravelPlan } from '../../types';
import Timeline from './Timeline';
import Checklist from './Checklist';
import PlanValidationWarning from './PlanValidationWarning';
import './StructuredPlanView.css';

interface StructuredPlanViewProps {
    plan: StructuredTravelPlan;
    warnings?: string[];
    onRetry?: () => void;
}

const StructuredPlanView: React.FC<StructuredPlanViewProps> = ({ plan, warnings, onRetry }) => {
    const [localPlan, setLocalPlan] = useState(plan);

    const handleTimelineTaskToggle = (timelineId: string, taskId: string) => {
        setLocalPlan(prev => ({
            ...prev,
            timeline: prev.timeline.map(item =>
                item.id === timelineId
                    ? {
                        ...item,
                        tasks: item.tasks.map(task =>
                            task.id === taskId
                                ? { ...task, completed: !task.completed }
                                : task
                        )
                    }
                    : item
            )
        }));
    };

    const handleChecklistTaskToggle = (taskId: string) => {
        setLocalPlan(prev => ({
            ...prev,
            checklist: prev.checklist.map(task =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        }));
    };

    return (
        <div className="structured-plan-view">
            <div className="plan-header">
                <h1>🐾 Your Personalized Travel Plan</h1>
                <div className="plan-details">
                    <div className="detail-item">
                        <span className="detail-label">From:</span>
                        <span className="detail-value">{localPlan.origin}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">To:</span>
                        <span className="detail-value">{localPlan.destination}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Pet:</span>
                        <span className="detail-value">{localPlan.species} ({localPlan.breed})</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Travel Date:</span>
                        <span className="detail-value">
                            {new Date(localPlan.travelDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {warnings && warnings.length > 0 && (
                <PlanValidationWarning warnings={warnings} onRetry={onRetry} />
            )}

            {localPlan.criticalAlerts && localPlan.criticalAlerts.length > 0 && (
                <div className="critical-alerts">
                    <h3>🚨 Critical Alerts</h3>
                    <ul>
                        {localPlan.criticalAlerts.map((alert, index) => (
                            <li key={index}>{alert}</li>
                        ))}
                    </ul>
                </div>
            )}

            {localPlan.regulationSummary && (
                <div className="regulation-summary">
                    <h3>📋 Regulation Summary</h3>
                    <p>{localPlan.regulationSummary}</p>
                </div>
            )}

            <Timeline 
                timeline={localPlan.timeline} 
                onTaskToggle={handleTimelineTaskToggle}
            />

            <Checklist 
                checklist={localPlan.checklist} 
                onTaskToggle={handleChecklistTaskToggle}
            />
        </div>
    );
};

export default StructuredPlanView;
