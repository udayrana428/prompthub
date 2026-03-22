"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  contentId: string;
};

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

const useDropdownMenuContext = () => {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error(
      "DropdownMenu components must be used inside DropdownMenu.",
    );
  }

  return context;
};

const composeRefs = <T,>(...refs: Array<React.Ref<T> | undefined>) => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      (ref as React.MutableRefObject<T | null>).current = node;
    });
  };
};

function DropdownMenu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: React.PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const contentId = React.useId();

  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange],
  );

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (
        target &&
        !triggerRef.current?.contains(target) &&
        !contentRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen]);

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, triggerRef, contentRef, contentId }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuPortal({
  children,
  container,
}: React.PropsWithChildren<{ container?: HTMLElement | null }>) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(children, container ?? document.body);
}

function DropdownMenuTrigger({
  asChild = false,
  children,
  onClick,
  ...props
}: React.PropsWithChildren<React.ComponentProps<"button"> & {
  asChild?: boolean;
}>) {
  const { open, setOpen, triggerRef, contentId } = useDropdownMenuContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event as never);
    if (!event.defaultPrevented) {
      setOpen(!open);
    }
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement & {
      ref?: React.Ref<HTMLElement>;
      props: { onClick?: React.MouseEventHandler<HTMLElement> };
    };

    return React.cloneElement(child, {
      ...props,
      "data-slot": "dropdown-menu-trigger",
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": contentId,
      ref: composeRefs(child.ref, (node: HTMLElement | null) => {
        triggerRef.current = node;
      }),
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(event);
        if (!event.defaultPrevented) {
          handleClick(event);
        }
      },
    });
  }

  return (
    <button
      data-slot="dropdown-menu-trigger"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={contentId}
      ref={(node: HTMLElement | null) => {
        triggerRef.current = node;
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  align = "center",
  container,
  inPortal = true,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  sideOffset?: number;
  align?: "start" | "center" | "end";
  inPortal?: boolean;
  container?: HTMLElement | null;
}) {
  const { open, setOpen, triggerRef, contentRef, contentId } =
    useDropdownMenuContext();
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const contentRect = contentRef.current!.getBoundingClientRect();
      const viewportPadding = 8;

      let left = triggerRect.left;

      if (align === "center") {
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      }

      if (align === "end") {
        left = triggerRect.right - contentRect.width;
      }

      let top = triggerRect.bottom + sideOffset;

      if (top + contentRect.height > window.innerHeight - viewportPadding) {
        top = triggerRect.top - contentRect.height - sideOffset;
      }

      setPosition({
        left: Math.max(
          viewportPadding,
          Math.min(
            left,
            window.innerWidth - contentRect.width - viewportPadding,
          ),
        ),
        top: Math.max(
          viewportPadding,
          Math.min(
            top,
            window.innerHeight - contentRect.height - viewportPadding,
          ),
        ),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, open, sideOffset, triggerRef]);

  if (!open) {
    return null;
  }

  const content = (
    <div
      id={contentId}
      ref={contentRef}
      role="menu"
      data-slot="dropdown-menu-content"
      className={cn(
        "fixed z-[9999] min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-xl",
        className,
      )}
      style={{
        top: position.top,
        left: position.left,
        ...style,
      }}
      {...props}
    />
  );

  return inPortal ? (
    <DropdownMenuPortal container={container}>{content}</DropdownMenuPortal>
  ) : (
    content
  );
}

function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="dropdown-menu-group" className={className} {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  asChild = false,
  onClick,
  onSelect,
  disabled,
  ...props
}: React.ComponentProps<"button"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  asChild?: boolean;
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  const { setOpen } = useDropdownMenuContext();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      role="menuitem"
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/10",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      disabled={disabled}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event as never);
        onSelect?.(event);

        if (!event.defaultPrevented && !disabled) {
          setOpen(false);
        }
      }}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem> & {
  checked?: boolean;
}) {
  return (
    <DropdownMenuItem className={cn("pl-8", className)} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked ? <CheckIcon className="size-4" /> : null}
      </span>
      {children}
    </DropdownMenuItem>
  );
}

function DropdownMenuRadioGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-radio-group"
      className={className}
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem className={cn("pl-8", className)} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <CircleIcon className="size-2 fill-current" />
      </span>
      {children}
    </DropdownMenuItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean;
}) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem className={className} {...props}>
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuItem>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-[9999] min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
