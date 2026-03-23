import React from 'react';

interface RegulationSummaryProps {
  regulations: Array<{
    title: string;
    description: string;
    steps: string[];
  }>;
}

const RegulationSummary: React.FC<RegulationSummaryProps> = ({ regulations }) => {
  return (
    <div className="regulation-summary">
      <h2>Travel Regulation Summary</h2>
      {regulations.length === 0 ? (
        <p>No regulations available for this route.</p>
      ) : (
        regulations.map((regulation, index) => (
          <div key={index} className="regulation">
            <h3>{regulation.title}</h3>
            <p>{regulation.description}</p>
            <h4>Actionable Steps:</h4>
            <ul>
              {regulation.steps.map((step, stepIndex) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default RegulationSummary;