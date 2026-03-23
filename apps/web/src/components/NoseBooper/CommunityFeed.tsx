import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CommunityPost } from '../../types';
import { getCommunityPosts, likePost, unlikePost, deleteCommunityPost } from '../../services/api';
import { Heart, Trash2, MessageCircle } from 'lucide-react';
import CreatePostForm from './CreatePostForm';
import CommentSection from './CommentSection';
import './CommunityFeed.css';

const CommunityFeed: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = React.useState<CommunityPost[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            const data = await getCommunityPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching community posts:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId: string, isLiked: boolean) => {
        if (!user) {
            alert('Please log in to like posts');
            return;
        }

        try {
            if (isLiked) {
                await unlikePost(postId);
            } else {
                await likePost(postId);
            }
            // Refresh posts to show updated like count
            await fetchPosts();
        } catch (error: any) {
            console.error('Error toggling like:', error);
            alert(error.message || 'Failed to update like');
        }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await deleteCommunityPost(postId);
            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const toggleComments = (postId: string) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    if (loading) {
        return (
            <div className="community-feed">
                <h2>Community Feed</h2>
                <p className="no-posts-message">Loading posts...</p>
            </div>
        );
    }

    return (
        <div className="community-feed">
            <h2>Community Feed</h2>
            
            <CreatePostForm onPostCreated={fetchPosts} />

            {posts.length === 0 ? (
                <div className="no-posts-message">
                    <p>No posts available. Be the first to share!</p>
                </div>
            ) : (
                <div className="posts-gallery">
                    {posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <span className="post-author">{post.authorName}</span>
                                {user?.id === post.userId && (
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(post.id)}
                                        title="Delete post"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            
                            <div className="post-content">{post.content}</div>
                            
                            {post.route && (
                                <div className="post-route">📍 {post.route}</div>
                            )}
                            
                            {post.petTypes && post.petTypes.length > 0 && (
                                <div className="post-pet-types">
                                    {post.petTypes.map(type => (
                                        <span key={type} className="pet-tag">{type}</span>
                                    ))}
                                </div>
                            )}
                            
                            <div className="post-footer">
                                <div className="post-actions">
                                    <button
                                        className={`action-button like-button ${post.isLikedByUser ? 'liked' : ''}`}
                                        onClick={() => handleLike(post.id, post.isLikedByUser || false)}
                                        disabled={!user}
                                    >
                                        <Heart 
                                            size={18} 
                                            fill={post.isLikedByUser ? 'currentColor' : 'none'}
                                        />
                                        <span>{post.likes}</span>
                                    </button>
                                    
                                    <button
                                        className="action-button comment-button"
                                        onClick={() => toggleComments(post.id)}
                                    >
                                        <MessageCircle size={18} />
                                        <span>{post.commentCount || 0}</span>
                                    </button>
                                </div>
                                
                                <span className="post-date">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {expandedPostId === post.id && (
                                <CommentSection 
                                    postId={post.id} 
                                    onCommentAdded={() => fetchPosts()}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityFeed;