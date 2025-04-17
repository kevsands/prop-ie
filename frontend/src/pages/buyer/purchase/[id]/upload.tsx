import React from 'react';
import Layout from '../components/layout/Layout';
import DocumentUpload from '../components/buyer/DocumentUpload';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const DocumentUploadPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <DocumentUpload />
      </Layout>
    </ProtectedRoute>
  );
};

export default DocumentUploadPage;
