import { useState } from "react";
import { Link } from "react-router-dom";
import { Info, X } from "lucide-react";

export default function Footer() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {/* Botón de Información */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="fixed bottom-6 right-6 z-50 p-3 bg-accent text-on-accent rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20 group"
                aria-label="Toggle information"
            >
                {isExpanded ? (
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                    <Info size={24} />
                )}
            </button>

            {/* Footer Extensible */}
            <footer
                className={`fixed bottom-0 left-0 w-full bg-accent/95 backdrop-blur-md text-on-accent transition-all duration-500 ease-in-out z-40 transform ${isExpanded ? "translate-y-0 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.3)]" : "translate-y-full"
                    } border-t border-white/10`}
            >
                <div className="py-10 px-6">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <span className="font-bold text-2xl tracking-tighter mb-2">fl/AI\ght</span>
                            <p className="text-sm opacity-60">© {new Date().getFullYear()} TFG. Innovating the way you fly.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                            <Link to="/about" onClick={() => setIsExpanded(false)} className="text-sm font-medium hover:opacity-70 transition-opacity">About us</Link>
                            <Link to="/contact" onClick={() => setIsExpanded(false)} className="text-sm font-medium hover:opacity-70 transition-opacity">Contact</Link>
                            <Link to="/privacy" onClick={() => setIsExpanded(false)} className="text-sm font-medium hover:opacity-70 transition-opacity">Privacy Policy</Link>
                            <Link to="/terms" onClick={() => setIsExpanded(false)} className="text-sm font-medium hover:opacity-70 transition-opacity">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Overlay para cerrar al hacer clic fuera */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
                    onClick={() => setIsExpanded(false)}
                />
            )}
        </>
    );
}
