import React from 'react';
import HabitCard from './HabitCard';

function HabitList({ habits }) {
    return (
        <ul>
            {habits.map(habit => (
                <HabitCard key={habit._id} habit={habit} />
            ))}
        </ul>
    );
}

export default HabitList;