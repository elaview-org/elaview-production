// src/components/ErrorBoundary.tsx
"use client";

import { Component, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: error.stack,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
          <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <AlertCircle className="h-7 w-7 text-red-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3">
              Something went wrong
            </h2>

            <p className="text-slate-400 text-center mb-6">
              We encountered an unexpected error. Please try reloading the page.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className="text-xs font-mono text-red-400 mb-2">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs text-slate-500 overflow-auto max-h-40">
                    {this.state.errorInfo}
                  </pre>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Reload Page
              </button>

              <button
                onClick={this.handleReset}
                className="w-full px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
