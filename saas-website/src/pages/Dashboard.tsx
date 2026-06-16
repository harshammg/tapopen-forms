import { Activity, FolderOpen, Plus, Search, Settings, Link as LinkIcon, Clock, Copy, ExternalLink, Edit2, Lock, Mail, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ExtForm {
  id: string;
  link: string;
  durationSeconds: number;
  expiresTs: number | null;
}

export default function Dashboard() {
  const [forms, setForms] = useState<ExtForm[]>([]);
  const [extensionDetected, setExtensionDetected] = useState(false);
  const [customNames, setCustomNames] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('tapopen_form_names');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from our extension content script
      if (event.data && event.data.type === 'EXT_FORMS_SYNC') {
        setExtensionDetected(true);
        setForms(event.data.forms || []);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Announce to the extension that the dashboard is ready to receive data
    window.postMessage({ type: 'DASHBOARD_READY' }, '*');
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const handleRename = (formId: string) => {
    const currentName = customNames[formId] || '';
    const newName = prompt('Enter a new name for this form:', currentName);
    if (newName !== null && newName.trim() !== '') {
      const updated = { ...customNames, [formId]: newName.trim() };
      setCustomNames(updated);
      localStorage.setItem('tapopen_form_names', JSON.stringify(updated));
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-['Space_Grotesk'] text-white">
      
      {/* Glow Effects */}
      <div className="fixed inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#7C3AED] to-[#4F46E5] opacity-10"></div>
      </div>

      <div className="md:flex md:items-center md:justify-between mb-12 relative z-10">
        <div className="min-w-0 flex-1">
          <h2 className="text-3xl font-black leading-7 text-white sm:truncate sm:text-4xl tracking-tight">
            Overview
          </h2>
          <p className="mt-2 text-base text-gray-400 font-medium">Manage your active forms and subscription settings.</p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row md:ml-4 md:mt-0 gap-4">
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 transition-all">
            <Settings className="h-4 w-4 text-gray-400" />
            Settings
          </button>
          {!extensionDetected && (
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-xl hover:bg-gray-200 transition-all hover:shadow-white/20 active:scale-95">
              <Plus className="h-4 w-4" />
              Install Extension
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-12 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <Activity className="h-24 w-24 text-blue-400" />
          </div>
          <div className="relative">
            <div className="bg-blue-500/20 ring-1 ring-blue-500/30 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
              <Activity className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Active Links</p>
            <p className="text-5xl font-black text-white tracking-tighter">{forms.length}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl text-white relative overflow-hidden group border border-purple-500/30">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 blur-3xl rounded-full group-hover:bg-purple-500/40 transition-colors duration-500"></div>
           <div className="relative h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-purple-300 uppercase tracking-wider">Current Plan</p>
                <span className="bg-purple-500/20 ring-1 ring-purple-500/50 text-purple-200 text-xs px-3 py-1 rounded-full font-bold">Active</span>
              </div>
              <p className="text-4xl font-black mt-2 tracking-tight text-white">Free Tier</p>
            </div>
            <button className="w-full mt-6 bg-white/5 text-gray-400 ring-1 ring-white/10 font-bold py-3 rounded-xl flex items-center justify-center gap-2 backdrop-blur-md cursor-not-allowed">
              <Lock className="w-4 h-4" /> Upgrade Plan (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden relative z-10">
        <div className="border-b border-white/10 px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">Your Forms</h3>
            {extensionDetected && (
              <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full ring-1 ring-green-500/30 uppercase tracking-widest whitespace-nowrap">Extension Synced</span>
            )}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search forms..." className="pl-10 pr-4 py-2 bg-[#0A0A0B] border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium w-full sm:w-64 text-white placeholder-gray-500" />
          </div>
        </div>
        
        {forms.length === 0 ? (
          <div className="text-center py-32 px-6">
            <div className="mx-auto h-28 w-28 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6 shadow-2xl border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-300">
              <FolderOpen className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="mt-2 text-2xl font-black text-white tracking-tight">
              {extensionDetected ? 'No active forms' : 'Extension not detected'}
            </h3>
            <p className="mt-3 text-base text-gray-400 max-w-md mx-auto font-medium leading-relaxed">
              {extensionDetected 
                ? "You haven't generated any timer links yet. Open the Chrome Extension while viewing a Google Form to create your first secure link."
                : "To manage your forms, please ensure the Forms by tapOpen Chrome Extension is installed and active."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {forms.map((form) => (
              <li key={form.id} className="p-6 sm:p-8 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                    <div className="bg-purple-500/10 p-3 sm:p-4 rounded-2xl ring-1 ring-purple-500/20 shrink-0">
                      <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                          {customNames[form.id] || `Form ID: ${form.id.substring(0, 12)}...`}
                        </h4>
                        <button onClick={() => handleRename(form.id)} className="text-gray-500 hover:text-white transition-colors" title="Rename form">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-gray-400">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 sm:px-2.5 rounded-lg ring-1 ring-white/10 whitespace-nowrap"><Clock className="h-3.5 w-3.5 text-gray-300 shrink-0" /> {Math.floor(form.durationSeconds / 60)} mins</span>
                        {form.expiresTs && (
                          <span className="flex items-center gap-1.5 bg-red-500/10 text-red-300 px-2 py-1 sm:px-2.5 rounded-lg ring-1 ring-red-500/20 whitespace-nowrap">
                            Expires: {new Date(form.expiresTs).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap justify-end">
                    <button onClick={() => copyToClipboard(form.link)} className="bg-white/5 hover:bg-white/10 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-white/10 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Copy Link">
                      <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white" />
                      <span className="sm:hidden text-sm font-bold text-gray-300 group-hover:text-white">Copy</span>
                    </button>
                    
                    <a href={`mailto:?subject=${encodeURIComponent('Please fill out this timed Google Form')}&body=${encodeURIComponent(`Here is the link to the timed form:\n\n${form.link}\n\nPlease note there is a time limit.`)}`} target="_blank" rel="noreferrer" className="bg-blue-500/10 hover:bg-blue-500/20 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-blue-500/20 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Share via Email">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="sm:hidden text-sm font-bold text-blue-300 group-hover:text-blue-200">Email</span>
                    </a>
                    
                    <a href={`https://wa.me/?text=${encodeURIComponent(`Please fill out this timed Google Form:\n${form.link}`)}`} target="_blank" rel="noreferrer" className="bg-green-500/10 hover:bg-green-500/20 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-green-500/20 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Share via WhatsApp">
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 group-hover:text-green-300" />
                      <span className="sm:hidden text-sm font-bold text-green-300 group-hover:text-green-200">WhatsApp</span>
                    </a>

                    <a href={form.link} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-white/10 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Open Link">
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white" />
                      <span className="sm:hidden text-sm font-bold text-gray-300 group-hover:text-white">Open</span>
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
