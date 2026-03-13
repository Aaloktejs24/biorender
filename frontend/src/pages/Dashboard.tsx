import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Search, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const Dashboard = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const createNewProject = async () => {
    try {
      const response = await api.post('/projects', { name: 'New Diagram' });
      if (response.data?._id) {
        navigate(`/editor?id=${response.data._id}`);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-background overflow-y-auto px-10 py-8">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Projects</h1>
            <p className="text-white/40 uppercase text-xs tracking-widest font-semibold">Scientific Visualizations</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search diagrams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface/50 border border-white/5 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-primary/50 transition-all w-64 text-white"
              />
            </div>
            <button 
              onClick={createNewProject}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-white/40">Loading your research...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/editor?id=${project._id}`)}
                className="glass p-1 rounded-2xl group cursor-pointer"
              >
                <div className="aspect-video bg-surface rounded-xl flex items-center justify-center p-8 mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <span className="px-2 py-0.5 bg-white/5 text-[10px] rounded-full text-white/40">{project.status}</span>
                  </div>
                  <p className="text-sm text-white/30">
                    {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 glass rounded-3xl">
            <p className="text-white/40 mb-6 font-medium">No projects found. Start your first diagram!</p>
            <button 
              onClick={createNewProject}
              className="px-6 py-2 border border-primary/20 text-primary rounded-xl hover:bg-primary/5 transition-colors font-medium"
            >
              + Create New Project
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
