"use client";

import './globals.css';
import React, { useState } from 'react';
import { Search, Moon, Sun, Folder, BookOpen, Microscope, Award, Upload, ArrowLeft, FileText, Loader2, ExternalLink, FileJson, FileCode, Clock, Heart } from 'lucide-react';

const GHABSAVault = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Navigation State
  const [currentFolder, setCurrentFolder] = useState(null); 
  const [folderTitle, setFolderTitle] = useState(""); 
  const [files, setFiles] = useState([]);
  const [history, setHistory] = useState([]); 

  const levels = [
    { id: '100', title: 'Level 100', courses: 'Comm. Skills, Quant. Lit., Intro to BMB', color: 'from-green-600 to-green-800' },
    { id: '200', title: 'Level 200', courses: 'Dev. Biology, Genetics, Metabolism', color: 'from-green-500 to-green-700' },
    { id: '300', title: 'Level 300', courses: 'Molecular Biology, Cell Signaling, Enzymology', color: 'from-yellow-500 to-yellow-600' },
    { id: '400', title: 'Level 400', courses: 'Clinical Biochem, Entrepreneurship, Research Methods', color: 'from-green-800 to-black' },
  ];

  // Modified to handle both Level names and Specialist names
  const fetchFolderContent = async (id, name, isInitial = false) => {
    setLoading(true);
    try {
      const url = isInitial 
        ? `/api/drive?folderName=${encodeURIComponent(name)}` 
        : `/api/drive?folderId=${id}`;
        
      const response = await fetch(url);
      const data = await response.json();
      
      setFiles(data);
      setCurrentFolder(id || "root"); 
      setFolderTitle(name);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Logic to decide whether to open a link or browse deeper
  const handleItemClick = (item) => {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      setHistory([...history, { id: currentFolder, title: folderTitle, files: files }]);
      fetchFolderContent(item.id, item.name);
    } else {
      window.open(item.webViewLink, '_blank');
    }
  };

  const goBack = () => {
    if (history.length === 0) {
      setCurrentFolder(null);
      setFiles([]);
      return;
    }
    const previous = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setFiles(previous.files);
    setCurrentFolder(previous.id);
    setFolderTitle(previous.title);
  };
useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    if (searchQuery.length > 2) {
      performGlobalSearch();
    }
  }, 500); // Wait 500ms after typing stops

  return () => clearTimeout(delayDebounceFn);
}, [searchQuery]);

