import React, { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Message',
      message: 'You have received a new message about your laptop listing',
      timestamp: '2024-03-15T10:30:00Z',
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Item Sold',
      message: 'Your "Data Structures Textbook" has been marked as sold',
      timestamp: '2024-03-14T15:45:00Z',
      read: true,
      type: 'success',
    },
    {
      id: '3',
      title: 'Price Update',
      message: 'A product in your wishlist has dropped in price',
      timestamp: '2024-03-13T09:20:00Z',
      read: false,
      type: 'warning',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (notifications.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <Bell className="mx-auto h-16 w-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No notifications</h2>
        <p className="text-gray-600">
          You're all caught up! Check back later for new updates.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <div className="space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              Clear all
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-md p-4 ${
                !notification.read ? 'border-l-4 border-orange-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-green-500"
                      title="Mark as read"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;