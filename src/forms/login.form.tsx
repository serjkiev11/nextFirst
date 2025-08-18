import { signInWithCredentials } from '@/actions/sign-in'
import { Button, Form, Input } from '@heroui/react'
import { useState } from 'react'

interface IProps {
  onClose: () => void
}

const LoginForm = ({ onClose }: IProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await signInWithCredentials(
        formData.email,
        formData.password
      )

      if (result?.error) {
        setError(result.error)
      } else {
        // Успех - закрываем форму и принудительно обновляем страницу
        onClose()
        // Принудительное обновление для отображения новой сессии
        window.location.href = '/'
      }
    } catch (error) {
      // Если это NEXT_REDIRECT - не показываем ошибку, это успех
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        onClose()
        window.location.href = '/'
        return
      }
      setError('Произошла ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form
      className='w-full'
      onSubmit={handleSubmit}
    >
      {error && (
        <div className='text-red-500 text-sm mb-4 p-2 bg-red-50 rounded'>
          {error}
        </div>
      )}

      <Input
        aria-label='Email'
        isRequired
        name='email'
        placeholder='Введите email'
        type='email'
        value={formData.email}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        validate={(value) => {
          if (!value.trim) return 'Почта обязательна'

          return null
        }}
      />

      <Input
        isRequired
        name='password'
        placeholder='Введите пароль'
        type='password'
        value={formData.password}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        validate={(value) => {
          if (!value) return 'Пароль обязателен'
          return null
        }}
      />

      <div className='flex w-[100%] gap-4 items-center pt-8 justify-end'>
        <Button
          variant='light'
          onPress={onClose}
        >
          Отмена
        </Button>
        <Button
          color='primary'
          type='submit'
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </div>
    </Form>
  )
}

export default LoginForm
