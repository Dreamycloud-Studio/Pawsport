import React from 'react';

interface DocumentExplainerProps {
    documentType: string;
    explanation: string;
}

const DocumentExplainer: React.FC<DocumentExplainerProps> = ({ documentType, explanation }) => {
    return (
        <div className="document-explainer">
            <h2>Understanding Your {documentType}</h2>
            <p>{explanation}</p>
        </div>
    );
};

export default DocumentExplainer;