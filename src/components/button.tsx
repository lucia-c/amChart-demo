import { ButtonHTMLAttributes, FC } from 'react';
import Button from 'react-bootstrap/Button';
import React from 'react'

export type ButtonProps = {
  label: string;
  disabled?: boolean;
  variant?: string
  size?: 'sm' | 'lg' | undefined
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ChartButton: FC<ButtonProps> = ({ label, disabled = false, type = 'button', variant= 'primary', size, onClick, children}) => {
  return (
    <Button type={type} size={size} variant={variant} className="button" disabled={disabled} onClick={onClick}>{label}
    </Button>
  );
};

export default ChartButton;