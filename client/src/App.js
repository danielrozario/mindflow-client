import './App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Habit from './pages/Habit';

import Dashboard from './pages/Dashboard';
import { GiHamburgerMenu } from 'react-icons/gi';
import axios from "axios";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JournalEntries from './pages/JournalEntries';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { UserContext } from './context/UserContext';

import { useAuth0,Auth0Provider } from '@auth0/auth0-react';

//For the Auth0 implementation
const domain = "dev-8cb3f0uzw42y7hg8.uk.auth0.com";
const clientId = "TyCIiD8z9O2ChGzk7hhbmfa6hKO7AO5X";
const redirectUri = "http://localhost:3000/journal";
const AppContent = () => {
    const { handleRedirectCallback, isLoading, user, isAuthenticated, getAccessTokenSilently, error } = useAuth0();
    const [userId, setUserId] = useState(null);
    const url = "http://18.175.157.162:5000";

    useEffect(() => {
        const fetchUserId = async () => {
            if (isAuthenticated && user) {
                try {
                    console.log('check user' +user.email)
                    console.log('authentic: '+isAuthenticated)
                    const token = await getAccessTokenSilently();
                    const response = await axios.get(`${url}/api/users?email=${user.email}`, {
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log('bruh ' +response.data)
                    setUserId(response.data.user._id); // Set the MongoDB user ID
                } catch (error) {
                    console.error('Error fetching user ID:', error);
                }
            }
        };
        fetchUserId();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    useEffect(() => {
        const handleAuthCallback = async () => {
            if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
                try {
                    await handleRedirectCallback();
                    console.log("Redirect callback handled successfully.");
                } catch (error) {
                    console.error("Error handling redirect callback:", error);
                }
            }
        };
        handleAuthCallback();
    }, [handleRedirectCallback]);
    useEffect(() => {
        if (userId) {
            console.log('User ID is now set:', userId); // Log the user ID once it's set
        }
    }, [userId]); // This useEffect runs every time userId changes



    if (!isAuthenticated) {console.log('not auth')}

    return (
        <UserContext.Provider value={{ userId }}>
            <div className="App">
                <Header />
                <Router>
                    <Container fluid>
                        {isAuthenticated && <Navbar />} {/* Render Navbar only if user is logged in */}
                    </Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/journal" element={<Journal />} />
                      {/*  <Route path="/journalentries" element={<JournalEntries />} />*/}
                        <Route path="/habit" element={<Habit userId={userId} />} />

                        <Route path="/dashboard" element={<Dashboard  />} />
                    </Routes>
                </Router>
                <Footer />
            </div>
        </UserContext.Provider>
    );
};

function App() {
    return (
        <Auth0Provider
            domain="dev-8cb3f0uzw42y7hg8.uk.auth0.com"
            clientId="TyCIiD8z9O2ChGzk7hhbmfa6hKO7AO5X"
            redirectUri={window.location.origin}
        >
            <AppContent />
        </Auth0Provider>
    );
}

export default App;