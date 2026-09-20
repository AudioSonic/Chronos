import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={`${variant}-button ${className}`.trim()} {...props} />
}
