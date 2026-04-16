import React from 'react';
import { cn } from './utils.js';

export function Input({ className, ...props }) {
  return <input className={cn('input', className)} {...props} />;
}

