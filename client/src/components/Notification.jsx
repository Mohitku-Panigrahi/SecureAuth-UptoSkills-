import React from 'react';

export const Notification = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
  };

  const icons = {
    error: 'fa-solid fa-circle-exclamation',
    success: 'fa-solid fa-circle-check',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info'
  };

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm backdrop-blur-md transition-all ${styles[type] || styles.info}`}>
      <i className={`${icons[type] || icons.info} mt-0.5 shrink-0 text-sm`}></i>
      <div className="flex-1 leading-relaxed">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-stone-400 hover:text-stone-200 transition-colors p-0.5"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </div>
  );
};
