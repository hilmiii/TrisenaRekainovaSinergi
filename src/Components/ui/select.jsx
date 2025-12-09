import React, { useState, createContext, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils'; // Memastikan import cn menggunakan alias

// 1. Context untuk berbagi state dropdown
const SelectContext = createContext({});

// 2. Select Component (Main Wrapper)
const Select = ({ value, onValueChange, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (newValue) => {
    // Pastikan newValue tidak null/undefined sebelum diolah
    if (newValue !== undefined) {
        onValueChange(newValue);
    }
    setIsOpen(false);
  };
  
  return (
    <SelectContext.Provider value={{ value, onValueChange: handleSelect, isOpen, setIsOpen }}>
      <div className={cn("relative w-full", props.className)}>{children}</div>
    </SelectContext.Provider>
  );
};
Select.displayName = "Select";


// 3. SelectTrigger (Tombol yang terlihat)
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  
  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

// 4. SelectValue (Placeholder atau nilai terpilih)
const SelectValue = ({ placeholder, children }) => {
  const { value } = useContext(SelectContext);
  return value ? value : (children || placeholder);
};
SelectValue.displayName = "SelectValue";


// 5. SelectContent (Wadah Dropdown)
const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen } = useContext(SelectContext);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white p-1 text-gray-950 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

// 6. SelectItem (Opsi individu)
const SelectItem = React.forwardRef(({ className, value: itemValue, children, ...props }, ref) => {
  const { value, onValueChange } = useContext(SelectContext);
  
  const handleClick = () => {
    onValueChange(itemValue);
  };
  
  const isSelected = value === itemValue;
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-gray-100",
        isSelected ? "bg-teal-500/20 font-medium text-teal-800" : "hover:bg-gray-100",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };