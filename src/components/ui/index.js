// src/components/ui/index.js

import React from 'react';

export const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 border-b ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 border-t ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2 className={`text-xl font-semibold ${className}`} {...props}>
    {children}
  </h2>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

export const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export const Button = ({ children, className, variant = 'default', ...props }) => {
  const baseClass = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {children}
        <div className="p-4 mt-4 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => <div className="p-6">{children}</div>;
export const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const DialogFooter = ({ children }) => <div className="mt-6 flex justify-end space-x-2">{children}</div>;
export const DialogTitle = ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>;
export const DialogDescription = ({ children }) => <p className="text-sm text-gray-500 mt-2">{children}</p>;

export const Select = ({ children, value, onValueChange }) => (
  <select
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
  >
    {children}
  </select>
);

export const SelectTrigger = ({ children }) => <div>{children}</div>;
export const SelectValue = ({ children }) => <span>{children}</span>;
export const SelectContent = ({ children }) => <div>{children}</div>;
export const SelectItem = ({ children, value }) => (
  <option value={value}>{children}</option>
);

export const Progress = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export const ScrollArea = ({ children, className, ...props }) => (
  <div className={`overflow-auto ${className}`} {...props}>
    {children}
  </div>
);

export const Accordion = ({ children, type = 'single', ...props }) => (
  <div {...props}>{children}</div>
);

export const AccordionItem = ({ children, value }) => (
  <div data-value={value}>{children}</div>
);

export const AccordionTrigger = ({ children }) => (
  <button className="w-full text-left py-2 font-semibold">{children}</button>
);

export const AccordionContent = ({ children }) => (
  <div className="py-2">{children}</div>
);