const performGlobalSearch = async () => {
  setLoading(true);
  try {
    const response = await fetch(`/api/drive?q=${encodeURIComponent(searchQuery)}`);
    const data = await response.json();
    setFiles(data);
    setCurrentFolder("search-results");
    setFolderTitle(`Results for "${searchQuery}"`);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(true);
  }
};
  
  const getFileIcon = (mimeType) => {
    if (mimeType === 'application/vnd.google-apps.folder') return <Folder className="text-yellow-500" size={24} />;
    if (mimeType?.includes('pdf')) return <FileText className="text-red-400" size={24} />;
    if (mimeType?.includes('word') || mimeType?.includes('document')) return <BookOpen className="text-blue-400" size={24} />;
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return <FileJson className="text-green-400" size={24} />;
    return <FileCode className="text-slate-400" size={24} />;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredItems = currentFolder 
    ? (files || []).filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : levels.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} min-h-screen font-sans transition-colors duration-300`}>
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {currentFolder && (
            <button onClick={goBack} className="mr-2 p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <img src="/logo.png" alt="Crest" className="w-12 h-12 rounded-full border-2 border-green-500 shadow-sm" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight hidden sm:block">GHABSA-UHAS</span>
            <span className="text-green-500 font-black text-sm tracking-widest hidden sm:block uppercase">Digital Vault</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://paystack.com/pay/your-link" // You can set up a Paystack/Momo link
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-rose-500 hover:text-rose-400 font-medium text-sm transition-colors"
          >
            <Heart size={16} /> Support
          </a>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="https://forms.gle/i5tn9MssBEtnqq7a6" target="_blank" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <Upload size={16} /> Contribute
          </a>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-500">
          {currentFolder ? `${folderTitle} Resources` : 'Health Research, Our Focus.'}
        </h1>
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Course Codes (e.g. MBMB 301)..."
            className={`w-full py-4 pl-12 pr-4 rounded-2xl border-none focus:ring-green-500 shadow-xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}
          />
            {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-500 transition-colors"
          >
            <Clock size={18} className="rotate-45" /> {/* Using Clock rotated as a simple 'X' or use X icon */}
          </button>
        )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        {!currentFolder ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {levels.map((level) => (
                <div key={level.id} onClick={() => fetchFolderContent(null, level.title, true)} className={`group relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-2 shadow-xl bg-gradient-to-br ${level.color}`}>
                   <Folder className="mb-4 text-white/80" size={32} />
                   <h3 className="text-2xl font-bold text-white mb-2">{level.title}</h3>
                   <p className="text-white/70 text-sm">{level.courses}</p>
                   <span className="absolute top-0 right-0 p-4 opacity-10 text-8xl font-black text-white">{level.id}</span>
                </div>
              ))}
            </div>

            <section className="mt-16 border-t border-white/5 pt-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Microscope className="text-green-500" /> Specialist Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div onClick={() => fetchFolderContent(null, 'Internship', true)} className={`p-6 rounded-2xl flex items-start gap-4 cursor-pointer transition-all ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white shadow-sm hover:shadow-md'}`}>
                  <Award className="text-yellow-500 shrink-0" />
                  <div><h4 className="font-bold">Internship Hub</h4><p className="text-sm text-slate-500">Logbooks & Guides</p></div>
                </div>
                <div onClick={() => fetchFolderContent(null, 'SOP', true)} className={`p-6 rounded-2xl flex items-start gap-4 cursor-pointer transition-all ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white shadow-sm hover:shadow-md'}`}>
                  <BookOpen className="text-green-500 shrink-0" />
                  <div><h4 className="font-bold">Lab SOPs</h4><p className="text-sm text-slate-500">Standard Laboratory Protocols</p></div>
                </div>
                <div onClick={() => fetchFolderContent(null, 'Other', true)} className={`p-6 rounded-2xl flex items-start gap-4 cursor-pointer transition-all ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white shadow-sm hover:shadow-md'}`}>
                  <Search className="text-blue-500 shrink-0" />
                  <div><h4 className="font-bold">Other University Resources</h4><p className="text-sm text-slate-500">UHAS and SRC Resources</p></div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 text-sm overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => {setCurrentFolder(null); setHistory([]); setSearchQuery("");}} className="text-slate-500 hover:text-green-500 transition-colors">Home</button>
        {history.map((step, index) => (
          <React.Fragment key={index}>
            <span className="text-slate-700">/</span>
            <button 
              onClick={() => {
                // Logic to jump back to this specific point in history
                const targetHistory = history.slice(0, index);
                setHistory(targetHistory);
                setFiles(step.files);
                setCurrentFolder(step.id);
                setFolderTitle(step.title);
              }}
              className="text-slate-500 hover:text-green-500 transition-colors"
            >
              {step.title}
            </button>
          </React.Fragment>
        ))}
        <span className="text-slate-700">/</span>
        <span className="text-green-500 font-medium">{folderTitle}</span>
      </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-green-500" size={40} />
                <p className="text-slate-500 animate-pulse">Unlocking the vault...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} onClick={() => handleItemClick(item)} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl hover:bg-green-500/10 border border-white/10 hover:border-green-500/50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      {getFileIcon(item.mimeType)}
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[200px] md:max-w-xl text-left">{item.name}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {item.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : `Updated: ${formatDate(item.modifiedTime)}`}
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-all text-green-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500">This shelf is empty. Be the first to contribute!</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 mt-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
          <div className="text-center md:text-left">
            <p className="font-semibold text-slate-400">GHABSA-UHAS Digital Vault</p>
            <p>© 2026. Built for the BMB Community.</p>
          </div>
          <div className="flex gap-6">
            <a href="mailto:ghabsa.uhas.repo@gmail.com" className="hover:text-green-500 transition-colors">Report an Issue</a>
            <a href="https://forms.gle/tBZmeg1xiazwW5pB8" target="_blank" className="hover:text-green-500 transition-colors">Suggestions</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GHABSAVault;
