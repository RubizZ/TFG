import React, { Component, ErrorInfo, ReactNode } from "react";
import { TriangleAlert, RefreshCcw, Home } from "lucide-react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="w-full min-h-screen flex items-center justify-center p-6 bg-primary relative overflow-hidden group">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />

                    <div className="max-w-md w-full text-center space-y-8 relative z-10 transition-all duration-500">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full scale-150 animate-pulse" />
                            <div className="relative bg-secondary p-6 rounded-full border border-red-500/20 shadow-2xl">
                                <TriangleAlert size={48} className="text-red-500" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-primary tracking-tight">Vuelo interrumpido</h2>
                            <p className="text-secondary leading-relaxed">
                                Parece que hemos encontrado una turbulencia inesperada en el sistema al intentar mostrar esta página.
                            </p>
                        </div>

                        {/* Error detail (optional, subtle) */}
                        {this.state.error && (
                            <div className="bg-secondary/50 border border-red-500/10 rounded-xl p-3 text-left overflow-hidden">
                                <p className="text-[10px] font-mono text-red-500/70 truncate">
                                    Error: {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 px-6 py-3 bg-accent text-on-accent rounded-full font-semibold hover:bg-accent-hover transition-all duration-300 shadow-md active:scale-95 group/btn cursor-pointer"
                            >
                                <RefreshCcw size={18} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                                Recargar la pagina
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-full border border-themed hover:bg-secondary/80 transition-all duration-300 active:scale-95 cursor-pointer"
                            >
                                <Home size={18} />
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
