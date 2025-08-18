import { Button } from '@heroui/react'
import Link from 'next/link'

interface HeaderButtonProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
  disabled?: boolean
}

export const HeaderButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
}: HeaderButtonProps) => {
  return (
    <Button
      as={Link}
      color='primary'
      href='#'
      variant='flat'
      onPress={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
