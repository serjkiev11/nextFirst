'use client'

import { Button, Form, Input, Select, SelectItem } from '@heroui/react'
import { FormInput } from '@/components/ui/form-input'
import { useState, useTransition } from 'react'
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options'
import { useIngredientStore } from '@/store/ingredient.store'

const initialState = {
  name: '',
  category: '',
  unit: '',
  pricePerUnit: null as number | null,
  description: '',
}

const IngredientForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(initialState)
  const { addIngredient } = useIngredientStore()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formDataObj: FormData) => {
    startTransition(async () => {
      await addIngredient(formDataObj)
      const storeError = useIngredientStore.getState().error

      if (storeError) {
        setError(storeError)
      } else {
        setError(null)
        setFormData(initialState)
      }
    })
  }

  return (
    <Form
      className='w-full'
      // style={{ width: '450px' }}
      action={handleSubmit}
    >
      {error && <p className='text-red-500 mb-4'>{error}</p>}

      <FormInput
        isRequired
        name='name'
        placeholder='Введите название ингредиента'
        type='text'
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        validate={(value) => {
          if (!value) return 'Название обязательно'
          return null
        }}
      />
      <div className='flex gap-2 w-full'>
        <div className='flex-1'>
          <Select
            isRequired
            name='category'
            placeholder='Категория'
            aria-label='Выберите категорию ингредиента'
            selectedKeys={formData.category ? [formData.category] : []}
            classNames={{
              trigger: 'bg-default-100 w-full',
              innerWrapper: 'text-sm',
              value: 'truncate',
              selectorIcon: 'text-black',
            }}
            onChange={(e) => {
              // Не обновляем state если значение пустое (автоматический сброс формы)
              if (e.target.value) {
                setFormData({ ...formData, category: e.target.value })
              }
            }}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                className='text-black'
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className='flex-1'>
          <Select
            isRequired
            name='unit'
            placeholder='Ед. изм.'
            aria-label='Выберите единицу измерения'
            selectedKeys={formData.unit ? [formData.unit] : []}
            classNames={{
              trigger: 'bg-default-100 w-full',
              innerWrapper: 'text-sm',
              value: 'truncate',
              selectorIcon: 'text-black',
            }}
            onChange={(e) => {
              // Не обновляем state если значение пустое (автоматический сброс формы)
              if (e.target.value) {
                setFormData({ ...formData, unit: e.target.value })
              }
            }}
          >
            {UNIT_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                className='text-black'
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className='flex-1'>
          <FormInput
            isRequired
            name='pricePerUnit'
            placeholder='Цена'
            type='number'
            value={
              formData.pricePerUnit !== null
                ? formData.pricePerUnit.toString()
                : ''
            }
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : null
              setFormData({ ...formData, pricePerUnit: value })
            }}
            endContent={
              <span className='text-sm text-default-400 pointer-events-none flex-shrink-0'>
                грн.
              </span>
            }
            validate={(value) => {
              if (!value) return 'Цена обязательна'
              const num = parseFloat(value)
              if (isNaN(num) || num < 0) return 'Цена должна быть положительной'
              return null
            }}
          />
        </div>
      </div>
      <FormInput
        name='description'
        placeholder='Введите описание (необязательно)'
        type='text'
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <div className='flex w-full items-center justify-end'>
        <Button
          color='primary'
          type='submit'
          isLoading={isPending}
        >
          Добавить ингредиент
        </Button>
      </div>
    </Form>
  )
}

export default IngredientForm
