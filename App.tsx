import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AspectRatio, ImageStyle, Device, ImagenModel } from './types';
import { generateWallpaper } from './services/geminiService';
import DeviceMockup from './components/DeviceMockup';
import LeftSidebar, { DEVICES } from './components/LeftSidebar';
import { HamburgerIcon } from './components/icons/MenuIcons';
import { ArrowUpIcon } from './components/icons/SendIcon';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [imageStyle, setImageStyle] = useState<ImageStyle>('Default');
  const [selectedDevice, setSelectedDevice] = useState<Device>(DEVICES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // New settings state
  const [model, setModel] = useState<ImagenModel>('imagen-4.0-generate-001');
  const [apiKey, setApiKey] = useState<string>('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto'; // Reset height to recalculate
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);


  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateWallpaper(prompt, aspectRatio, imageStyle, model, apiKey);
      setGeneratedImage(imageUrl);
    } catch (err) {
      let finalErrorMessage = "An unexpected error occurred. Please try again.";
      if (err instanceof Error) {
          const rawMessage = err.message;
          const jsonPrefix = "Gemini API Error: ";
          if (rawMessage.startsWith(jsonPrefix)) {
              try {
                  const jsonStr = rawMessage.substring(jsonPrefix.length);
                  const errorObj = JSON.parse(jsonStr);
                  finalErrorMessage = errorObj?.error?.message || jsonStr;
              } catch (e) {
                  finalErrorMessage = rawMessage; // fallback to full message if not valid JSON
              }
          } else {
              finalErrorMessage = rawMessage;
          }
      }
      console.error(err);
      setError(finalErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, imageStyle, isLoading, model, apiKey]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleGenerate();
    }
  };
  
  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    // Create a filename based on the prompt
    const safePrompt = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `wallpaper_${safePrompt || 'generated'}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, prompt]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-200 to-gray-300 font-sans text-gray-800 overflow-hidden">
      {error && (
        <div className="absolute top-4 right-4 bg-red-500/90 text-white text-sm font-semibold p-3 rounded-lg shadow-2xl z-50 animate-fade-in max-w-sm">
          {error}
        </div>
      )}

      {/* --- Hamburger Menu Button --- */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 bg-gray-800 hover:bg-gray-700 text-white font-bold w-10 h-10 rounded-lg transition-colors duration-300 focus:outline-none shadow-md flex items-center justify-center"
        aria-label="Open controls"
      >
        <HamburgerIcon className="w-6 h-6" />
      </button>

      {/* --- Unified Sidebar --- */}
      <LeftSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        imageStyle={imageStyle}
        setImageStyle={setImageStyle}
        selectedDevice={selectedDevice}
        setSelectedDevice={setSelectedDevice}
        generatedImage={generatedImage}
        onDownload={handleDownload}
        model={model}
        setModel={setModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col h-full min-h-screen">
        {/* Preview Area */}
        <main className="flex-1 relative p-4 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <DeviceMockup 
              imageUrl={generatedImage} 
              isLoading={isLoading} 
              device={selectedDevice}
            />
          </div>
        </main>

        {/* Prompt and Button Container */}
        <footer className="p-2 sm:p-4 sm:pb-8 bg-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white/70 backdrop-blur-sm border border-gray-900/10 rounded-2xl shadow-lg py-5">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your wallpaper... (e.g., a crystal fox in a bioluminescent forest)"
                disabled={isLoading}
                rows={1}
                className="w-full bg-transparent border-none rounded-2xl px-5 pr-[60px] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 transition-opacity duration-150 disabled:opacity-50 resize-none overflow-y-auto"
                style={{ minHeight: '64px', maxHeight: '104px' }}
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold w-10 h-10 rounded-lg transition-colors duration-300 focus:outline-none shadow-md flex items-center justify-center"
                aria-label="Generate Wallpaper"
              >
                <ArrowUpIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;