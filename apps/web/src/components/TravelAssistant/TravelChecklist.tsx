import React, { useState } from 'react';

const TravelChecklist: React.FC = () => {
    const [checklistItems, setChecklistItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState<string>('');

    const handleAddItem = () => {
        if (newItem.trim()) {
            setChecklistItems([...checklistItems, newItem]);
            setNewItem('');
        }
    };

    const handleRemoveItem = (index: number) => {
        const updatedChecklist = checklistItems.filter((_, i) => i !== index);
        setChecklistItems(updatedChecklist);
    };

    return (
        <div>
            <h2>Personalized Travel Checklist</h2>
            <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add a checklist item"
            />
            <button onClick={handleAddItem}>Add</button>
            <ul>
                {checklistItems.map((item, index) => (
                    <li key={index}>
                        {item}
                        <button onClick={() => handleRemoveItem(index)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TravelChecklist;