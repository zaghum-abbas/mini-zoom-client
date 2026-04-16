import React from 'react';
import { cn } from './utils.js';

export function Label({ className, ...props }) {
  return <label className={cn('label', className)} {...props} />;
}

