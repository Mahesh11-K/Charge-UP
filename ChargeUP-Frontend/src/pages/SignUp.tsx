// src/pages/SignUp.tsx
import React from 'react';
import { AuthPage } from './AuthPage';

export const SignUp: React.FC = () => {
  return <AuthPage initialSignUp={true} />;
};

export default SignUp;
