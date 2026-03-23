import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Comment } from '../../types';
import { getPostComments, addComment, deleteComment } from '../../services/api';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import './CommentSection.css';

interface CommentSectionProps {
    postId: string;
    onCommentAdded: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, onCommentAdded }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const data = await getPostComments(postId);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            alert('Please log in to comment');
            return;
        }

        if (!newComment.trim()) {
            return;
        }

        setSubmitting(true);

        try {
            await addComment(postId, { content: newComment.trim() });
            setNewComment('');
            await fetchComments();
            onCommentAdded(); // Refresh post to update comment count
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Delete this comment?')) {
            return;
        }

        try {
            await deleteComment(commentId);
            await fetchComments();
            onCommentAdded(); // Refresh post to update comment count
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    if (loading) {
        return <div className="comment-section">Loading comments...</div>;
    }

    return (
        <div className="comment-section">
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">{comment.authorName}</span>
                                <span className="comment-date">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                                {user?.id === comment.userId && (
                                    <button
                                        className="comment-delete-button"
                                        onClick={() => handleDelete(comment.id)}
                                        title="Delete comment"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="comment-content">{comment.content}</div>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="comment-input"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        maxLength={300}
                    />
                    <Button type="submit" size="sm" disabled={submitting || !newComment.trim()}>
                        {submitting ? 'Posting...' : 'Post'}
                    </Button>
                </form>
            ) : (
                <p className="login-prompt">Log in to leave a comment</p>
            )}
        </div>
    );
};

export default CommentSection;
