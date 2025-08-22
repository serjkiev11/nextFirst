import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options'
import { useIngredientStore } from '@/store/ingredient.store'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'

interface IngredientsTableProps {
  isAuth: boolean
}

const IngredientsTable = ({ isAuth }: IngredientsTableProps) => {
  const { ingredients, removeIngredient, isLoading } = useIngredientStore()

  const handleDelete = async (id: string) => {
    await removeIngredient(id)
  }

  const getCategoryLabel = (value: string) => {
    const option = CATEGORY_OPTIONS.find((opt) => opt.value === value)

    return option ? option.label : value
  }

  const getUnitLabel = (value: string) => {
    const option = UNIT_OPTIONS.find((opt) => opt.value === value)

    return option ? option.label : value
  }

  if (!isAuth) {
    return (
      <p className='mt-4'>
        Для просмотра ингредиентов необходимо войти в систему
      </p>
    )
  }

  if (isLoading) {
    return <p className='mt-4'>Загрузка...</p>
  }

  return (
    <Table
      aria-label='Список ингредиентов'
      selectionMode='none'
      disallowEmptySelection
      classNames={{
        wrapper: 'mt-4 focus:outline-none',
        table: 'w-full focus:outline-none',
        th: 'text-black',
        td: 'text-black',
        base: 'outline-none focus:outline-none',
      }}
    >
      <TableHeader>
        <TableColumn>Название</TableColumn>
        <TableColumn>Категория</TableColumn>
        <TableColumn>Ед. изм.</TableColumn>
        <TableColumn>Цена за единицу</TableColumn>
        <TableColumn>Описание</TableColumn>
        <TableColumn>Действия</TableColumn>
      </TableHeader>

      <TableBody
        emptyContent={
          ingredients.length === 0 ? 'Ингредиенты не найдены' : undefined
        }
      >
        {ingredients.map((ingredient) => (
          <TableRow key={ingredient.id}>
            <TableCell>{ingredient.name}</TableCell>
            <TableCell>{getCategoryLabel(ingredient.category)}</TableCell>
            <TableCell>{getUnitLabel(ingredient.unit)}</TableCell>
            <TableCell>
              {ingredient.pricePerUnit !== null
                ? `${ingredient.pricePerUnit} грн.`
                : '-'}
            </TableCell>
            <TableCell>{ingredient.description || '-'}</TableCell>
            <TableCell>
              <Button
                color='danger'
                size='sm'
                onPress={() => handleDelete(ingredient.id)}
              >
                Удалить
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default IngredientsTable
