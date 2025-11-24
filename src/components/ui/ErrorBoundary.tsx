// src/ui/ErrorBoundary.tsx
"use client";
import { Component, ReactNode } from "react";

type Props = { children: ReactNode };

export default class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    // log to monitoring
    // console.error(error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-md bg-red-900/40 border border-red-800">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-slate-300">Try refreshing or contact the dev.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
