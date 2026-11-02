import React from 'react';

export const MascotScene = () => {
  return (
    <section className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px] lg:min-h-[500px]" data-purpose="mascot-3d-scene">
      {/* Ambient Radial Glow behind Mascot */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-300/30 to-orange-400/25 blur-3xl -z-10"></div>

      {/* Floating Green Herbal Leaves & Petals */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-10 left-12 w-4 h-7 bg-mascot-leaf rounded-full rotate-45 animate-sway-leaf opacity-85 shadow-sm"></div>
        <div className="absolute top-6 right-24 w-3.5 h-6 bg-lime-400 rounded-full -rotate-12 animate-sway-leaf opacity-80" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-28 right-8 w-5 h-8 bg-lime-500 rounded-full rotate-[35deg] animate-sway-leaf opacity-90" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-44 right-16 w-3 h-5 bg-mascot-leaf rounded-full -rotate-[40deg] animate-sway-leaf opacity-75" style={{ animationDelay: '2s' }}></div>
        
        <div className="absolute bottom-16 right-20 w-5 h-8 rounded-full bg-gradient-to-br from-brand-400 to-rose-400 rotate-[48deg] shadow-md animate-sway-leaf" style={{ animationDelay: '1.7s' }}>
          <div className="w-1 h-5 mx-auto bg-white/40 rounded-full mt-1"></div>
        </div>

        <div className="absolute bottom-20 left-16 w-4 h-6 bg-lime-400 rounded-full rotate-[70deg] animate-sway-leaf opacity-80" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-8 left-36 w-3 h-5 bg-mascot-leaf rounded-full -rotate-45 animate-sway-leaf opacity-70" style={{ animationDelay: '0.8s' }}></div>
      </div>

      {/* 3D Character Composition: Monk-Bird Mascot */}
      <div className="relative w-72 sm:w-80 h-80 flex items-center justify-center animate-float-mascot" data-purpose="3d-monk-bird-mascot">
        {/* Soft Drop Shadow below character */}
        <div className="absolute -bottom-6 w-52 h-10 bg-stone-900/15 rounded-full blur-md transform scale-90"></div>

        {/* Mascot Left Wing */}
        <div className="absolute left-1 top-28 w-16 h-10 rounded-full clay-surface rotate-[-15deg] origin-right animate-wing-left shadow-md z-0 border border-orange-200/50"></div>

        {/* Mascot Right Wing */}
        <div className="absolute right-1 top-28 w-16 h-10 rounded-full clay-surface rotate-[15deg] origin-left animate-wing-right shadow-md z-0 border border-orange-200/50"></div>

        {/* Mascot Main Head / Spherical Body Base */}
        <div className="relative w-48 h-56 rounded-[52%_52%_48%_48%_/_60%_60%_40%_40%] clay-surface flex flex-col items-center pt-8 border border-white/60 shadow-mascot z-10 overflow-visible">
          {/* Forehead Bindi Dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm mb-3"></div>

          {/* Face Features: Peaceful Closed Curving Eyes & Beak */}
          <div className="flex items-center gap-6 mt-1 mb-2">
            <svg className="w-4 h-3 text-stone-800" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5" viewBox="0 0 24 16">
              <path d="M3 13 C 8 3, 16 3, 21 13"></path>
            </svg>
            <div className="w-5 h-5 bg-gradient-to-b from-orange-400 to-brand-600 rounded-b-full rounded-t-sm shadow-md transform translate-y-1"></div>
            <svg className="w-4 h-3 text-stone-800" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5" viewBox="0 0 24 16">
              <path d="M3 13 C 8 3, 16 3, 21 13"></path>
            </svg>
          </div>

          {/* Rosy Cheeks */}
          <div className="w-full flex justify-between px-7 -mt-2">
            <div className="w-3.5 h-2 bg-rose-400/35 rounded-full blur-[1px]"></div>
            <div className="w-3.5 h-2 bg-rose-400/35 rounded-full blur-[1px]"></div>
          </div>

          {/* Buddhist Saffron Robe Body Overlay */}
          <div className="absolute bottom-0 w-[105%] h-28 robe-gradient rounded-b-[40px] rounded-t-3xl shadow-xl flex items-center justify-center overflow-hidden z-20">
            <div className="absolute left-6 top-0 bottom-0 w-12 bg-gradient-to-r from-orange-600 to-amber-500 shadow-inner rounded-r-2xl transform -rotate-6"></div>
            <div className="absolute right-4 top-2 bottom-0 w-8 bg-gradient-to-l from-orange-700 to-transparent opacity-60"></div>
            <div className="absolute -right-3 top-4 w-12 h-14 bg-gradient-to-bl from-orange-500 to-orange-700 rounded-full shadow-lg"></div>
          </div>

          {/* Prayer Bead Necklace */}
          <div className="absolute top-[82px] w-[118%] h-24 pointer-events-none z-30 flex items-center justify-center">
            <div className="relative w-56 h-20">
              <div className="bead-item w-5 h-5 rounded-full absolute left-3 top-3"></div>
              <div className="bead-item w-5 h-5 rounded-full absolute left-8 top-7"></div>
              <div className="bead-item w-5 h-5 rounded-full absolute left-14 top-10"></div>
              <div className="bead-item w-5.5 h-5.5 rounded-full absolute left-21 top-12"></div>
              <div className="bead-item w-5.5 h-5.5 rounded-full absolute right-21 top-12"></div>
              <div className="bead-item w-5 h-5 rounded-full absolute right-14 top-10"></div>
              <div className="bead-item w-5 h-5 rounded-full absolute right-8 top-7"></div>
              <div className="bead-item w-5 h-5 rounded-full absolute right-3 top-3"></div>
              <div className="bead-item w-5 h-5 rounded-full absolute left-0 top-0"></div>
              <div className="bead-item w-5 h-5 rounded-full absolute right-0 top-0"></div>
            </div>
          </div>

          {/* Tiny Bird Clay Feet */}
          <div className="absolute -bottom-3 flex gap-8 z-30">
            <div className="flex gap-0.5 items-end">
              <div className="w-1.5 h-3.5 bg-rose-300 rounded-full -rotate-12 shadow-sm"></div>
              <div className="w-1.5 h-4 bg-rose-300 rounded-full shadow-sm"></div>
              <div className="w-1.5 h-3.5 bg-rose-300 rounded-full rotate-12 shadow-sm"></div>
            </div>
            <div className="flex gap-0.5 items-end">
              <div className="w-1.5 h-3.5 bg-rose-300 rounded-full -rotate-12 shadow-sm"></div>
              <div className="w-1.5 h-4 bg-rose-300 rounded-full shadow-sm"></div>
              <div className="w-1.5 h-3.5 bg-rose-300 rounded-full rotate-12 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mascot Zen Quote Tagline */}
      <div className="mt-6 text-center z-10 px-4">
        <p className="font-display font-medium text-stone-700/90 text-sm tracking-wide">
          "Find focus, peace, and security in every login."
        </p>
      </div>
    </section>
  );
};
