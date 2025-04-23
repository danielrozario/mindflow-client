import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';

const Home = () => {
    const { user, loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        <div className="container text-center mt-5">
            {isAuthenticated ? (
                <div>
                    <h1 className="display-4">Welcome Back {user.name}, to Your Wellness Dashboard</h1>
                    <p className="lead mt-3">
                        Check your latest journal entries, track your habits, and stay on your wellness journey.
                    </p>
                </div>
            ) : (
                <div>
                    <h1 className="display-4">Embark on Your Wellness Journey Today</h1>
                    <p className="lead mt-3">
                        Track your habits, reflect on your day, and cultivate positivity. MindFlow is here to help you grow, one journal entry at a time.
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        className="mt-4"
                        onClick={loginWithRedirect}
                    >
                        Get Started Now
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Home;
