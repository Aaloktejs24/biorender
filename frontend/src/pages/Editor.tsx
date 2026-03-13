import { useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  Download, 
  Share2, 
  Shapes, 
  Type, 
  Image as ImageIcon,
  MousePointer2,
  Hand,
  Save,
  Loader2,
  Check
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client';

const Editor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id');
  
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('shapes');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedStatus, setShowSavedStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      navigate('/dashboard');
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId, navigate]);

  const handleSave = async () => {
    if (!projectId || !project) return;
    setIsSaving(true);
    try {
      await api.post(`/projects/${projectId}/save`, { 
        name: project.name, 
        data: project.data 
      });
      setShowSavedStatus(true);
      setTimeout(() => setShowSavedStatus(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const tools = [
    { id: 'select', icon: MousePointer2 },
    { id: 'grab', icon: Hand },
    { id: 'shapes', icon: Shapes },
    { id: 'text', icon: Type },
    { id: 'media', icon: ImageIcon },
  ];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#08080a]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#08080a]">
      {/* Header */}
      <header className="h-16 glass flex items-center justify-between px-6 z-20">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <input 
            value={project?.name || ''}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className="bg-transparent border-none text-white font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-2 py-1 transition-all"
            placeholder="Untitled Diagram"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-white/5 rounded-lg text-sm text-white/60 transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : showSavedStatus ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : showSavedStatus ? 'Saved' : 'Auto-save off'}</span>
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="btn-primary py-2 px-4 text-sm flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Toolset */}
        <div className="w-16 glass border-l-0 border-t-0 flex flex-col items-center py-6 space-y-4 z-10">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`p-3 rounded-xl transition-all ${
                activeTab === tool.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <tool.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Library Sidebar */}
        <div className="w-72 glass border-l-0 border-t-0 p-6 z-10">
          <h3 className="text-white/40 uppercase text-[10px] font-bold tracking-[0.2em] mb-6">Components Library</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-white/[0.03] border border-white/5 rounded-xl hover:border-primary/30 transition-colors cursor-pointer group flex items-center justify-center p-4">
                <div className="w-full h-full bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <main className="flex-1 relative bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden flex items-center justify-center">
          <div className="w-[800px] h-[600px] bg-white/[0.02] border border-white/10 rounded-sm shadow-2xl relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-xl font-bold tracking-widest uppercase">
               Canvas Viewport
             </div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center space-x-4 glass p-1.5 rounded-2xl">
            <div className="flex items-center">
              <button className="p-2 hover:bg-white/5 rounded-xl text-white/40">-</button>
              <span className="px-3 text-xs font-bold w-12 text-center text-white/60">100%</span>
              <button className="p-2 hover:bg-white/5 rounded-xl text-white/40">+</button>
            </div>
          </div>
        </main>

        {/* Properties Sidebar */}
        <div className="w-64 glass border-r-0 border-t-0 flex flex-col z-10">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-semibold mb-1">Properties</h3>
            <p className="text-xs text-white/30">Configuration settings</p>
          </div>
          <div className="p-6">
             <p className="text-white/20 text-sm text-center italic py-20">Select an element to view properties</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
