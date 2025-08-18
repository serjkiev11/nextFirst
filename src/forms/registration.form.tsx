import { Button, Form } from '@heroui/react'
import { useState } from 'react'
import { FormInput } from '@/components/ui/form-input'
import { registerUser } from '@/actions/register'

interface IProps {
  onClose: () => void
}

const RegistrationForm = ({ onClose }: IProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (fieldName: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await registerUser(formData)

      if (result?.success) {
        // Регистрация успешна - закрываем форму и обновляем страницу
        onClose()
        window.location.href = '/' // Принудительно обновляем страницу
        return
      }
    } catch (error) {
      // Показываем ошибку пользователю
      setError(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при регистрации'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form
      className='w-full'
      onSubmit={handleSubmit}
    >
      <FormInput
        label='Email'
        name='email'
        placeholder='Введите email'
        type='email'
        value={formData.email}
        isRequired={true}
        onChange={handleInputChange('email')}
        validate={(value) => {
          if (!value.trim()) return 'Почта обязательна'
          if (!validateEmail(value)) return 'Не корректный email'
          return null
        }}
      />

      <FormInput
        label='Password'
        name='password'
        placeholder='Введите пароль'
        type='password'
        value={formData.password}
        isRequired={true}
        onChange={handleInputChange('password')}
        validate={(value) => {
          if (!value) return 'Пароль обязателен'
          if (value.length < 6) return 'Пароль должен быть не менее 6 символов'
          return null
        }}
      />

      <FormInput
        label='Confirm Password'
        name='confirmPassword'
        placeholder='Подтвердите пароль'
        type='password'
        value={formData.confirmPassword}
        isRequired={true}
        onChange={handleInputChange('confirmPassword')}
        validate={(value) => {
          if (!value) return 'Пароль для подтверждения обязателен'
          if (formData.password && value !== formData.password)
            return 'Пароли не совпадают'
          return null
        }}
      />

      {error && <div className='text-red-500 text-sm mt-2'>{error}</div>}

      <div className='flex w-[100%] gap-4 items-center pt-8 justify-end'>
        <Button
          variant='light'
          onPress={onClose}
          isDisabled={isLoading}
        >
          Отмена
        </Button>
        <Button
          color='primary'
          type='submit'
          isLoading={isLoading}
        >
          Зарегистрироваться
        </Button>
      </div>
    </Form>
  )
}

export default RegistrationForm
