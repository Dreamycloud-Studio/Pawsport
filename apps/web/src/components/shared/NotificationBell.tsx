import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Notification } from '../../types';
import { 
    getNotifications, 
    getUnreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification 
} from '../../services/api';
import { Bell, X } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import './NotificationBell.css';

const NotificationBell: React.FC = () => {
    const { user } = useAuth();
    const history = useHistory();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const [notifs, count] = await Promise.all([
                getNotifications(),
                getUnreadNotificationCount()
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleNotificationClick = async (notification: Notification) => {
        try {
            if (!notification.read) {
                await markNotificationAsRead(notification.id);
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            
            if (notification.link) {
                history.push(notification.link);
            }
            
            setIsOpen(false);
            await fetchNotifications();
        } catch (error) {
            console.error('Error handling notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setUnreadCount(0);
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        
        try {
            await deleteNotification(notificationId);
            await fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="notification-bell-container">
            <button 
                className="notification-bell-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                className="mark-all-read"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <p className="notification-empty">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <p className="notification-empty">No notifications</p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-content">
                                        <strong>{notification.title}</strong>
                                        <p>{notification.message}</p>
                                        <span className="notification-time">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="notification-delete"
                                        onClick={(e) => handleDelete(notification.id, e)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
