import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AccordionSection = ({ title, icon: Icon, children, isOpen = false }) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden mb-4 transition-all duration-200 hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
          <span className="font-semibold text-slate-700">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      
      {open && (
        <div className="px-5 py-5 border-t border-slate-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;