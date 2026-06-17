import { Activity, FolderOpen, Plus, Search, Settings, Link as LinkIcon, Clock, Copy, ExternalLink, Edit2, Lock, Mail, MessageCircle, LogOut, Trash2, MoreVertical, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ExtForm {
  id: string; // Supabase UUID
  googleFormId: string;
  link: string;
  durationSeconds: number;
  expiresTs: number | null;
  title: string | null;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [forms, setForms] = useState<ExtForm[]>([]);
  const [extensionDetected, setExtensionDetected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleShare = async (form: ExtForm) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: form.title || 'Timed Google Form',
          text: `Please fill out this secure timed Google Form:`,
          url: form.link
        });
      } catch (err) {
        console.log('Share failed or canceled', err);
      }
    } else {
      copyToClipboard(form.link);
    }
  };


  // Helper to extract Google Form ID from extension link
  const extractFormIdFromLink = (link: string): string => {
    try {
      const url = new URL(link);
      const pathParts = url.pathname.split('/');
      const takeIndex = pathParts.indexOf('take');
      if (takeIndex !== -1 && pathParts[takeIndex + 1]) {
        // Parse out any query parameters just in case
        return pathParts[takeIndex + 1].split('?')[0];
      }
    } catch (e) {
      console.error('Failed to parse form link:', e);
    }
    return '';
  };

  // Load forms from Supabase
  const loadDbForms = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading forms:', error);
    } else if (data) {
      const formatted = data.map((f: any) => ({
        id: f.id,
        googleFormId: f.google_form_link,
        link: `${window.location.origin}/take/${f.id}`,
        durationSeconds: f.duration_seconds,
        expiresTs: f.expires_at ? new Date(f.expires_at).getTime() : null,
        title: f.title
      }));
      setForms(formatted);
    }
    setLoading(false);
  };

  // Sync extension forms with Supabase
  const syncFormsWithDb = async (extForms: any[]) => {
    if (!user) return;

    try {
      const upsertData = extForms.map(extForm => {
        const googleFormId = extractFormIdFromLink(extForm.link);
        if (!googleFormId) return null;
        
        const expiresAt = extForm.expiresTs ? new Date(extForm.expiresTs).toISOString() : null;
        return {
          user_id: user.id,
          google_form_link: googleFormId,
          duration_seconds: extForm.durationSeconds,
          expires_at: expiresAt,
          title: extForm.title || null
        };
      }).filter(Boolean) as any[];

      if (upsertData.length === 0) return;

      // Fetch existing forms to preserve their titles
      const { data: dbForms } = await supabase
        .from('forms')
        .select('google_form_link, title');
      const titleMap = new Map(dbForms?.map(f => [f.google_form_link, f.title]));

      const finalUpsertData = upsertData.map(d => {
        const existingTitle = titleMap.get(d.google_form_link);
        const isDefaultTitle = existingTitle && existingTitle.startsWith('Form: ');
        
        return {
          user_id: d.user_id,
          google_form_link: d.google_form_link,
          duration_seconds: d.duration_seconds,
          expires_at: d.expires_at,
          title: (!existingTitle || isDefaultTitle) ? (d.title || `Form: ${d.google_form_link.substring(0, 8)}`) : existingTitle
        };
      });

      const { error: upsertError } = await supabase
        .from('forms')
        .upsert(finalUpsertData, { onConflict: 'user_id,google_form_link' });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
      } else {
        await loadDbForms();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadDbForms();
    }
  }, [user]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify message origin matches ours
      if (event.source !== window) return;

      if (event.data && event.data.type === 'EXT_FORMS_SYNC') {
        setExtensionDetected(true);
        const extForms = event.data.forms || [];
        if (user) {
          await syncFormsWithDb(extForms);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Announce ready
    window.postMessage({ type: 'DASHBOARD_READY' }, '*');
    
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Secure timer link copied to clipboard!');
  };

  const handleRename = async (formId: string, currentTitle: string | null) => {
    const newName = prompt('Enter a new name for this form:', currentTitle || '');
    if (newName !== null && newName.trim() !== '') {
      const { error } = await supabase
        .from('forms')
        .update({ title: newName.trim() })
        .eq('id', formId);
      
      if (error) {
        console.error('Rename failed:', error);
        alert('Could not update form name');
      } else {
        await loadDbForms();
      }
    }
  };

  const handleDelete = async (formId: string, googleFormId: string) => {
    if (confirm('Are you sure you want to delete this timed form? This will remove it from the dashboard and your Chrome extension local storage.')) {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId);
      
      if (error) {
        console.error('Delete failed:', error);
        alert('Could not delete form');
      } else {
        // Notify the extension to delete it from local storage
        window.postMessage({
          type: 'WEBSITE_FORM_DELETE',
          googleFormId
        }, '*');
        
        await loadDbForms();
      }
    }
  };

  const filteredForms = forms.filter(form => {
    const titleMatch = form.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = form.googleFormId.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || idMatch;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-['Space_Grotesk'] text-white">
      
      {/* Glow Effects */}
      <div className="fixed inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#7C3AED] to-[#4F46E5] opacity-10"></div>
      </div>

      <div className="md:flex md:items-center md:justify-between mb-12 relative z-10">
        <div className="min-w-0 flex-1">
          <h2 className="text-3xl font-black leading-7 text-white sm:truncate sm:text-4xl tracking-tight uppercase">
            Dashboard
          </h2>
          <p className="mt-2 text-base text-gray-400 font-medium">
            Welcome back, <span className="text-purple-400 font-bold">{user?.email}</span>. Manage your active timed forms.
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row md:ml-4 md:mt-0 gap-4">
          <button 
            type="button" 
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-5 py-2.5 text-sm font-bold text-red-200 shadow-sm hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
          {!extensionDetected && (
            <a 
              href="/extension.zip" 
              download="google-forms-timer-extension.zip"
              className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-xl hover:bg-gray-200 transition-all hover:shadow-white/20 active:scale-95 no-underline pointer-events-auto"
            >
              <Plus className="h-4 w-4" />
              Download Extension
            </a>
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
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Secure Timed Links</p>
            <p className="text-5xl font-black text-white tracking-tighter">{forms.length}</p>
          </div>
        </div>

        <div className="hidden md:block bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl text-white relative overflow-hidden group border border-purple-500/30">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 blur-3xl rounded-full group-hover:bg-purple-500/40 transition-colors duration-500"></div>
           <div className="relative h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-purple-300 uppercase tracking-wider">Roadmap</p>
                <span className="bg-purple-500/20 ring-1 ring-purple-500/50 text-purple-200 text-xs px-3 py-1 rounded-full font-bold">Planned</span>
              </div>
              <p className="text-4xl font-black mt-2 tracking-tight text-white">New Features</p>
              <p className="text-sm text-gray-400 mt-2 font-medium">We are actively building team collaboration tools, custom domains, and more advanced proctoring settings.</p>
            </div>
            <button className="w-full mt-6 bg-white/5 text-gray-400 ring-1 ring-white/10 font-bold py-3 rounded-xl flex items-center justify-center gap-2 backdrop-blur-md cursor-not-allowed">
              <Lock className="w-4 h-4" /> Coming Soon
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 relative z-10">
        <div className="border-b border-white/10 px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">Secure Timed Forms</h3>
            {extensionDetected && (
              <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full ring-1 ring-green-500/30 uppercase tracking-widest whitespace-nowrap">Extension Synced</span>
            )}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search forms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#0A0A0B] border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium w-full sm:w-64 text-white placeholder-gray-500" 
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2 text-gray-400">Loading secure links...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-32 px-6">
            <div className="mx-auto h-28 w-28 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6 shadow-2xl border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-300">
              <FolderOpen className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="mt-2 text-2xl font-black text-white tracking-tight">
              {extensionDetected ? 'No matched forms' : 'Extension Sync Required'}
            </h3>
            <p className="mt-3 text-base text-gray-400 max-w-md mx-auto font-medium leading-relaxed">
              {extensionDetected 
                ? "You haven't generated any timer links yet or your search doesn't match."
                : "Open the Chrome Extension while viewing a Google Form on this browser to sync and save your timed forms securely to Supabase."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filteredForms.map((form) => (
              <li key={form.id} className="p-6 sm:p-8 hover:bg-white/[0.02] transition-colors first:rounded-t-[2rem] last:rounded-b-[2rem]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                    <div className="bg-purple-500/10 p-3 sm:p-4 rounded-2xl ring-1 ring-purple-500/20 shrink-0">
                      <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                          {form.title || `Form: ${form.googleFormId.substring(0, 12)}...`}
                        </h4>
                        <button onClick={() => handleRename(form.id, form.title)} className="text-gray-500 hover:text-white transition-colors" title="Rename form">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-gray-400">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 sm:px-2.5 rounded-lg ring-1 ring-white/10 whitespace-nowrap">
                          <Clock className="h-3.5 w-3.5 text-gray-300 shrink-0" /> 
                          {Math.floor(form.durationSeconds / 60)} mins
                        </span>
                        {form.expiresTs && (
                          <span className="flex items-center gap-1.5 bg-red-500/10 text-red-300 px-2 py-1 sm:px-2.5 rounded-lg ring-1 ring-red-500/20 whitespace-nowrap">
                            Expires: {new Date(form.expiresTs).toLocaleDateString()}
                          </span>
                        )}
                        <span className="text-[10px] bg-purple-500/20 ring-1 ring-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                          Secure DB Link
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap justify-end">
                    {/* Desktop View Action Buttons */}
                    <div className="hidden md:flex items-center gap-2 sm:gap-3 flex-wrap">
                      <button onClick={() => copyToClipboard(form.link)} className="bg-white/5 hover:bg-white/10 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-white/10 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Copy Link">
                        <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white" />
                        <span className="sm:hidden text-sm font-bold text-gray-300 group-hover:text-white">Copy</span>
                      </button>
                      
                      <a href={`mailto:?subject=${encodeURIComponent('Please fill out this timed Google Form')}&body=${encodeURIComponent(`Here is the secure link to the timed form:\n\n${form.link}\n\nPlease note there is a strict time limit.`)}`} target="_blank" rel="noreferrer" className="bg-blue-500/10 hover:bg-blue-500/20 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-blue-500/20 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Share via Email">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 group-hover:text-blue-300" />
                        <span className="sm:hidden text-sm font-bold text-blue-300 group-hover:text-blue-200">Email</span>
                      </a>
                      
                      <a href={`https://wa.me/?text=${encodeURIComponent(`Please fill out this secure timed Google Form:\n${form.link}`)}`} target="_blank" rel="noreferrer" className="bg-green-500/10 hover:bg-green-500/20 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-green-500/20 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Share via WhatsApp">
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 group-hover:text-green-300" />
                        <span className="sm:hidden text-sm font-bold text-green-300 group-hover:text-green-200">WhatsApp</span>
                      </a>

                      <a href={form.link} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-white/10 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Open Link">
                        <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white" />
                        <span className="sm:hidden text-sm font-bold text-gray-300 group-hover:text-white">Open</span>
                      </a>

                      <a href={`https://docs.google.com/forms/d/${form.googleFormId.replace(/^e-/, '')}/edit`} target="_blank" rel="noreferrer" className="bg-purple-500/10 hover:bg-purple-500/20 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-purple-500/20 group flex-1 sm:flex-none flex justify-center items-center gap-2" title="Edit Google Form">
                        <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 group-hover:text-purple-300" />
                        <span className="sm:hidden text-sm font-bold text-purple-300 group-hover:text-purple-200">Edit Form</span>
                      </a>

                      <button onClick={() => handleDelete(form.id, form.googleFormId)} className="bg-red-500/10 hover:bg-red-500/20 p-2.5 sm:p-3 rounded-xl transition-colors ring-1 ring-red-500/20 group flex-1 sm:flex-none flex justify-center items-center gap-2 cursor-pointer" title="Delete Timed Form">
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 group-hover:text-red-300" />
                        <span className="sm:hidden text-sm font-bold text-red-300 group-hover:text-red-200">Delete</span>
                      </button>
                    </div>

                    {/* Mobile View Share Button & Dropdown */}
                    <div className="flex md:hidden items-center gap-1.5 relative">
                      <button onClick={() => copyToClipboard(form.link)} className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-colors ring-1 ring-white/10 text-gray-400 hover:text-white cursor-pointer" title="Copy Link">
                        <Copy className="h-4 w-4" />
                      </button>

                      <a href={form.link} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-colors ring-1 ring-white/10 text-gray-400 hover:text-white flex items-center justify-center" title="Open Link">
                        <ExternalLink className="h-4 w-4" />
                      </a>

                      <button 
                        onClick={() => handleShare(form)} 
                        className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 p-2.5 rounded-xl transition-colors ring-1 ring-purple-500/20 flex items-center justify-center cursor-pointer"
                        title="Share Link"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>

                      <button onClick={() => handleDelete(form.id, form.googleFormId)} className="bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-xl transition-colors ring-1 ring-red-500/20 text-red-400 hover:text-red-300 cursor-pointer" title="Delete Timed Form">
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === form.id ? null : form.id)}
                        className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-colors ring-1 ring-white/10 text-gray-400 hover:text-white cursor-pointer"
                        title="More Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeDropdown === form.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)}></div>
                          <div className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-[#0F0F11] border border-white/10 p-2 shadow-2xl z-50 flex flex-col gap-1">
                            <a 
                              href={`mailto:?subject=${encodeURIComponent('Please fill out this timed Google Form')}&body=${encodeURIComponent(`Here is the secure link to the timed form:\n\n${form.link}\n\nPlease note there is a strict time limit.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors no-underline"
                            >
                              <Mail className="h-4 w-4 text-gray-400" />
                              Email Link
                            </a>
                            <a 
                              href={`https://wa.me/?text=${encodeURIComponent(`Please fill out this secure timed Google Form:\n${form.link}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors no-underline"
                            >
                              <MessageCircle className="h-4 w-4 text-gray-400" />
                              WhatsApp Link
                            </a>
                            <a 
                              href={`https://docs.google.com/forms/d/${form.googleFormId.replace(/^e-/, '')}/edit`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors no-underline"
                            >
                              <Settings className="h-4 w-4 text-gray-400" />
                              Edit Form
                            </a>
                          </div>
                        </>
                      )}
                    </div>
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
