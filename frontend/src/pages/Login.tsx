import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import api from '../api/client';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', {
        credential: credentialResponse.credential
      });
      
      const { user, token } = response.data;
      login(user, token);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-3xl w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">BioRender</h1>
          <p className="text-white/60 text-center">
            Professional scientific diagramming, reimagined for the modern researcher.
          </p>
        </div>

        <div className="space-y-6 flex flex-col items-center">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm text-white/60">Verifying credentials...</p>
            </div>
          ) : (
            <div className="w-full flex justify-center">
               <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError('Google Login Failed')}
                useOneTap
                theme="filled_black"
                shape="pill"
                width="100%"
              />
            </div>
          )}
          
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}
        </div>

        <p className="text-[10px] text-center text-white/20 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
