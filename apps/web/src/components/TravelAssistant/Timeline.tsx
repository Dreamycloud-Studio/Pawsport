import React from 'react';
import { TimelineItem as TimelineItemType } from '../../types';
import './Timeline.css';

interface TimelineProps {
    timeline: TimelineItemType[];
    onTaskToggle?: (timelineId: string, taskId: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ timeline, onTaskToggle }) => {
    const getCategoryIcon = (category: string): string => {
        switch (category) {
            case 'veterinary': return '🏥';
            case 'documentation': return '📄';
            case 'booking': return '✈️';
            case 'preparation': return '📦';
            default: return '📋';
        }
    };

    const getCategoryColor = (category: string): string => {
        switch (category) {
            case 'veterinary': return '#e74c3c';
            case 'documentation': return '#3498db';
            case 'booking': return '#9b59b6';
            case 'preparation': return '#2ecc71';
            default: return '#95a5a6';
        }
    };

    const sortedTimeline = [...timeline].sort((a, b) => b.daysBeforeTravel - a.daysBeforeTravel);

    return (
        <div className="timeline-container">
            <h2 className="timeline-title">📅 Travel Preparation Timeline</h2>
            <div className="timeline">
                {sortedTimeline.map((item, index) => (
                    <div key={item.id} className="timeline-item" style={{ '--category-color': getCategoryColor(item.category) } as React.CSSProperties}>
                        <div className="timeline-marker">
                            <span className="timeline-icon">{getCategoryIcon(item.category)}</span>
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-header">
                                <h3>{item.title}</h3>
                                <span className="timeline-date">
                                    {item.daysBeforeTravel} days before travel
                                </span>
                            </div>
                            <div className="timeline-tasks">
                                {item.tasks.map(task => (
                                    <div key={task.id} className="timeline-task">
                                        <label className="task-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => onTaskToggle?.(item.id, task.id)}
                                            />
                                            <span className={task.completed ? 'completed' : ''}>
                                                <strong>{task.title}</strong>
                                                {task.description && <p>{task.description}</p>}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
