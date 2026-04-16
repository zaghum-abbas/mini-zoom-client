import React from 'react';
import { cn } from './utils.js';

export function Textarea({ className, ...props }) {
  return <textarea className={cn('input', className)} {...props} />;
}

