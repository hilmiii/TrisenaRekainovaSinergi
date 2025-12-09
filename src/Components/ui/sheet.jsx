import React from "react";
import { cva } from "class-variance-authority"; // Pastikan install: npm i class-variance-authority
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SheetContext = React.createContext({});

const Sheet = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleOpenChange = (val) => {
    setIsOpen(val);
    if (onOpenChange) onOpenChange(val);
  };

  const value = {
    open: open !== undefined ? open : isOpen,
    setOpen: handleOpenChange,
  };

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
};

const SheetTrigger = ({ className, children, asChild, ...props }) => {
  const { setOpen } = React.useContext(SheetContext);
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      className={className}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </Comp>
  );
};

const SheetContent = React.forwardRef(({ className, children, side = "right", ...props }, ref) => {
  const { open, setOpen } = React.useContext(SheetContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 transition-opacity" 
        onClick={() => setOpen(false)}
      />
      
      {/* Content */}
      <div
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out duration-300 sm:max-w-sm",
          side === "right" ? "inset-y-0 right-0 h-full w-3/4 border-l" : "",
          side === "left" ? "inset-y-0 left-0 h-full w-3/4 border-r" : "",
          side === "top" ? "inset-x-0 top-0 h-auto border-b" : "",
          side === "bottom" ? "inset-x-0 bottom-0 h-auto border-t" : "",
          className
        )}
        {...props}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

const SheetFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold text-gray-950", className)} {...props} />
));

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
));

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};