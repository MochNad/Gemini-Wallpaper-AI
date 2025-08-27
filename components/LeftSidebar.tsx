import React from 'react';
import type { AspectRatio, ImageStyle, Device, ImagenModel } from '../types';
import { CloseIcon, ChevronDownIcon, DownloadIcon } from './icons/MenuIcons';

export const DEVICES: Device[] = [
  { name: 'Phone', model: 'phone', screenAspectRatio: 9 / 19.5 },
  { name: 'Tablet', model: 'tablet', screenAspectRatio: 3 / 4 },
  { name: 'Laptop', model: 'laptop', screenAspectRatio: 16 / 10 },
];

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  imageStyle: ImageStyle;
  setImageStyle: (style: ImageStyle) => void;
  selectedDevice: Device;
  setSelectedDevice: (device: Device) => void;
  generatedImage: string | null;
  onDownload: () => void;
  model: ImagenModel;
  setModel: (model: ImagenModel) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ControlWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-600">{title}</label>
    {children}
  </div>
);

const LeftSidebar: React.FC<LeftSidebarProps> = (props) => {
  const { 
    isOpen, onClose,
    aspectRatio, setAspectRatio, 
    imageStyle, setImageStyle, 
    selectedDevice, setSelectedDevice,
    generatedImage, onDownload,
    model, setModel,
    apiKey, setApiKey,
  } = props;

  const styles: ImageStyle[] = ['Default', 'Photorealistic', 'Anime', 'Cyberpunk', 'Fantasy', 'Minimalist', 'Abstract'];
  const models: ImagenModel[] = ['imagen-4.0-generate-001', 'imagen-4.0-ultra-generate-001', 'imagen-4.0-fast-generate-001'];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50
    w-72 bg-white/80 backdrop-blur-xl border-r border-gray-900/10 shadow-lg
    flex flex-col
    transition-transform transform
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;
  
  return (
    <>
      {/* Backdrop for all screen sizes */}
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />}
      
      <aside className={sidebarClasses}>
        {/* --- FIXED HEADER --- */}
        <div className="p-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-300/80">
            <h1 className="text-xl font-bold text-gray-900">Wallpaper AI</h1>
            <button onClick={onClose} className="p-1" aria-label="Close controls">
                <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-5">Generation</h2>
            <div className="space-y-5">
                <ControlWrapper title="Ratio">
                <div className="flex items-center bg-gray-200 rounded-lg p-1 w-full">
                    <button onClick={() => setAspectRatio('9:16')} className={`w-1/2 py-1.5 text-xs font-bold rounded-md transition-colors ${aspectRatio === '9:16' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-300'}`}>9:16 (Vertical)</button>
                    <button onClick={() => setAspectRatio('16:9')} className={`w-1/2 py-1.5 text-xs font-bold rounded-md transition-colors ${aspectRatio === '16:9' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-300'}`}>16:9 (Horizontal)</button>
                </div>
                </ControlWrapper>
                <ControlWrapper title="Style">
                <div className="relative w-full">
                    <select 
                    value={imageStyle} 
                    onChange={(e) => setImageStyle(e.target.value as ImageStyle)} 
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                    >
                    {styles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                </ControlWrapper>
            </div>
          </section>
          
          <hr className="border-gray-300/80" />

          <section>
              <h2 className="text-lg font-bold text-gray-800 mb-5">Device</h2>
              <div className="space-y-5">
                <ControlWrapper title="Type">
                    <div className="flex items-center bg-gray-200 rounded-lg p-1 w-full">
                        {DEVICES.map(device => (
                            <button 
                                key={device.name} 
                                onClick={() => setSelectedDevice(device)}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${selectedDevice.name === device.name ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-300'}`}
                            >
                                {device.name}
                            </button>
                        ))}
                    </div>
                </ControlWrapper>
              </div>
          </section>

          <hr className="border-gray-300/80" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-5">Setting</h2>
            <div className="space-y-5">
                <ControlWrapper title="Model">
                    <div className="relative w-full">
                        <select 
                            value={model} 
                            onChange={(e) => setModel(e.target.value as ImagenModel)} 
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                        >
                            {models.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </ControlWrapper>
                <ControlWrapper title="API Key">
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Optional: Use your own key"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                </ControlWrapper>
            </div>
          </section>
        </div>

        {/* --- FIXED FOOTER --- */}
        <div className="p-4 border-t border-gray-300/80">
            <div className="space-y-3">
                <p className="text-xs text-gray-500 text-center px-2">
                    For the best result, set the downloaded image to "fill screen" in your device's wallpaper settings.
                </p>
                <button
                    onClick={onDownload}
                    disabled={!generatedImage}
                    className="w-full bg-gray-800 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    aria-label="Download Wallpaper"
                >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Download</span>
                </button>
            </div>
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;