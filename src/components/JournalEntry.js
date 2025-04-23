import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import EditJournalEntry from './EditJournalEntry'; // Import edit modal component

const JournalEntry = ({ entry, onUpdate }) => {
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    return (
        <>
            <Card onClick={handleEdit} className="journal-entry-card">
                <Card.Body>{entry.content}</Card.Body>
            </Card>
            <EditJournalEntry show={showEditModal} entry={entry} onHide={() => setShowEditModal(false)} onUpdate={onUpdate}/>
        </>
    );
};

export default JournalEntry;