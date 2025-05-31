import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import JournalEntry from '../components/JournalEntry.js';

import { Container, Row, Col } from 'react-bootstrap';
import {BACKEND_URL} from "../config/constants";

//removed userId prop in JournalEntries
const JournalEntries = ({  }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('inside JournalEntries Page');
    const { userId } = useContext(UserContext);
   const backurl = BACKEND_URL+"/api/simplejournalpages/user/" + userId;

    // Define fetchEntries function outside useEffect
    const fetchEntries = async () => {
        try {
            const response = await axios.get(backurl);
            setEntries(response.data);
            console.log(`returned data: ${entries}`);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [userId]); // Run fetchEntries only when userId changes

    // Define handleUpdate function
    const handleUpdate = () => {
        // Trigger a re-fetch of journal entries
        fetchEntries();
    };

    return (
        <Container>
            <Row xs={1} md={2} lg={3} className="g-4">
                {entries.map((entry) => (
                    <Col key={entry._id}>
                        <JournalEntry key={entry._id} entry={entry} onUpdate={handleUpdate} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default JournalEntries;