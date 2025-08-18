import { Input } from '@heroui/react'

interface FormInputProps {
  label: string
  name: string
  placeholder: string
  type?: 'text' | 'email' | 'password'
  value: string
  isRequired?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  validate?: (value: string) => string | null
}

export const FormInput = ({
  label,
  name,
  placeholder,
  type = 'text',
  value,
  isRequired = false,
  onChange,
  validate,
}: FormInputProps) => {
  return (
    <Input
      aria-label={label}
      isRequired={isRequired}
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm focus:outline-none',
      }}
      onChange={onChange}
      validate={validate}
    />
  )
}
