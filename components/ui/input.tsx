import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            style={{
              ...(leftIcon ? { paddingLeft: "2.5rem" } : undefined),
              ...(rightIcon ? { paddingRight: "2.5rem" } : undefined),
            }}
            className={cn(
              "input-sakura",
              error && "border-petal-400 focus:ring-petal-200",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-petal-500 font-medium mt-0.5">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "input-sakura resize-none min-h-[80px]",
            error && "border-petal-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-petal-500 font-medium mt-0.5">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  label?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, id, children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <select
          id={inputId}
          ref={ref}
          className={cn(
            "input-sakura appearance-none cursor-pointer",
            error && "border-petal-400",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-petal-500 font-medium mt-0.5">{error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"
