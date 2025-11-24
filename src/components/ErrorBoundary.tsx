"use client";
import React from "react";

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: any, info: any) {
    console.error("App crashed:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-red-400">
              Something went wrong.
            </h2>
            <p className="mt-2 text-sm text-red-300">
              The token table failed to render.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
