import React from 'react';
import type { Device } from '../types';
import { SparkleIcon } from './icons/GeminiIcon';

interface DeviceMockupProps {
  imageUrl: string | null;
  isLoading: boolean;
  device: Device;
}

// --- Reusable Overlay Components ---
const ScreenOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute inset-0 flex items-center justify-center text-center p-4 z-10 text-slate-400">
    {children}
  </div>
);

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-10 w-10 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Device Specific Features ---
// Dynamic island is part of the screen, so it's black.
const DynamicIsland: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <div className={`
    absolute top-4 left-1/2 -translate-x-1/2
    w-24 h-6 bg-black rounded-full z-20
    transition-opacity duration-300
    ${isVisible ? 'opacity-100' : 'opacity-0'}
  `} />
);

// Tablet camera should match the device body/frame color.
const TabletCamera: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <div className={`
    absolute top-2.5 left-1/2 -translate-x-1/2
    w-2.5 h-2.5 bg-zinc-900 rounded-full
    transition-opacity duration-300
    flex items-center justify-center
    ${isVisible ? 'opacity-100' : 'opacity-0'}
  `}>
    <div className="w-1 h-1 bg-zinc-700 rounded-full" />
  </div>
);

// Laptop notch should also match the device body/frame color.
const LaptopNotch: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <div className={`
    absolute top-0 left-1/2 -translate-x-1/2
    w-32 h-5 bg-zinc-800 rounded-b-lg z-20
    transition-opacity duration-300
    flex justify-center items-center pt-0.5
    ${isVisible ? 'opacity-100' : 'opacity-0'}
  `}>
    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
  </div>
);

// Laptop base with a straight top and curved bottom, faking depth with gradients.
const LaptopBase: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
    <div
      className={`
        absolute top-full -mt-1 left-1/2 -translate-x-1/2 w-[110%] h-3.5 
        transition-all duration-500 ease-in-out
        origin-top
        ${isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
      `}
    >
      <div className="relative h-full w-full">
        {/* Main body with a curved bottom. No 3D transform. */}
        <div className="h-full w-full bg-zinc-700 rounded-b-xl" />
        
        {/* A subtle gradient on top to simulate a light source and give a hint of depth. */}
        <div className="absolute inset-x-0 top-0 h-1 bg-zinc-600" />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-zinc-500/50 to-transparent" />
        
        {/* A darker bottom edge to add more depth. */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Simplified rubber feet */}
        <div className="absolute -bottom-px left-5 w-1.5 h-1.5 bg-black/20 rounded-full" />
        <div className="absolute -bottom-px right-5 w-1.5 h-1.5 bg-black/20 rounded-full" />
      </div>
    </div>
);


// --- Device Frame Components ---
const PhoneFrame: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="relative w-[300px] h-[615px] bg-zinc-800 rounded-[48px] p-2.5 shadow-2xl animate-fade-in">
    <div className="relative w-full h-full bg-black rounded-[38px] overflow-hidden">
      {children}
      <DynamicIsland isVisible={true} />
    </div>
  </div>
);

const TabletFrame: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="relative w-[500px] h-[666px] bg-zinc-800 rounded-[28px] p-2.5 shadow-2xl animate-fade-in">
    <div className="relative w-full h-full bg-black rounded-[18px] overflow-hidden">
      {children}
    </div>
    <TabletCamera isVisible={true} />
  </div>
);

const LaptopFrame: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="relative w-[800px] h-[500px] animate-fade-in">
    {/* Screen Part */}
    <div className="relative w-full h-full bg-zinc-800 rounded-2xl p-2.5 shadow-2xl z-10">
      <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
        {children}
        <LaptopNotch isVisible={true} />
      </div>
    </div>
    {/* Base Part */}
    <LaptopBase isVisible={true} />
  </div>
);


const DeviceMockup: React.FC<DeviceMockupProps> = ({ imageUrl, isLoading, device }) => {
  const renderDevice = () => {
    const screenContent = (
      <>
        {isLoading && <ScreenOverlay><LoadingSpinner /></ScreenOverlay>}
        {!isLoading && imageUrl && <img src={imageUrl} alt="Generated wallpaper" className="w-full h-full object-cover" />}
        {!isLoading && !imageUrl && (
          <ScreenOverlay>
            <SparkleIcon className="w-16 h-16 text-zinc-600 opacity-75" />
          </ScreenOverlay>
        )}
      </>
    );

    switch (device.model) {
      case 'phone':
        return <PhoneFrame>{screenContent}</PhoneFrame>;
      case 'tablet':
        return <TabletFrame>{screenContent}</TabletFrame>;
      case 'laptop':
        return <LaptopFrame>{screenContent}</LaptopFrame>;
      default:
        return null;
    }
  };
  
  const scaleClasses = {
    phone: 'scale-[.8] sm:scale-[.85] md:scale-90 lg:scale-95 xl:scale-100',
    tablet: 'scale-[.65] sm:scale-[.70] md:scale-85 lg:scale-95 xl:scale-100',
    laptop: 'scale-[.4] sm:scale-[.65] md:scale-80 lg:scale-90 xl:scale-100',
  };

  return (
    <div className={`relative flex items-center justify-center transition-all duration-500 ease-in-out transform ${scaleClasses[device.model]}`}>
      {renderDevice()}
    </div>
  );
};

export default DeviceMockup;