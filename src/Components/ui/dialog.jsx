import React, { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Context untuk Dialog State
const DialogContext = createContext({});

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenChange = (val) => {
    setIsOpen(val);
    if (onOpenChange) onOpenChange(val);
  };

  const value = {
    open: open !== undefined ? open : isOpen,
    setOpen: handleOpenChange,
  };

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
};

// Content (Modal Window)
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={() => setOpen(false)}
      />
      
      {/* Content Box */}
      <div
        ref={ref}
        className={cn(
          "relative z-50 w-full max-w-lg rounded-lg border bg-white p-6 shadow-xl transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Tutup</span>
        </button>
      </div>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

// Header
const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props} />
);

// Title
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

// Footer
const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)} {...props} />
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
};