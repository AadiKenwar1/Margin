import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] select-none'

    const variants = {
      primary:
        'bg-white text-black hover:bg-zinc-100 disabled:bg-zinc-600 disabled:text-zinc-400',
      secondary:
        'bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-50',
      ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 disabled:opacity-40',
      danger: 'bg-red-600 text-white hover:bg-red-500 disabled:opacity-50',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-5 py-3 text-sm gap-2',
      lg: 'px-6 py-4 text-base gap-2',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
