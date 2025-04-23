import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {/*<img
                    src={user.picture}
                    alt={user.name}
                    style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '10px' }}
                />*/}
                <div>
                    <h2 style={{ margin: 0 }}>{user.name}</h2>
                    <p style={{ margin: 0 }}>{user.email}</p>
                </div>
            </div>
        )
    );
};

export default Profile;
