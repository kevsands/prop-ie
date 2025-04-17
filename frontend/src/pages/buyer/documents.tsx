import React from 'react';
import Layout from '../components/layout/Layout';
import DocumentManager from '../components/buyer/DocumentManager';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const DocumentManagerPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DocumentManager />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default DocumentManagerPage;
