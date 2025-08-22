interface IProps {
  children: React.ReactNode
}

// Простой и понятный подход без FC
const IngredientsLayout = ({ children }: IProps) => {
  return <section className='w-[756px]'>{children}</section>
}

export default IngredientsLayout
