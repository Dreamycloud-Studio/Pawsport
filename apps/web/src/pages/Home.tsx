import React from 'react';
import { Hero, Features, CommunityPreview, CallToAction } from '../components/landing';

const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <Features />
            <CommunityPreview />
            <CallToAction />
        </>
    );
};

export default Home;