import React, { useState } from 'react';
import Calendar from 'react-calendar';
import JournalPageModal from '../components/JournalPageModal';
import { Container, Toast, ToastContainer } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import '../styles/CustomCalendar.css';
import axios from 'axios';
import { BACKEND_URL } from '../config/constants';
import { useAuth0 } from '@auth0/auth0-react';

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

    const { getAccessTokenSilently } = useAuth0();

    const handleOpenModal = async (date) => {
        const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        setSelectedDate(normalizedDate);

        try {
            const token = await getAccessTokenSilently();
            console.log('token is: '    , token);
            const response = await axios.get(`${BACKEND_URL}/api/journalPages`, {
                params: { date: normalizedDate.toISOString() },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.length > 0) {
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

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching journal entry:', error);
            alert('Failed to fetch journal entry. Please try again.');
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSave = async (data) => {
        try {
            const token = await getAccessTokenSilently();
            if (journalId) {
                await axios.put(`${BACKEND_URL}/api/journalPages/${journalId}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${BACKEND_URL}/api/journalPages`, {
                    ...data,
                    date: selectedDate.toISOString()
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setJournalData(data);
            handleCloseModal();
            setShowToast(true);
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
                selectedDate={selectedDate}
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
