"use client";

import './globals.css';
import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Folder, BookOpen, Microscope, Award, Upload, ArrowLeft, FileText, Loader2, ExternalLink } from 'lucide-react';

const GHABSAVault = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null); 
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const levels = [
    { id: '100', title: 'Level 100', courses: 'General Sciences, Math, Intro to BMB', color: 'from-green-600 to-green-800' },
    { id: '200', title: 'Level 200', courses: 'Organic Chemistry, Genetics, Metabolism', color: 'from-green-500 to-green-700' },
    { id: '300', title: 'Level 300', courses: 'Molecular Biology, Cell Signaling, Enzymology', color: 'from-yellow-500 to-yellow-600' },
    { id: '400', title: 'Level 400', courses: 'Clinical Biochem, Immunology, Research Methods', color: 'from-green-800 to-black' },
  ];

  // Logic to fetch files when a level is clicked
  const handleFolderClick = async (levelId) => {
    setCurrentFolder(levelId);
    setLoading(true);
    try {
      const response = await fetch(`/api/drive?folderName=${levelId}`);
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic for the search bar
  const filteredItems = currentFolder 
    ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : levels.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.courses.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} min-h-screen font-sans transition-colors duration-300`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {currentFolder && (
            <button onClick={() => {setCurrentFolder(null); setFiles([]);}} className="mr-2 p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">BMB</div>
          <span className="font-bold text-xl tracking-tight hidden sm:block uppercase">GHABSA-UHAS <span className="text-green-500">Vault</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* Link to your Google Form here */}
          <a href="YOUR_GOOGLE_FORM_LINK_HERE" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
            <Upload size={16} /> Contribute
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-500">
          {currentFolder ? `Level ${currentFolder}` : 'Health for Development.'}
        </h1>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto mb-8`}>
          {currentFolder ? `Browsing verified BMB documents for Level ${currentFolder}.` : 'Access official Biochemistry & Molecular Biology resources.'}
        </p>
        
        {/* Functional Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentFolder ? "Search documents..." : "Search Level (e.g. 300)..."}
            className={`w-full py-4 pl-12 pr-4 rounded-2xl border-none focus:ring-2 focus:ring-green-500 shadow-xl ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {!currentFolder ? (
          <>
            {/* THE MAIN LEVEL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((level) => (
                <div 
                  key={level.id} 
                  onClick={() => handleFolderClick(level.id)}
                  className={`group relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-2 shadow-xl bg-gradient-to-br ${level.color}`}
                >
                  <div className="relative z-10">
                    <Folder className="mb-4 text-white/80" size={32} />
                    <h3 className="text-2xl font-bold text-white mb-2">{level.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{level.courses}</p>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-8xl font-black text-white">{level.id}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SPECIALIST RESOURCES - Only shows on main page */}
            <section className="mt-16 border-t border-white/5 pt-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Microscope className="text-green-500" /> Specialist Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl flex items-start gap-4 ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white shadow-sm'} transition-all cursor-pointer`}>
                  <Award className="text-yellow-500 shrink-0" />
                  <div>
                    <h4 className="font-bold">Internship Hub</h4>
                    <p className="text-sm text-slate-500">Logbooks & Placement Guides</p>
                  </div>
                </div>
                <div className={`p-6 rounded-2xl flex items-start gap-4 ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white shadow-sm'} transition-all cursor-pointer`}>
                  <BookOpen className="text-green-500 shrink-0" />
                  <div>
                    <h4 className="font-bold">Lab SOPs</h4>
                    <p className="text-sm text-slate-500">Standard Operating Procedures</p>
                  </div>
                </div>
                <div className={`p-6 rounded-2xl flex items-start gap-4 ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white shadow-sm'} transition-all cursor-pointer`}>
                  <Search className="text-blue-500 shrink-0" />
                  <div>
                    <h4 className="font-bold">General Courses</h4>
                    <p className="text-sm text-slate-500">UHAS General Requirements</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* INSIDE FOLDER VIEW */
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-green-500" size={40} />
                <p className="text-slate-500">Fetching Level {currentFolder} Cloud Data...</p>
              </div>
            ) : files.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((file) => (
                  <a 
                    key={file.id} 
                    href={file.webViewLink} 
                    target="_blank" 
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-green-500/10 border border-white/10 hover:border-green-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="text-green-500" size={24} />
                      <span className="font-medium truncate max-w-[200px] md:max-w-xs">{file.name}</span>
                    </div>
                    <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-center py-20 text-slate-500">No files found in this directory yet.</p>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-10 opacity-50 text-sm">
        © 2025 GHABSA-UHAS Digital Vault.
      </footer>
    </div>
  );
};

export default GHABSAVault;
