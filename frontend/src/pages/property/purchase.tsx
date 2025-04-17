import React from 'react';
import Layout from '../components/layout/Layout';
import PurchaseInitiation from '../components/property/PurchaseInitiation';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const PurchasePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-8">
          <PurchaseInitiation />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default PurchasePage;
