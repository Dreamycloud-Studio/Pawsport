import React from 'react';
import {
  Hero,
  Destinations,
  Features,
  AISample,
  Stories,
  CommunityPreview,
  CallToAction,
} from '../components/landing';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Destinations />
      <Features />
      <AISample />
      <Stories />
      <CommunityPreview />
      <CallToAction />
    </>
  );
};

export default Home;
