import React from 'react';
import CommunityFeed from '../components/NoseBooper/CommunityFeed';
import MatchingModule from '../components/NoseBooper/MatchingModule';
import './Community.css';

const Community: React.FC = () => {
    return (
        <div className="community-page">
            <div className="community-header">
                <h1>🐾 Pawsport Community</h1>
                <p>Connect with fellow pet travelers and share your journey</p>
            </div>
            <div className="community-content">
                <CommunityFeed />
                <MatchingModule />
            </div>
        </div>
    );
};

export default Community;