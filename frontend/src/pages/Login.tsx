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

  // Render Diagnostic
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse: any) => {
    console.log('🌟 Google Login Success, received credential');
    setIsLoading(true);
    setError(null);
    try {
      console.log('📡 Sending credential to backend...');
      const response = await api.post('/auth/login', {
        credential: credentialResponse.credential
      });
      
      console.log('✅ Backend verified login:', response.data);
      const { user, token } = response.data;
      login(user, token);
    } catch (err: any) {
      console.error('❌ Login Error:', err.response?.data || err.message);
      setError(`Authentication failed: ${err.response?.data?.error || 'Server Error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailure = () => {
    console.error('❌ Google Library Initialization/Login failed');
    setError('Google Login failed. Check your internet or browser settings.');
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
                onError={handleFailure}
                theme="filled_black"
                shape="pill"
                auto_select={false}
              />
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl w-full">
              <p className="text-red-400 text-xs font-medium text-center">{error}</p>
            </div>
          )}

          {/* Debug Panel (Only visible if something might be wrong) */}
          <div className="mt-8 p-4 bg-white/5 rounded-2xl w-full border border-white/5">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Deployment Debugger</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/30">Client ID:</span>
                <span className={clientId ? "text-green-500" : "text-red-500"}>
                  {clientId 
                    ? `${clientId.substring(0, 10)}...${clientId.substring(clientId.length - 10)}` 
                    : "❌ Missing"}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/30">API URL:</span>
                <span className="text-white/60 truncate max-w-[150px]">
                  {import.meta.env.VITE_API_URL || "Localhost (Default)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-white/20 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
