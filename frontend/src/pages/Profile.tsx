import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Shield, Camera, Save, Loader2, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/client';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState<any>(authUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        setProfile(response.data.user);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [authUser]);

  const handleUpdate = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await api.post('user/update', { 
        name: profile.name, 
        bio: profile.bio 
      });
      const updatedUser = response.data.user;
      setProfile(updatedUser);
      updateUser(updatedUser); // Correctly sync with Auth context
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-background overflow-y-auto px-10 py-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">User Profile</h1>
          <p className="text-white/40 uppercase text-xs tracking-widest font-semibold">Manage your account settings</p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl space-y-8"
        >
          {/* Profile Card */}
          <div className="glass p-8 rounded-3xl flex items-start space-x-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-surface flex items-center justify-center border-2 border-primary/20">
                {profile?.picture ? (
                  <img src={profile.picture} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-primary/40" />
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                <p className="text-white/40">{profile?.email}</p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full w-fit uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                <span>Verified Researcher</span>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-white">Account Settings</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-white/40 font-medium">Display Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      value={profile?.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-surface/50 border border-white/5 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary/50 transition-all text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/40 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="email" 
                      value={profile?.email || ''}
                      disabled
                      className="w-full bg-surface/20 border border-white/5 pl-11 pr-4 py-3 rounded-xl cursor-not-allowed opacity-50 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/40 font-medium tracking-wide uppercase text-[10px] font-bold">About / Bio</label>
                <div className="relative">
                  <Info className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                  <textarea 
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about your research..."
                    rows={4}
                    className="w-full bg-surface/50 border border-white/5 pl-11 pr-4 py-4 rounded-xl focus:outline-none focus:border-primary/50 transition-all text-white resize-none"
                  />
                </div>
              </div>
            </div>

            {message && (
              <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message.text}
              </p>
            )}

            <div className="pt-4">
              <button 
                onClick={handleUpdate}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2 px-8 py-3 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="glass p-8 rounded-3xl border-red-500/10">
            <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-white/40 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-6 py-2 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-medium uppercase tracking-widest">
              Delete Account
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
