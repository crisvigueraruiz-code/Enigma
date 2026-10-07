import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetSession = () => {
    try {
      localStorage.removeItem('enigma_active_session');
    } catch {}
    window.location.href = '/';
  };

  private handleClearAllAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#142016] text-stone-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1A261D] border border-amber-600/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 mx-auto flex items-center justify-center text-amber-400 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-adventure text-xl sm:text-2xl font-bold text-amber-200">
                La senda se ha oscurecido
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Se ha producido un error inesperado al procesar la expedición. Puedes recuperar el control de la brújula inmediatamente.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/50 border border-stone-800 text-left font-mono text-[11px] text-red-300/90 overflow-x-auto max-h-32">
                <p className="font-bold">{this.state.error.name}: {this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleResetSession}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-600 hover:to-green-500 text-white font-adventure text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-emerald-200" />
                <span>Volver al Menú Principal</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearAllAndReload}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Restablecer Datos Locales y Recargar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
