import { useState, useEffect } from 'react';
import { Smartphone, Tablet, X } from 'lucide-react';

const DevicePreview = ({ children }) => {
    const [enabled, setEnabled] = useState(false);
    const [device, setDevice] = useState('iphone'); // iphone, android, tablet, desktop

    // Check if we are inside an iframe
    const isIframe = window.self !== window.top;

    if (isIframe) {
        return <>{children}</>;
    }

    if (!enabled) {
        return (
            <>
                <div className="fixed bottom-4 right-4 z-[9999]">
                    <button onClick={() => setEnabled(true)}>
                        Dev Preview
                    </button>
                </div>
                {children}
            </>
        );
    }

    const getDimensions = () => {
        switch (device) {
            case 'iphone': return { width: '390px', height: '844px', borderRadius: '40px' };
            case 'android': return { width: '412px', height: '915px', borderRadius: '24px' };
            case 'tablet': return { width: '768px', height: '1024px', borderRadius: '16px' };
            case 'desktop': return { width: '1440px', height: '900px', borderRadius: '8px' };
            default: return { width: '100%', height: '100%', borderRadius: '0' };
        }
    };

    return (
        <div className="fixed inset-0 bg-[#050505] z-[10000] flex flex-col">
            <div className="bg-[#111] border-b border-gray-800 p-4 flex items-center justify-between">
                <div className="flex space-x-3 overflow-x-auto custom-scrollbar pb-1">
                    <button onClick={() => setDevice('iphone')} className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex flex-col items-center justify-center min-w-[80px] ${device === 'iphone' ? 'bg-[#d4af37] text-black' : 'bg-black text-gray-400 border border-gray-800 hover:border-[#d4af37]/50'}`}><Smartphone className="w-5 h-5 mb-1" /> iPhone</button>
                    <button onClick={() => setDevice('android')} className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex flex-col items-center justify-center min-w-[80px] ${device === 'android' ? 'bg-[#d4af37] text-black' : 'bg-black text-gray-400 border border-gray-800 hover:border-[#d4af37]/50'}`}><Smartphone className="w-5 h-5 mb-1" /> Android</button>
                    <button onClick={() => setDevice('tablet')} className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex flex-col items-center justify-center min-w-[80px] ${device === 'tablet' ? 'bg-[#d4af37] text-black' : 'bg-black text-gray-400 border border-gray-800 hover:border-[#d4af37]/50'}`}><Tablet className="w-5 h-5 mb-1" /> Tablet</button>
                    <button onClick={() => setDevice('desktop')} className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex flex-col items-center justify-center min-w-[80px] ${device === 'desktop' ? 'bg-[#d4af37] text-black' : 'bg-black text-gray-400 border border-gray-800 hover:border-[#d4af37]/50'}`}>Desktop</button>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden sm:block text-right">
                        <p className="text-[#d4af37] font-black uppercase tracking-widest text-[10px]">Viewport Mode</p>
                        <p className="text-gray-500 text-[10px] font-mono">{getDimensions().width} x {getDimensions().height}</p>
                    </div>
                    <button onClick={() => setEnabled(false)} className="text-gray-400 hover:text-white p-3 bg-red-900/30 hover:bg-red-600 rounded-xl transition-colors shrink-0"><X className="w-6 h-6" /></button>
                </div>
            </div>
            <div className="flex-1 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-gray-900 flex items-center justify-center p-8">
                <div
                    className="bg-[#050505] border-[8px] border-gray-800 overflow-hidden transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,1)] relative flex-shrink-0"
                    style={{
                        width: getDimensions().width,
                        height: getDimensions().height,
                        borderRadius: getDimensions().borderRadius
                    }}
                >
                    <iframe
                        // Add a timestamp query or simply pass the href, React router will handle the path.
                        // Wait, if it's hash router or browse router, window.location.pathname+search works.
                        src={`${window.location.pathname}${window.location.search}`}
                        className="w-full h-full border-none bg-[#050505]"
                        title="Device Preview"
                    />
                </div>
            </div>
        </div>
    );
};

export default DevicePreview;
