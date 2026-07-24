/**
 * @file Card.tsx
 * @description Flexible container Card primitive supporting header, body, footer, and glassmorphism variants.
 * 
 * PURPOSE:
 * Encapsulates dark mode visual containers used for metrics, charts, task lists, and dashboard widgets.
 */

import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  ...props
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200 overflow-hidden';
  
  const variants = {
    default: 'bg-dark-card border border-dark-border shadow-xl',
    glass: 'glass-panel shadow-2xl',
    bordered: 'bg-dark-bg border border-dark-border hover:border-gray-700',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4 border-b border-dark-border/60 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h3 className={cn('text-base font-semibold text-gray-100 tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-3 border-t border-dark-border/60 bg-dark-bg/40 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
