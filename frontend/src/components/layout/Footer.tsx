import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Prop.ie</h3>
            <p className="text-gray-300">
              Enterprise-grade property development platform for secure off-plan purchasing with full legal and compliance controls.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/property" className="text-gray-300 hover:text-white">Properties</a></li>
              <li><a href="/auth/login" className="text-gray-300 hover:text-white">Login</a></li>
              <li><a href="/auth/register" className="text-gray-300 hover:text-white">Register</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@prop.ie</li>
              <li>Phone: +353 1 234 5678</li>
              <li>Address: Dublin, Ireland</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Prop.ie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
