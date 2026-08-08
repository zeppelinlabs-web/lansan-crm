import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'sm' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size,
  icon,
  children,
  className = '',
  style,
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

  const extraPadding = size === 'lg' ? { padding: '12px 24px', fontSize: '15px' } : {};

  return (
    <button className={`${variantClass} ${className}`} style={{ ...extraPadding, ...style }} {...props}>
      {icon}
      {children}
    </button>
  );
};
