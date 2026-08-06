// src/pages/SignIn.tsx
import React from 'react';
import { AuthPage } from './AuthPage';

export const SignIn: React.FC = () => {
  return <AuthPage initialSignUp={false} />;
};

export default SignIn;
