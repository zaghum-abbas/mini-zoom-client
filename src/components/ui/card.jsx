import React from 'react';
import { cn } from './utils.js';

export function Card({ className, ...props }) {
  return <div className={cn('card', className)} {...props} />;
}

