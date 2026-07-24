/**
 * @file cn.ts
 * @description Utility function combining `clsx` and `tailwind-merge` for conditionally constructing class names safely.
 * 
 * PURPOSE:
 * Resolves Tailwind class name conflicts cleanly (e.g. `p-4` vs `p-2`) when composing UI components.
 * 
 * ROLE IN FRONTEND:
 * Used across all UI components (`Button`, `Card`, `Badge`, etc.) to allow parent components to override styling via `className`.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
