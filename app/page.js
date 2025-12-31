"use client";

import './globals.css';
import React, { useState } from 'react';
import { Search, Moon, Sun, Folder, BookOpen, Microscope, Award, Upload, ArrowLeft } from 'lucide-react';

const GHABSAVault = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null); // Tracks if we are "inside" a level
  const [loading, setLoading] = useState(false);

  // This matches your Replit design exactly
  const levels = [
    { id: '100', title: 'Level 100', courses: 'General Sciences, Math, Intro to BMB', color: 'from-green-600 to-green-800' },
    { id: '200', title: 'Level 200', courses: 'Organic Chemistry, Genetics, Metabolism', color: 'from-green-500 to-green-700' },
    { id: '300', title: 'Level 300', courses: 'Molecular Biology, Cell Signaling, Enzymology', color: 'from-yellow-500 to-yellow-600' },
    { id: '400', title: 'Level 400', courses: 'Clinical Biochem, Immunology, Research Methods', color: 'from-green-800 to-black' },
  ];

  // Function to "Enter" a folder
  const handleFolderClick = (levelId) => {
    setLoading(true);
    // In a real scenario, this would filter your Drive API results by the level name
    setCurrentFolder(levelId); 
    setLoading(false);
  };

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} min-h-screen font-sans transition-colors duration-300`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {currentFolder && (
            <button onClick={() => setCurrentFolder(null)} className="mr-2 p-2 hover:bg-white/10 rounded-full transition-colors">
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
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
            <Upload size={16} /> Contribute
          </button>
        </div>
      </nav>

      {/* Dynamic Header */}
      <header className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-500">
          {currentFolder ? `Level ${currentFolder} Resources` : 'Health for Development.'}
        </h1>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto mb-8`}>
          {currentFolder ? `Browsing official materials for BMB Level ${currentFolder}.` : 'Access the official Biochemistry & Molecular Biology resource repository.'}
        </p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className={`w-full py-4 pl-12 pr-4 rounded-2xl border-none focus:ring-2 focus:ring-green-500 shadow-xl ${darkMode ? 'bg-slate-900' : 'bg-white'}`}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {!currentFolder ? (
          /* LEVEL GRID (Your Initial Design) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level) => (
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
        ) : (
          /* INSIDE FOLDER VIEW (The Drive Connection) */
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <p className="text-slate-500 text-center py-10">Connecting to Google Drive to fetch Level {currentFolder} files...</p>
            {/* The folder list from your /api/drive will be mapped here */}
          </div>
        )}

        {/* Specialist Resources - Always visible at bottom */}
        <section className="mt-16 border-t border-white/5 pt-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Microscope className="text-green-500" /> Specialist Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl flex items-start gap-4 ${darkMode ? 'bg-slate-900' : 'bg-white shadow-sm'}`}>
              <Award className="text-yellow-500 shrink-0" />
              <div>
                <h4 className="font-bold">Internship Hub</h4>
                <p className="text-sm text-slate-500">Logbooks & Placement Guides</p>
              </div>
            </div>
            {/* ... other specialist cards ... */}
          </div>
        </section>
      </main>

      <footer className="text-center py-10 opacity-50 text-sm">
        © 2025 GHABSA-UHAS Digital Vault.
      </footer>
    </div>
  );
};

export default GHABSAVault;
