import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0, Auth0Provider } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Journal from './pages/Journal';
import Habit from './pages/Habit';
import Dashboard from './pages/Dashboard';

import { UserContext } from './context/UserContext';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, BACKEND_URL } from './config/constants';

const AppContent = () => {
    const { handleRedirectCallback, isLoading, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();
                    const res = await axios.get(`${BACKEND_URL}/api/users?email=${user.email}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });
                    setUserId(res.data.user._id);
                } catch (err) {
                    console.error('Failed to fetch user ID:', err);
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
                } catch (err) {
                    console.error('Auth callback error:', err);
                }
            }
        };
        handleAuthCallback();
    }, [handleRedirectCallback]);

    return (
        <UserContext.Provider value={{ userId }}>
            <div className="App">
                <Header />
                <Router>
                    <Container fluid>
                        {isAuthenticated && <Navbar />}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/journal" element={<Journal />} />
                            <Route path="/habit" element={<Habit userId={userId} />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </Container>
                </Router>
                <Footer />
            </div>
        </UserContext.Provider>
    );
};

const App = () => (
    <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        redirectUri={window.location.origin}
        audience="https://dev-8cb3f0uzw42y7hg8.uk.auth0.com/api/v2/"
    >
        <AppContent />
    </Auth0Provider>
);

export default App;
