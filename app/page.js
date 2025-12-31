"use client";

import './globals.css';
import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Folder, BookOpen, Microscope, GraduationCap, Loader2, Waves } from 'lucide-react';

export default function GHABSAVault() {
  const [darkMode, setDarkMode] = useState(true);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Live Folders from Google Drive API
  useEffect(() => {
    async function fetchFolders() {
      try {
        const response = await fetch('/api/drive');
        const data = await response.json();
        if (!data.error) {
          setFolders(data);
        }
      } catch (err) {
        console.error("Failed to load folders");
      } finally {
        setLoading(false);
      }
    }
    fetchFolders();
  }, []);

  // Filter folders based on your search bar input
  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${darkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'} min-h-screen transition-colors duration-300 font-sans`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-green-900/20">BMB</div>
          <span className="font-bold text-xl tracking-tight uppercase">GHABSA-UHAS <span className="text-green-500">Vault</span></span>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10">
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-yellow-200 to-green-500">
          Health for Development.
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Access official Biochemistry & Molecular Biology resources, research data, and past questions—synced directly with the GHABSA Cloud.
        </p>

        {/* Search Bar from your initial UI */}
        <div className="relative max-w-xl mx-auto group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search folders (e.g. Level 300, Flood Research)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </header>

      {/* Main Content: Dynamic Folders */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-green-500" size={40} />
            <p className="text-slate-500 animate-pulse">Connecting to BMB Vault...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFolders.map((folder) => (
              <div 
                key={folder.id} 
                className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                   {folder.name.includes('Research') ? <Waves size={80} /> : <GraduationCap size={80} />}
                </div>
                
                <Folder className="mb-6 text-green-500 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="text-2xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                  {folder.name.replace(/^\d+_/, '')}
                </h3>
                <p className="text-slate-500 text-sm">Click to access materials</p>
                
                <div className="mt-6 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">Cloud Synced</span>
                  {folder.name.includes('300') && <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20">Core Courses</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
