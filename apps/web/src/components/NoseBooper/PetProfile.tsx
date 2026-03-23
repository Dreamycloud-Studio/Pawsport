import React from 'react';

interface PetProfileProps {
    name: string;
    breed: string;
    age: number;
    vaccinationStatus: string;
    ownerName: string;
    ownerContact: string;
}

const PetProfile: React.FC<PetProfileProps> = ({ name, breed, age, vaccinationStatus, ownerName, ownerContact }) => {
    return (
        <div className="pet-profile">
            <h2>{name}'s Profile</h2>
            <p><strong>Breed:</strong> {breed}</p>
            <p><strong>Age:</strong> {age} years</p>
            <p><strong>Vaccination Status:</strong> {vaccinationStatus}</p>
            <h3>Owner Information</h3>
            <p><strong>Name:</strong> {ownerName}</p>
            <p><strong>Contact:</strong> {ownerContact}</p>
        </div>
    );
};

export default PetProfile;