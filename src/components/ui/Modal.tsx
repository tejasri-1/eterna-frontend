// File: src/components/ui/Modal.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import clsx from "clsx";

export function Modal({
  children,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export function ModalTrigger({
  children,
  ...props
}: Dialog.DialogTriggerProps) {
  return (
    <Dialog.Trigger {...props} asChild>
      {children}
    </Dialog.Trigger>
  );
}


export function ModalContent({
  children,
  title,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <Dialog.Content
        className={`fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl ${className}`}
        style={style}
      >
        {title && (
          <div className="text-lg font-semibold mb-3" style={{ color: "black" }}>
            {title}
          </div>
        )}

        <div>{children}</div>

        <Dialog.Close className="absolute right-3 top-3 text-black">✕</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
