import React from 'react';
import Layout from '../../components/layout/Layout';
import AdminDocumentReview from '../../components/admin/AdminDocumentReview';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const AdminDocumentReviewPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDocumentReview />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDocumentReviewPage;
