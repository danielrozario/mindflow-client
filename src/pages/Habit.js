import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
    Table,
    Button,
    Container,
    Row,
    Col,
    Modal,
    Form,
    Toast,
    ToastContainer,
    InputGroup,
} from 'react-bootstrap';
import { BsChevronDown } from 'react-icons/bs';
import {BACKEND_URL} from "../config/constants";

const Habit = ({ userId }) => {
    const [habits, setHabits] = useState([]);
    const [dates, setDates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newHabit, setNewHabit] = useState({ name: '', description: '' });
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [showToast, setShowToast] = useState(false);
    const backurl = BACKEND_URL;

    // Fetch habits from the backend
    const fetchHabits = async () => {
        try {
            const response = await axios.get(`${backurl}api/habits/${userId}`);
            setHabits(response.data);
        } catch (error) {
            console.error('Failed to fetch habits', error);
            alert('Failed to fetch habits. Please try again later.');
        }
    };

    // Create a new habit
    const createHabit = async () => {
        if (newHabit.name.trim() === '') {
            alert('Name is required');
            return;
        }
        try {
            const response = await axios.post(`${backurl}api/habits`, { ...newHabit, userId });
            setHabits([...habits, response.data]);
            handleCloseModal(); // Close the modal and reset the form after creating the habit
        } catch (error) {
            console.error('Failed to create habit', error);
            alert('Failed to create habit. Please try again later.');
        }
    };

    // Close the modal and reset the form
    const handleCloseModal = () => {
        setShowModal(false);
        setNewHabit({ name: '', description: '' }); // Reset the form
    };

    // Update the dates for the selected month
    const updateDates = () => {
        const startOfMonth = moment([selectedYear, selectedMonth]).startOf('month');
        const endOfMonth = moment([selectedYear, selectedMonth]).endOf('month');

        let days = [];
        for (let day = startOfMonth.clone(); day.isSameOrBefore(endOfMonth); day.add(1, 'days')) {
            days.push(day.clone());
        }

        setDates(days);
    };

    useEffect(() => {
        fetchHabits();
    }, [userId]);

    useEffect(() => {
        updateDates();
    }, [selectedMonth, selectedYear]);

    // Handle toggling the habit checkbox
    const handleToggleHabit = async (habitId, date) => {
        const formattedDate = date.toDate(); // Convert moment.js date to JavaScript Date object
        const habit = habits.find((h) => h._id === habitId);
        const isTracked = habit.trackedDays.some((d) => new Date(d.date).getTime() === formattedDate.getTime());

        let updatedTrackedDays;

        if (isTracked) {
            // If the date is already tracked, remove it (toggle off)
            updatedTrackedDays = habit.trackedDays.filter((d) => new Date(d.date).getTime() !== formattedDate.getTime());
        } else {
            // If the date is not tracked, add it (toggle on)
            updatedTrackedDays = [...habit.trackedDays, { date: formattedDate }];
        }

        try {
            const response = await axios.put(`${backurl}api/habits/${habitId}/trackedDays`, {
                trackedDays: updatedTrackedDays,
            });

            // Update the habit in the state with the updated trackedDays from the server response
            setHabits(habits.map((h) => (h._id === habitId ? { ...h, trackedDays: response.data.trackedDays } : h)));
            setShowToast(true); // Show toast on habit update
        } catch (error) {
            console.error('Failed to update habit', error.response || error.message);
            alert(`Failed to update habit: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    return (
        <Container fluid style={{ maxWidth: '1600px' }}> {/* Increased container width to 1600px */}
            <Row>
                <Col>
                    <h2 className="my-3">Habit Tracker</h2>
                    <Form className="mb-3 d-flex justify-content-center align-items-center">
                        <InputGroup className="mr-3">
                            <Form.Control
                                as="select"
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                className="ml-2"
                                style={{ width: '150px' }}
                            >
                                {moment.months().map((month, index) => (
                                    <option key={index} value={index}>
                                        {month}
                                    </option>
                                ))}
                            </Form.Control>
                            <InputGroup.Text>
                                <BsChevronDown />
                            </InputGroup.Text>
                        </InputGroup>

                        <InputGroup className="ml-3">
                            <Form.Control
                                as="select"
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="ml-2"
                                style={{ width: '100px' }}
                            >
                                {[...Array(10)].map((_, index) => (
                                    <option key={index} value={moment().year() - 5 + index}>
                                        {moment().year() - 5 + index}
                                    </option>
                                ))}
                            </Form.Control>
                            <InputGroup.Text>
                                <BsChevronDown />
                            </InputGroup.Text>
                        </InputGroup>
                    </Form>
                    <Table bordered responsive style={{ tableLayout: 'fixed' }}> {/* Use fixed table layout */}
                        <thead>
                        <tr>
                            <th style={{ width: '120px', whiteSpace: 'normal', textAlign: 'center', fontSize: '0.9em' }}>Habits</th>
                            {dates.map((date, index) => (
                                <th key={index}>{date.format('ddd')}</th>
                            ))}
                        </tr>
                        <tr>
                            <th></th>
                            {dates.map((date, index) => (
                                <th key={index}>{date.format('D')}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {habits.map((habit) => (
                            <tr key={habit._id}>
                                <td>{habit.name}</td>
                                {dates.map((date, index) => (
                                    <td key={index} className="text-center">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleToggleHabit(habit._id, date)}
                                            checked={
                                                habit.trackedDays?.some(
                                                    (d) =>
                                                        new Date(d.date).getTime() === date.toDate().getTime()
                                                ) || false
                                            }
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        + New Habit
                    </Button>

                    {/* Modal for creating a new habit */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create New Habit</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formHabitName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter habit name"
                                        value={newHabit.name}
                                        onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formHabitDescription" className="mt-3">
                                    <Form.Label>Description (optional)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter habit description"
                                        value={newHabit.description}
                                        onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={createHabit}>
                                Save Habit
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Toast for habit update */}
                    <ToastContainer position="top-center">
                        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                            <Toast.Body>Habit updated successfully!</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </Col>
            </Row>
        </Container>

    );
};

export default Habit;
