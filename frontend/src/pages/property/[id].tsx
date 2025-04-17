import React from 'react';
import Layout from '../components/layout/Layout';
import PropertyDetail from '../components/property/PropertyDetail';

const PropertyDetailPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-8">
        <PropertyDetail />
      </div>
    </Layout>
  );
};

export default PropertyDetailPage;
