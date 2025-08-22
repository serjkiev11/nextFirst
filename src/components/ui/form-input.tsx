import { Input } from '@heroui/react'

interface FormInputProps {
  label?: string
  name: string
  placeholder: string
  type?: 'text' | 'email' | 'password' | 'number'
  value: string
  isRequired?: boolean
  endContent?: React.ReactNode
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
  endContent,
  onChange,
  validate,
}: FormInputProps) => {
  return (
    <>
      {label && (
        <label className='block text-sm font-medium mb-1'>{label}</label>
      )}
      <Input
        aria-label={label || placeholder}
        isRequired={isRequired}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        endContent={endContent}
        classNames={{
          inputWrapper: 'bg-default-100 w-full',
          input: 'text-sm focus:outline-none',
        }}
        onChange={onChange}
        validate={validate}
      />
    </>
  )
}
