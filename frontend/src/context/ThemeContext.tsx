import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );

    useEffect(() => {
        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = (isDark: boolean) => {
            const newTheme = isDark ? 'dark' : 'light';
            setTheme(newTheme);

            root.classList.remove('light', 'dark');
            root.classList.add(newTheme);
        };

        // Initial sync
        updateTheme(mediaQuery.matches);

        // Listen for system changes
        const handleChange = (e: MediaQueryListEvent) => updateTheme(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        // Enable transitions after a short delay
        const timeout = setTimeout(() => {
            root.classList.add('theme-transition');
        }, 100);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
