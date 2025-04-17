import React from 'react';
import Layout from '../../components/layout/Layout';
import AdminFinancialDashboard from '../../components/admin/AdminFinancialDashboard';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const AdminFinancialPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminFinancialDashboard />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminFinancialPage;
