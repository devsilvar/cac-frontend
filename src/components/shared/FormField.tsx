/**
 * Reusable Form Components
 * Consistent form fields across the app
 */

import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseFieldProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

// Input Field
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  required,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}

// Select Field
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  options: Array<{ value: string; label: string }>
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  error,
  helperText,
  required,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}

// Textarea Field
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  error,
  helperText,
  required,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}

// Checkbox Field
interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...props}
          className={`
            w-4 h-4 text-blue-600 border-gray-300 rounded
            focus:ring-2 focus:ring-blue-500
            ${props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${className}
          `}
        />
        {label && (
          <label className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}
