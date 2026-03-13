import { 
  LayoutDashboard, 
  FilePlus, 
  Clock,
  User,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FilePlus, label: 'New Diagram', path: '/editor' },
    { icon: Clock, label: 'Recent', path: '/recent' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-64 glass h-screen flex flex-col border-r-0">
      <div className="p-6 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="font-bold text-white">B</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-white">BioRender</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? 'bg-primary/20 text-primary border border-primary/20' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => navigate('/login')}
          className="w-full flex items-center space-x-3 px-4 py-3 text-white/40 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
