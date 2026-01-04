import { Github, Heart, X, Info } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600/20 rounded-lg">
                            <Info className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">About RadShare</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <p className="text-zinc-300 leading-relaxed text-center">
                            Thank you for choosing <span className="text-purple-400 font-bold">RadShare Helper</span>!
                            I hope this tool simplifies your Void farming experience.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <a
                            href="https://github.com/taurinexd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-all group"
                        >
                            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Follow me on GitHub
                        </a>

                        <a
                            href="https://www.paypal.com/paypalme/mmtaurine"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-900/20 group"
                        >
                            <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                            Support development
                        </a>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                        <div className="text-[10px] text-zinc-500 leading-tight space-y-2">
                            <p className="font-bold opacity-80 uppercase tracking-widest">Legal Disclaimer</p>
                            <p>
                                RadShare Helper is a fan-made tool and is NOT affiliated with, authorized, maintained, sponsored or endorsed by Digital Extremes or Warframe.
                            </p>
                            <p>
                                Warframe, all associated logos, and designs are registered trademarks of Digital Extremes. All data is provided by the Warframe Community.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-zinc-800/30 text-center">
                    <p className="text-xs text-zinc-500 font-mono">v1.0.0 • Created by taurinexd</p>
                </div>
            </div>
        </div>
    );
}
