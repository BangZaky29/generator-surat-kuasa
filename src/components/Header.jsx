import React from 'react';
import { FileSignature } from 'lucide-react';
import logo from '../assets/NS_white_01.png';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm print-hidden transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Left Side: Logo & Title */}
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            {/* Logo Container - Adjusted size to fit header properly */}
            <div className="shrink-0 relative group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback Icon (Hidden by default unless img error) */}
                <div className="hidden text-indigo-600 bg-indigo-50 w-full h-full items-center justify-center">
                  <FileSignature className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <h1 className="text-base md:text-xl font-bold text-slate-800 tracking-tight truncate leading-tight">
                Generator Surat Kuasa
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium hidden sm:block truncate">
                Buat surat kuasa resmi dengan cepat & mudah
              </p>
            </div>
          </div>

          {/* Right Side: Badge */}
          <div className="shrink-0 pl-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm whitespace-nowrap">
              Gratis & Aman
            </span>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;