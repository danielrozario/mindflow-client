import React, { useState } from 'react';
import Calendar from 'react-calendar';

function HabitTracker() {
    const [value, setValue] = useState(new Date());
    const [view, setView] = useState('month');

    const handleViewChange = () => {
        setView(view === 'month' ? 'week' : 'month');
    };

    return (
        <div>
            <div>
                <button onClick={handleViewChange}>
                    {view === 'month' ? 'Week View' : 'Month View'}
                </button>
            </div>
            <Calendar value={value} onChange={setValue} view={view} />
            {/* Your habit tracking components */}
        </div>
    );
}

export default HabitTracker;