import React from 'react';
import Layout from '../../components/layout/Layout';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-12">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
