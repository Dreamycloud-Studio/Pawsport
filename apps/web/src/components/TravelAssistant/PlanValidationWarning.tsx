import React from 'react';
import './PlanValidationWarning.css';

interface PlanValidationWarningProps {
    warnings: string[];
    onRetry?: () => void;
    onDismiss?: () => void;
}

const PlanValidationWarning: React.FC<PlanValidationWarningProps> = ({ warnings, onRetry, onDismiss }) => {
    return (
        <div className="plan-validation-warning">
            <div className="warning-header">
                <span className="warning-icon">⚠️</span>
                <h3>Plan Validation Warning</h3>
            </div>
            <div className="warning-content">
                <p>The generated travel plan has some issues that need attention:</p>
                <ul className="warning-list">
                    {warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                    ))}
                </ul>
                <p className="warning-suggestion">
                    This usually happens when the AI service is experiencing issues. 
                    You can try again or contact support if the problem persists.
                </p>
            </div>
            <div className="warning-actions">
                {onRetry && (
                    <button className="retry-button" onClick={onRetry}>
                        🔄 Try Again
                    </button>
                )}
                {onDismiss && (
                    <button className="dismiss-button" onClick={onDismiss}>
                        Dismiss
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlanValidationWarning;
