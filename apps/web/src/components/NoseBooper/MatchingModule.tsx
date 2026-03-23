import React, { useEffect, useState } from 'react';
import { getMatchingPetOwners } from '../../services/api';
import './MatchingModule.css';

const MatchingModule: React.FC = () => {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await getMatchingPetOwners();
                setMatches(response.data);
            } catch (err) {
                setError('Failed to fetch matches. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="matching-module">
            <h2>Find Your Pet Friends</h2>
            {matches.length === 0 ? (
                <p>No matches found. Try adjusting your travel route.</p>
            ) : (
                <ul>
                    {matches.map((match) => (
                        <li key={match.id}>
                            <h3>{match.ownerName}</h3>
                            <p>Location: {match.location}</p>
                            <p>Travel Route: {match.travelRoute}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MatchingModule;