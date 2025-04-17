import React from 'react';
import Layout from '../components/layout/Layout';
import BuyerDashboard from '../components/buyer/BuyerDashboard';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const BuyerDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <BuyerDashboard />
      </Layout>
    </ProtectedRoute>
  );
};

export default BuyerDashboardPage;
