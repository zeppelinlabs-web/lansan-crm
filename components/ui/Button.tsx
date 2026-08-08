import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'sm' | 'danger';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  icon,
  children,
  className = '',
  ...props
}) => {
  let variantClass = 'btn';
  if (variant === 'primary') {
    variantClass = 'btn btn-primary';
  } else if (variant === 'sm') {
    variantClass = 'btn btn-sm';
  } else if (variant === 'danger') {
    variantClass = 'btn btn-danger btn-sm';
  }

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
};
