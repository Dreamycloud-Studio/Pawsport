import React from 'react';
import { ChecklistTask } from '../../types';
import './Checklist.css';

interface ChecklistProps {
    checklist: ChecklistTask[];
    onTaskToggle?: (taskId: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ checklist, onTaskToggle }) => {
    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case 'high': return '#e74c3c';
            case 'medium': return '#f39c12';
            case 'low': return '#2ecc71';
            default: return '#95a5a6';
        }
    };

    const getCategoryIcon = (category: string): string => {
        switch (category) {
            case 'veterinary': return '🏥';
            case 'documentation': return '📄';
            case 'booking': return '✈️';
            case 'preparation': return '📦';
            default: return '📋';
        }
    };

    const groupedChecklist = checklist.reduce((acc, task) => {
        if (!acc[task.category]) {
            acc[task.category] = [];
        }
        acc[task.category].push(task);
        return acc;
    }, {} as Record<string, ChecklistTask[]>);

    const categoryOrder = ['veterinary', 'documentation', 'booking', 'preparation'];
    const sortedCategories = categoryOrder.filter(cat => groupedChecklist[cat]);

    const completedCount = checklist.filter(t => t.completed).length;
    const totalCount = checklist.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="checklist-container">
            <div className="checklist-header">
                <h2>✓ Travel Checklist</h2>
                <div className="progress-summary">
                    <span className="progress-text">{completedCount} of {totalCount} completed</span>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            </div>

            {sortedCategories.map(category => (
                <div key={category} className="checklist-category">
                    <h3 className="category-title">
                        <span className="category-icon">{getCategoryIcon(category)}</span>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <div className="checklist-items">
                        {groupedChecklist[category]
                            .sort((a, b) => {
                                const priorityOrder = { high: 0, medium: 1, low: 2 };
                                return priorityOrder[a.priority] - priorityOrder[b.priority];
                            })
                            .map(task => (
                                <div key={task.id} className={`checklist-item ${task.completed ? 'completed' : ''}`}>
                                    <label className="checklist-label">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => onTaskToggle?.(task.id)}
                                        />
                                        <div className="task-content">
                                            <div className="task-header">
                                                <span className="task-title">{task.title}</span>
                                                <span 
                                                    className="priority-badge" 
                                                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <p className="task-description">{task.description}</p>
                                            {task.estimatedDuration && (
                                                <span className="task-duration">⏱️ {task.estimatedDuration}</span>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Checklist;
