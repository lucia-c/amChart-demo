import { ButtonHTMLAttributes, FC } from 'react';
import Button from 'react-bootstrap/Button';
import React from 'react'

export type ButtonProps = {
  label: string;
  disabled?: boolean;
  variant?: string
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ChartButton: FC<ButtonProps> = ({ label, disabled = false, type = 'button', variant= 'primary', onClick, children}) => {
  return (
    <Button type={type} variant={variant} className="button" disabled={disabled} onClick={onClick}>{label}
    </Button>
  );
};

export default ChartButton;