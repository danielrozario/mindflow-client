import React, { useState } from 'react';
import { Navbar, Container, Nav,  Button } from 'react-bootstrap';
import { NavbarData } from './NavbarData';
import {Link} from'react-router-dom'
const MyNavbar = () => {
    const [showNav, setShowNav] = useState(false);

    const toggleNav = () => {
        setShowNav(!showNav);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
                {/*<Navbar.Brand href="/">Your Logo</Navbar.Brand>*/}
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNav} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {NavbarData.map((item, index) => (
                            <Nav.Link key={index} as={Link} to={item.link}>
                                {item.title}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;