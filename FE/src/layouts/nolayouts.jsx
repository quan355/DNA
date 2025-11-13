import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-800 flex items-center justify-center p-4">
      {children}
    </div>
  );
};

export default AuthLayout;