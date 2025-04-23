import React, {useContext} from 'react';
import SentimentHabitGraph from '../components/SentimentHabitGraph';

import { UserContext } from '../context/UserContext.js';

const Dashboard = () => {
    const { userId } = useContext(UserContext);

    const currentDate = new Date();

    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];

    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

    return (
        <div>
            <h1>Analysis Dashboard</h1>
            <SentimentHabitGraph userId={userId} startDate={startDate} endDate={endDate} />
        </div>
    );
};

export default Dashboard;
