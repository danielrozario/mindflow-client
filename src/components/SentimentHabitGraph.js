import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';  // Import both Bar and Line chart components
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Spinner } from 'react-bootstrap';

// Register the required components from Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const SentimentHabitGraphs = ({ userId, startDate, endDate }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from the correlation API
        axios.get('http://localhost:5000/api/correlation', {
            params: {
                user: userId,
                startDate: startDate,
                endDate: endDate
            }
        })
            .then(response => {
                const data = response.data;
                const dates = data.map(entry => new Date(entry.date).toLocaleDateString());

                // Dynamically extract habit names
                const habits = Object.keys(data[0]?.habitCompleted || {});

                const habitGraphData = habits.map((habit, index) => ({
                    habitName: habit,
                    combinedData: {
                        labels: dates,
                        datasets: [
                            {
                                label: `${habit} Completion`,
                                data: data.map(entry => entry.habitCompleted[habit] ? 1 : 0),  // 1 for completed, 0 for not completed
                                backgroundColor: `rgba(${index * 60}, ${index * 100}, 200, 0.7)`,
                                borderColor: `rgba(${index * 60}, ${index * 100}, 200, 1)`,
                                borderWidth: 1,
                                type: 'bar',
                                yAxisID: 'y',
                            },
                            {
                                label: 'Sentiment Score',
                                data: data.map(entry => entry.sentiment),
                                borderColor: '#36a2eb',
                                backgroundColor: '#36a2eb',
                                fill: false,
                                type: 'line',
                                tension: 0.4,
                                yAxisID: 'y1',  // Use a secondary Y-axis for sentiment scores
                            }
                        ]
                    }
                }));

                setChartData(habitGraphData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching correlation data:', error);
                setLoading(false);
            });
    }, [userId, startDate, endDate]);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Habit Completion and Sentiment Trends</h2>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                chartData && chartData.length > 0 ? (
                    chartData.map((habitGraph, index) => (
                        <div key={index} className="graph-container mb-5">
                            <h3 className="text-center">{habitGraph.habitName}</h3>
                            <div className="canvas-container">
                                <Bar
                                    data={habitGraph.combinedData}
                                    options={{
                                        responsive: true,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                position: 'left',  // Left Y-axis for habit completion
                                                stacked: false,
                                            },
                                            y1: {
                                                beginAtZero: true,
                                                position: 'right',  // Right Y-axis for sentiment score
                                                grid: {
                                                    drawOnChartArea: false,  // Remove gridlines for the secondary Y-axis
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No data available</p>
                )
            )}
        </div>
    );
};

export default SentimentHabitGraphs;
