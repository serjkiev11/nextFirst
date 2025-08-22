interface IProps {
  children: React.ReactNode
}

// Простой и понятный подход без FC
const AboutLayout = ({ children }: IProps) => {
  return <section>{children}</section>
}

export default AboutLayout
