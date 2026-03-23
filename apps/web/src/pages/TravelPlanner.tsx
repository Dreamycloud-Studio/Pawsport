import React from 'react';
import AITravelChat from '../components/TravelAssistant/AITravelChat';
import './TravelPlanner.css';

const TravelPlanner: React.FC = () => {
    return (
        <div className="travel-planner-page">
            <div className="travel-planner-header">
                <h1>✈️ AI Travel Assistant</h1>
                <p>Get personalized help preparing your pet's travel documents</p>
            </div>
            
            <div className="travel-planner-content">
                <div className="planner-layout">
                    <div className="chat-section">
                        <AITravelChat />
                    </div>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">✓</div>
                        <h3>Smart Checklists</h3>
                        <p>Get AI-generated, personalized checklists based on your destination and pet type</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📋</div>
                        <h3>Regulations Guide</h3>
                        <p>Understand complex travel regulations explained in simple terms</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📄</div>
                        <h3>Document Help</h3>
                        <p>Get help understanding and preparing all required travel documents</p>
                    </div>
                </div>

                <div className="info-section">
                    <h2>How It Works</h2>
                    <p>
                        Our AI assistant uses the latest pet travel regulations to provide you with accurate, 
                        up-to-date information. Simply chat with the assistant about your travel plans, and 
                        it will guide you through every step of the preparation process, from vaccinations 
                        to paperwork to booking pet-friendly travel options.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TravelPlanner;