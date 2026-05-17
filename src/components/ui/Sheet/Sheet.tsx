import * as Dialog from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export const SheetPortal = Dialog.Portal;

export const SheetOverlay = forwardRef<
  ElementRef<typeof Dialog.Overlay>,
  ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] data-[state=closed]:animate-none',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

export const SheetContent = forwardRef<
  ElementRef<typeof Dialog.Content>,
  ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        'fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col gap-8 overflow-y-auto overscroll-contain bg-[var(--color-surface)] px-6 py-7 shadow-[var(--shadow-card-hover)] outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </Dialog.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
