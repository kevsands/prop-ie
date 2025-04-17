import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationCenter from '../components/ui/NotificationCenter';
import { useAuth } from '../context/AuthContext';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
};

export default AppWrapper;
