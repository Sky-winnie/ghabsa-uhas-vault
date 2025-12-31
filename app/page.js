"use client";
import './globals.css';
import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Folder, Microscope, Award, BookOpen, Loader2 } from 'lucide-react';

export default function GHABSAVault() {
  const [darkMode, setDarkMode] = useState(true);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFolders() {
      try {
        const response = await fetch('/api/drive');
        const data = await response.json();
        if (!data.error) setFolders(data);
      } catch (err) {
        console.error("Failed to load folders");
      } finally {
        setLoading(false);
      }
    }
    fetchFolders();
  }, []);

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} min-h-screen transition-colors duration-300`}>
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">BMB</div>
          <span className="font-bold text-xl hidden sm:block">GHABSA-UHAS <span className="text-green-500">Vault</span></span>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-500">Health for Development.</h1>
        <p className="text-lg text-slate-400 mb-8">Access the official BMB resource repository synced with Google Drive.</p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-500" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <div key={folder.id} className={`p-8 rounded-3xl cursor-pointer transition-all hover:-translate-y-2 shadow-xl ${darkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white hover:bg-slate-100'}`}>
                <Folder className="mb-4 text-green-500" size={32} />
                <h3 className="text-2xl font-bold">{folder.name.replace(/^\d+_/, '')}</h3>
                <p className="text-sm text-slate-500 mt-2">Click to view materials</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
