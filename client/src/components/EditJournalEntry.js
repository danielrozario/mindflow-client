import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditJournalEntry = ({ show, entry, onHide, onUpdate }) => {
    const [editedEntry, setEditedEntry] = useState(entry.content);


    const backurl = 'http://18.175.157.162:5000/api/simplejournalpages/';
    const handleSubmit = async () => {
        try {
            const response = await axios.put(backurl+entry._id, { content: editedEntry });
            console.log(response.data);
            onHide();
            onUpdate(); // Call the onUpdate function to trigger a re-fetch

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Journal Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control as="textarea" rows={3} value={editedEntry} onChange={(e) => setEditedEntry(e.target.value)} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditJournalEntry;