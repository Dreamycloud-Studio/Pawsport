import React, { useState, useRef, useEffect } from 'react';
import { StructuredTravelPlan } from '../../types';
import StructuredPlanView from './StructuredPlanView';
import PlanValidationWarning from './PlanValidationWarning';
import './AITravelChat.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface QuickAction {
    label: string;
    prompt: string;
    icon: string;
}

const AITravelChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your AI travel assistant. I can help you with:\n\n• Creating personalized travel checklists\n• Understanding pet travel regulations\n• Explaining veterinary documents\n• Preparing required paperwork\n\nHow can I assist you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [structuredPlan, setStructuredPlan] = useState<StructuredTravelPlan | null>(null);
    const [planWarnings, setPlanWarnings] = useState<string[] | null>(null);
    const [showPlanError, setShowPlanError] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickActions: QuickAction[] = [
        { label: 'Travel Checklist', prompt: 'Create a travel checklist for my dog from New York to London', icon: '✓' },
        { label: 'Regulations', prompt: 'What are the travel regulations I need to know?', icon: '📋' },
        { label: 'Documents', prompt: 'Explain the required documents for pet travel', icon: '📄' },
        { label: 'Timeline', prompt: 'What\'s the preparation timeline for pet travel?', icon: '⏰' }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateStructuredPlan = async (userInput: string) => {
        try {
            const response = await fetch('/api/travel/checklist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: 'New York',
                    destination: 'London',
                    species: 'dog',
                    breed: 'Labrador',
                    vaccinationStatus: 'up-to-date',
                    travelDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate travel plan');
            }

            const data = await response.json();
            
            if (data.success && data.plan) {
                setStructuredPlan(data.plan);
                setPlanWarnings(null);
                setShowPlanError(false);
                return true;
            } else {
                setPlanWarnings(data.warnings || ['Unknown error occurred']);
                setShowPlanError(true);
                return false;
            }
        } catch (error) {
            console.error('Error generating plan:', error);
            setPlanWarnings(['Failed to connect to the AI service. Please try again.']);
            setShowPlanError(true);
            return false;
        }
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Check if this is a checklist/plan request
        const isPlanRequest = text.toLowerCase().includes('checklist') || 
                              text.toLowerCase().includes('plan') ||
                              text.toLowerCase().includes('timeline');

        if (isPlanRequest) {
            const success = await generateStructuredPlan(text);
            
            if (success) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: '✅ I\'ve generated a personalized travel plan for you! Check out the timeline and checklist below.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: '❌ I encountered some issues generating your plan. Please see the warnings below and try again.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            }
            setIsLoading(false);
            return;
        }

        try {
            const apiMessages = [...messages, userMessage].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message || 'Sorry, I could not generate a response.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleQuickAction = (prompt: string) => {
        setInput(prompt);
        setTimeout(() => sendMessage(prompt), 0);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const handleRetry = () => {
        setShowPlanError(false);
        setPlanWarnings(null);
        sendMessage('Create a travel checklist for my pet');
    };

    if (structuredPlan) {
        return (
            <div className="ai-travel-chat-container">
                <StructuredPlanView 
                    plan={structuredPlan} 
                    warnings={planWarnings || undefined}
                    onRetry={handleRetry}
                />
                <button 
                    className="back-to-chat-button"
                    onClick={() => {
                        setStructuredPlan(null);
                        setPlanWarnings(null);
                        setShowPlanError(false);
                    }}
                >
                    ← Back to Chat
                </button>
            </div>
        );
    }

    return (
        <div className="ai-travel-chat">
            <div className="chat-header">
                <div className="chat-header-content">
                    <div className="ai-avatar">🤖</div>
                    <div className="chat-header-text">
                        <h3>AI Travel Assistant</h3>
                        <span className="status-indicator">● Online</span>
                    </div>
                </div>
            </div>

            {showPlanError && planWarnings && (
                <PlanValidationWarning 
                    warnings={planWarnings} 
                    onRetry={handleRetry}
                    onDismiss={() => setShowPlanError(false)}
                />
            )}

            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.role === 'user' ? 'user' : 'ai'}`}>
                        <div className="message-content">
                            <div className="message-text">{message.content}</div>
                            <div className="message-time">
                                {message.timestamp.toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="message ai">
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="quick-actions">
                {quickActions.map((action, index) => (
                    <button
                        key={index}
                        className="quick-action-btn"
                        onClick={() => handleQuickAction(action.prompt)}
                        disabled={isLoading}
                    >
                        <span className="action-icon">{action.icon}</span>
                        {action.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="chat-input-container">
                <div className="chat-input-wrapper">
                    <textarea
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about pet travel..."
                        rows={1}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        className="send-button"
                        disabled={!input.trim() || isLoading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AITravelChat;
