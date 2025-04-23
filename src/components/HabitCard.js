import React from 'react';

function HabitCard({ habit }) {
    return (
        <li>
            {habit.name}
            {/* Add more details or actions here */}
        </li>
    );
}

export default HabitCard;