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
      'fixed inset-0 z-40 bg-[var(--color-scrim)] backdrop-blur-[2px] data-[state=closed]:animate-none',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

type SheetContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> & {
  variant?: 'side' | 'center';
};

export const SheetContent = forwardRef<ElementRef<typeof Dialog.Content>, SheetContentProps>(
  ({ className, children, variant = 'side', ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          variant === 'center'
            ? 'fixed left-1/2 top-1/2 z-50 flex w-[min(calc(100vw-var(--page-padding-x)*2),560px)] max-h-[min(90dvh,820px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-8 overflow-y-auto overscroll-contain rounded-[var(--radius-xl)] bg-[var(--color-surface)] px-5 py-6 shadow-[var(--shadow-card-hover)] outline-none sm:px-6 sm:py-7'
            : // top-0 h-[100dvh] вместо inset-y-0: на мобиле inset-y-0 тянется на высоту
              // layout-вьюпорта (с адресной строкой), и низ листа (кнопки в footer) уходил
              // под кромку браузера — «кнопок снизу не видно». dvh = по видимой высоте.
              'fixed top-0 right-0 h-[100dvh] z-50 flex w-[min(88vw,360px)] flex-col gap-8 overflow-y-auto overscroll-contain bg-[var(--color-surface)] px-6 py-7 shadow-[var(--shadow-card-hover)] outline-none',
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = 'SheetContent';

export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
