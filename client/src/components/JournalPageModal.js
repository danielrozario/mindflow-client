import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const JournalPageModal = ({ isOpen, onClose, onSave, initialData = {}, selectedDate }) => {
    const [journalData, setJournalData] = useState(initialData);

    // Use effect to update local state when initialData changes
    useEffect(() => {
        setJournalData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJournalData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(journalData);
    };

    // Format the selected date for display in the modal title
    const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : '';

    return (
        <Modal show={isOpen} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Journal Entry for {formattedDate}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6} className="border-end">
                        <h4>Goals for the Day</h4>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="goalsForTheDay"
                            placeholder="Enter your goals for the day..."
                            value={journalData.goalsForTheDay}
                            onChange={handleChange}
                        />

                        <h4>Reflections</h4>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="reflections"
                            placeholder="Enter your reflections..."
                            value={journalData.reflections}
                            onChange={handleChange}
                        />
                    </Col>

                    <Col md={6}>
                        <h4>I am Grateful For</h4>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="gratitude"
                            placeholder="What are you grateful for today?"
                            value={journalData.gratitude}
                            onChange={handleChange}
                        />

                        <h4>Daily Accomplishments</h4>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="dailyAccomplishments"
                            placeholder="Enter your daily accomplishments..."
                            value={journalData.dailyAccomplishments}
                            onChange={handleChange}
                        />

                        <h4>Freewriting</h4>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="freewriting"
                            placeholder="Write freely..."
                            value={journalData.freewriting}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="danger" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default JournalPageModal;
