import React, { useState, useContext } from 'react';
import Calendar from 'react-calendar';
import JournalPageModal from '../components/JournalPageModal';
import { Container, Toast, ToastContainer } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import '../styles/CustomCalendar.css'; // Import your custom CSS for the hover effect
import axios from 'axios';
import { UserContext } from '../context/UserContext.js';
import '../styles/CustomCalendar.css';
import {BACKEND_URL} from "../config/constants";


const JournalPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [journalData, setJournalData] = useState({
        goalsForTheDay: '',
        reflections: '',
        gratitude: '',
        dailyAccomplishments: '',
        freewriting: '',
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [journalId, setJournalId] = useState(null);

    const backurl = BACKEND_URL;
    const { userId } = useContext(UserContext);

    const handleOpenModal = async (date) => {
        // Normalize the date to the start of the day in UTC
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        setSelectedDate(normalizedDate); // Set the normalized date

        try {
            const response = await axios.get(`${backurl}/api/journalPages?date=${normalizedDate.toISOString()}&user=${userId}`);
            console.log('API response data:', response.data);

            if (response.data && response.data.length > 0) {
                setJournalData(response.data[0]);
                setJournalId(response.data[0]._id);
            } else {
                setJournalData({
                    goalsForTheDay: '',
                    reflections: '',
                    gratitude: '',
                    dailyAccomplishments: '',
                    freewriting: '',
                });
                setJournalId(null);
            }

            console.log('Data sent to modal:', journalData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching journal entry:', error);
            alert('Failed to fetch journal entry. Please try again.');
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSave = async (data) => {
        try {
            if (journalId) {
                await axios.put(`${backurl}/api/journalPages/${journalId}`, { ...data, user: userId });
                console.log('Journal entry updated:', data);
            } else {
                await axios.post(`${backurl}/api/journalPages`, { ...data, date: selectedDate.toISOString(), user: userId });
                console.log('Journal entry created:', data);
            }
            setJournalData(data);
            handleCloseModal();
            setShowToast(true); // Show toast after saving
        } catch (error) {
            console.error('Error saving journal entry:', error);
            alert('Failed to save journal entry. Please try again.');
        }
    };

    return (
        <Container className="my-4 text-center">
            <h2 className="display-6 mb-4">Your Journal</h2>
            <p className="lead">Click a date on the calendar to create or edit a journal entry for that day.</p>
            <div className="d-flex justify-content-center mt-4 mb-5 bg-light p-4 rounded shadow">
                <Calendar className="shadow p-3" onClickDay={handleOpenModal} value={selectedDate} />
            </div>
            <JournalPageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                initialData={journalData}
                selectedDate={selectedDate} // Pass the selected date to the modal
            />
            <ToastContainer position="top-center">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Body>Journal entry saved successfully!</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default JournalPage;
