import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import Dropdown from "@/components/ui/Dropdown";
import {
    ChevronDown,
    MoreHorizontal,
    Sun,
    Moon,
    Monitor,
    Palette
} from "lucide-react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();

    // Estados para los menús
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
    const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);

    const themeIcons = {
        light: <Sun size={14} />,
        dark: <Moon size={14} />,
        system: <Monitor size={14} />
    };

    const themeLabels = {
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema'
    };

    return (
        <nav className="flex justify-center bg-primary h-16 py-2 px-4 shadow-sm border-b border-themed relative z-50">
            <div className="flex flex-1 items-center justify-start gap-4">
                <Link to="/" className="cursor-pointer text-primary hover:text-accent transition-colors font-medium">Explore</Link>
            </div>

            <div className="flex flex-1 items-center justify-center">
                <span className="text-secondary font-bold text-xl tracking-tighter">fl/AI\ght</span>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
                {/* More Options Menu */}
                <Dropdown
                    isOpen={isOptionsMenuOpen}
                    onOpenChange={(open) => {
                        setIsOptionsMenuOpen(open);
                        if (open) {
                            setIsThemeSubmenuOpen(false);
                        }
                    }}
                    trigger={
                        <div className="w-9 h-9 flex items-center justify-center bg-secondary hover:bg-secondary/80 border border-themed rounded-full text-primary transition-all active:scale-90">
                            <MoreHorizontal size={20} />
                        </div>
                    }
                >
                    <div className="p-1">
                        {!isThemeSubmenuOpen ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsThemeSubmenuOpen(true);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-secondary rounded-xl transition-colors cursor-pointer group text-left font-medium"
                            >
                                <div className="flex items-center gap-3">
                                    <Palette size={16} className="group-hover:text-accent transition-colors" />
                                    Tema
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-secondary opacity-60 font-bold">
                                    {themeLabels[theme as keyof typeof themeLabels]}
                                    <ChevronDown size={12} className="-rotate-90" />
                                </div>
                            </button>
                        ) : (
                            <div className="flex flex-col">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsThemeSubmenuOpen(false);
                                    }}
                                    className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-secondary font-bold hover:text-accent transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                    <ChevronDown size={12} className="rotate-90" />
                                    Volver
                                </button>
                                {(['light', 'dark', 'system'] as const).map((t) => (
                                    <button
                                        key={t}
                                        disabled={t === 'system'}
                                        onClick={() => {
                                            if (t !== 'system') {
                                                setTheme(t as any);
                                                setIsOptionsMenuOpen(false);
                                                setIsThemeSubmenuOpen(false);
                                            }
                                        }}
                                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors group ${t === 'system'
                                            ? 'opacity-30 cursor-not-allowed grayscale'
                                            : theme === t
                                                ? 'bg-accent/10 text-accent cursor-pointer'
                                                : 'text-secondary hover:text-primary hover:bg-secondary cursor-pointer'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {(themeIcons as any)[t]}
                                            {(themeLabels as any)[t]}
                                            {t === 'system' && (
                                                <span className="text-[8px] bg-secondary/10 px-1 rounded uppercase tracking-tighter">Soon</span>
                                            )}
                                        </div>
                                        {t !== 'system' && theme === t && <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Dropdown>
            </div>
        </nav>
    );
}
