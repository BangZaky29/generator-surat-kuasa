import React from 'react';
import { Eye, Edit3 } from 'lucide-react';

const FloatingToggle = ({ viewMode, toggleView }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden fab-container print-hidden">
      <button
        onClick={toggleView}
        className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {viewMode === 'form' ? (
          <Eye className="w-6 h-6" />
        ) : (
          <Edit3 className="w-6 h-6" />
        )}
      </button>
      <span className="absolute right-16 top-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {viewMode === 'form' ? 'Lihat Surat' : 'Edit Data'}
      </span>
    </div>
  );
};

export default FloatingToggle;