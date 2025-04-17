import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  type: 'document' | 'payment' | 'property' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  data?: any;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to the socket server
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
        query: {
          userId: user.id,
          role: user.role
        }
      });

      setSocket(socketInstance);

      // Clean up on unmount
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Listen for notifications
  useEffect(() => {
    if (!socket) return;

    // Load existing notifications from local storage
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
      }
    }

    // Listen for new notifications
    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message
        });
      }
    });

    // Listen for document status updates
    socket.on('document_update', (data) => {
      const notification: Notification = {
        id: `doc-${Date.now()}`,
        type: 'document',
        title: 'Document Status Update',
        message: `Your document "${data.filename}" has been ${data.status}.`,
        timestamp: new Date().toISOString(),
        read: false,
        link: `/buyer/documents`,
        data
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Listen for payment confirmations
    socket.on('payment_update', (data) => {
      const notification: Notification = {
        id: `payment-${Date.now()}`,
        type: 'payment',
        title: 'Payment Update',
        message: `Your payment of €${data.amount.toLocaleString()} has been ${data.status}.`,
        timestamp: new Date().toISOString(),
        read: false,
        link: `/buyer/financial`,
        data
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Listen for property status changes
    socket.on('property_update', (data) => {
      const notification: Notification = {
        id: `property-${Date.now()}`,
        type: 'property',
        title: 'Property Status Update',
        message: `Status update for ${data.propertyName}: ${data.status}.`,
        timestamp: new Date().toISOString(),
        read: false,
        link: `/property/${data.propertyId}`,
        data
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Listen for direct messages
    socket.on('message', (data) => {
      const notification: Notification = {
        id: `message-${Date.now()}`,
        type: 'message',
        title: 'New Message',
        message: `${data.senderName}: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`,
        timestamp: new Date().toISOString(),
        read: false,
        link: `/messages/${data.conversationId}`,
        data
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('notification');
      socket.off('document_update');
      socket.off('payment_update');
      socket.off('property_update');
      socket.off('message');
    };
  }, [socket]);

  // Save notifications to local storage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 50))); // Limit to 50 notifications
    }
  }, [notifications]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('notifications');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
