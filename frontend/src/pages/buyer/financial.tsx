import React from 'react';
import Layout from '../components/layout/Layout';
import BuyerFinancialDashboard from '../components/buyer/BuyerFinancialDashboard';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const BuyerFinancialPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BuyerFinancialDashboard />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default BuyerFinancialPage;
