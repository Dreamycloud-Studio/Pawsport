import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createCommunityPost } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import './CreatePostForm.css';

interface CreatePostFormProps {
    onPostCreated: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [route, setRoute] = useState('');
    const [petTypes, setPetTypes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('You must be logged in to post');
            return;
        }

        if (!content.trim()) {
            setError('Post content cannot be empty');
            return;
        }

        setIsSubmitting(true);

        try {
            await createCommunityPost({
                content: content.trim(),
                route: route.trim() || undefined,
                petTypes: petTypes ? petTypes.split(',').map(t => t.trim()) : undefined
            });

            // Clear form
            setContent('');
            setRoute('');
            setPetTypes('');
            
            // Notify parent to refresh posts
            onPostCreated();
        } catch (err: any) {
            setError(err.message || 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="create-post-form login-prompt">
                <p>Please log in to share your pet travel stories!</p>
            </div>
        );
    }

    return (
        <form className="create-post-form" onSubmit={handleSubmit}>
            <h3>Share Your Story</h3>
            
            <textarea
                className="post-textarea"
                placeholder="What's your pet travel story? Share tips, ask questions, or connect with fellow travelers..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                maxLength={500}
                required
            />
            
            <div className="optional-fields">
                <Input
                    type="text"
                    placeholder="Travel route (e.g., NYC to Paris)"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                />
                
                <Input
                    type="text"
                    placeholder="Pet types (e.g., dog, cat)"
                    value={petTypes}
                    onChange={(e) => setPetTypes(e.target.value)}
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post to Community'}
            </Button>
        </form>
    );
};

export default CreatePostForm;
