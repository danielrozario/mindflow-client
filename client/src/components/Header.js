import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';
import Profile from "./Profile";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    return (
        <header>
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* <GiHamburgerMenu /> */}
                <h1>MindFlow</h1>
                {isAuthenticated && <Profile />} {/* Display user profile information if authenticated */}
                {/* Login/Logout Button */}
                <Button
                    variant={isAuthenticated ? "outline-primary" : "primary"}
                    onClick={() => isAuthenticated ? logout({ returnTo: window.location.origin }) : loginWithRedirect()}
                >
                    {isAuthenticated ? "Log Out" : "Log In"}
                </Button>
            </nav>
        </header>
    );
};

export default Header;
