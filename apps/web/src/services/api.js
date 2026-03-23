import axios from 'axios';
import supabase from '../config/supabase';

// Use environment variable or relative path for Vercel deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

// Function to get personalized travel checklist
export const getTravelChecklist = async (data) => {
    try {
        const response = await api.post('/travel/checklist', data);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching travel checklist: ' + error.message);
    }
};

// Function to get regulation summary
export const getRegulationSummary = async (data) => {
    try {
        const response = await api.post('/travel/regulations', data);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching regulation summary: ' + error.message);
    }
};

// Function to explain veterinary documents
export const explainDocuments = async (data) => {
    try {
        const response = await api.post('/travel/documents', data);
        return response.data;
    } catch (error) {
        throw new Error('Error explaining documents: ' + error.message);
    }
};

// ==================== COMMUNITY POSTS ====================

// Function to get community posts
export const getCommunityPosts = async () => {
    try {
        const response = await api.get('/community/posts');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching community posts: ' + error.message);
    }
};

// Function to create a new community post
export const createCommunityPost = async (postData) => {
    try {
        const response = await api.post('/community/posts', postData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating community post: ' + error.message);
    }
};

// Function to like a post
export const likePost = async (postId) => {
    try {
        await api.post(`/community/posts/${postId}/like`);
    } catch (error) {
        throw new Error('Error liking post: ' + error.message);
    }
};

// Function to unlike a post
export const unlikePost = async (postId) => {
    try {
        await api.delete(`/community/posts/${postId}/like`);
    } catch (error) {
        throw new Error('Error unliking post: ' + error.message);
    }
};

// Function to delete a community post
export const deleteCommunityPost = async (postId) => {
    try {
        await api.delete(`/community/posts/${postId}`);
    } catch (error) {
        throw new Error('Error deleting community post: ' + error.message);
    }
};

// ==================== COMMENTS ====================

// Function to get comments for a post
export const getPostComments = async (postId) => {
    try {
        const response = await api.get(`/community/posts/${postId}/comments`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
};

// Function to add a comment to a post
export const addComment = async (postId, commentData) => {
    try {
        const response = await api.post(`/community/posts/${postId}/comments`, commentData);
        return response.data;
    } catch (error) {
        throw new Error('Error adding comment: ' + error.message);
    }
};

// Function to delete a comment
export const deleteComment = async (commentId) => {
    try {
        await api.delete(`/community/comments/${commentId}`);
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message);
    }
};

// ==================== NOTIFICATIONS ====================

// Function to get user notifications
export const getNotifications = async (unreadOnly = false) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            return [];
        }
        
        const response = await api.get('/notifications', { 
            params: { 
                unreadOnly,
                userId: session.user.id
            } 
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching notifications: ' + error.message);
    }
};

// Function to get unread notification count
export const getUnreadNotificationCount = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            return 0;
        }
        
        const response = await api.get('/notifications/unread-count', {
            params: { userId: session.user.id }
        });
        return response.data.count;
    } catch (error) {
        throw new Error('Error fetching unread count: ' + error.message);
    }
};

// Function to mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            throw new Error('Not authenticated');
        }
        
        await api.put(`/notifications`, {
            params: { 
                id: notificationId,
                userId: session.user.id
            }
        });
    } catch (error) {
        throw new Error('Error marking notification as read: ' + error.message);
    }
};

// Function to mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            throw new Error('Not authenticated');
        }
        
        // For now, fetch all unread and mark them one by one
        const unreadNotifs = await getNotifications(true);
        await Promise.all(
            unreadNotifs.map(notif => markNotificationAsRead(notif.id))
        );
    } catch (error) {
        throw new Error('Error marking all notifications as read: ' + error.message);
    }
};

// Function to delete a notification
export const deleteNotification = async (notificationId) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            throw new Error('Not authenticated');
        }
        
        await api.delete(`/notifications`, {
            params: {
                id: notificationId,
                userId: session.user.id
            }
        });
    } catch (error) {
        throw new Error('Error deleting notification: ' + error.message);
    }
};

// ==================== MATCHING ====================

// Function to get matching pet owners (mock for now)
export const getMatchingPetOwners = async () => {
    // Mock data since server endpoint doesn't exist yet
    return {
        data: [
            {
                id: '1',
                name: 'Sarah Johnson',
                location: 'New York',
                destination: 'Paris',
                petType: 'Dog',
                travelDate: '2024-03-15'
            },
            {
                id: '2',
                name: 'Mike Chen',
                location: 'Los Angeles',
                destination: 'Tokyo',
                petType: 'Cat',
                travelDate: '2024-03-20'
            }
        ]
    };
};