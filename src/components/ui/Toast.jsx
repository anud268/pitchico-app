import React from 'react';

export default function Toast({ toast }) {
  return (
    <div className={`fixed bottom-8 right-8 bg-dark text-white px-8 py-4 rounded shadow-2xl z-[2000] transition-all duration-400 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
      {toast.message}
    </div>
  );
}
