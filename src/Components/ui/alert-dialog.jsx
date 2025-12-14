import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button"; // Menggunakan komponen Button yang sudah ada

// Context untuk AlertDialog State
const AlertDialogContext = createContext({});

const AlertDialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenChange = (val) => {
    setIsOpen(val);
    if (onOpenChange) onOpenChange(val);
  };

  const value = {
    open: open !== undefined ? open : isOpen,
    setOpen: handleOpenChange,
  };

  return <AlertDialogContext.Provider value={value}>{children}</AlertDialogContext.Provider>;
};

// Content (Modal Window)
const AlertDialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useContext(AlertDialogContext);

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
      </div>
    </div>
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

// Header
const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left mb-4", className)} {...props} />
);

// Title
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

// Description
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

// Footer
const AlertDialogFooter = ({ className, ...props }) => {
    const { setOpen } = useContext(AlertDialogContext);
    return (
        <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)} {...props} />
    );
};

// Action Buttons
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => {
    const { setOpen } = useContext(AlertDialogContext);
    return (
        <Button 
            ref={ref}
            className={cn("bg-gray-900 hover:bg-gray-900/90", className)}
            onClick={() => setOpen(false)} // Tutup setelah aksi
            {...props} 
        />
    );
});
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => {
    const { setOpen } = useContext(AlertDialogContext);
    return (
        <Button 
            ref={ref}
            variant="outline"
            className={cn("mt-2 sm:mt-0", className)}
            onClick={() => setOpen(false)}
            {...props} 
        />
    );
});
AlertDialogCancel.displayName = "AlertDialogCancel";


export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};