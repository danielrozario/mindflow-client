import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';
import Profile from "./Profile";

const Header = () => {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    const handleLogin = async () => {
        await loginWithRedirect({
            connection: 'google-oauth2',
            prompt: 'select_account'
        });
    };


    return (
        <header>
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1>MindFlow</h1>
                {isAuthenticated && <Profile />}
                <Button
                    variant={isAuthenticated ? "outline-primary" : "primary"}
                    onClick={() => isAuthenticated
                        ? logout({
                            returnTo: 'https://accounts.google.com/Logout?continue=' + window.location.origin
                        })
                        : handleLogin()}
                >
                    {isAuthenticated ? "Log Out" : "Log In"}
                </Button>
            </nav>
        </header>
    );
};

export default Header;
