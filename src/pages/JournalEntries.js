import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JournalEntry from '../components/JournalEntry';
import { Container, Row, Col } from 'react-bootstrap';
import { BACKEND_URL } from "../config/constants";
import { useAuth0 } from '@auth0/auth0-react';

const JournalEntries = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getAccessTokenSilently } = useAuth0();

    const fetchEntries = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`${BACKEND_URL}/api/simplejournalpages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEntries(response.data);
        } catch (err) {
            setError(err);
            console.error("Error fetching entries:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleUpdate = () => {
        fetchEntries(); // Re-fetch when an entry is updated
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Failed to load entries.</p>;

    return (
        <Container>
            <Row xs={1} md={2} lg={3} className="g-4">
                {entries.map((entry) => (
                    <Col key={entry._id}>
                        <JournalEntry entry={entry} onUpdate={handleUpdate} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default JournalEntries;
