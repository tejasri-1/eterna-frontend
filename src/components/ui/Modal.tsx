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
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />

      <Dialog.Content
        className={clsx(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[min(95%,520px)] rounded-2xl bg-surface p-6 shadow-2xl",
          "border border-white/10 data-[state=open]:animate-scale-in",
          className
        )}
      >
        {title && (
          <Dialog.Title className="text-lg font-semibold mb-4">
            {title}
          </Dialog.Title>
        )}

        {children}

        <Dialog.Close className="mt-6 px-3 py-1 rounded-md bg-white/10 text-sm">
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
