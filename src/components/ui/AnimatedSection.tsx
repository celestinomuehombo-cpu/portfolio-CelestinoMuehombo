import { useInView } from '../../hooks/useInView'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function AnimatedSection({ children, className = '' }: Props) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={`section-hidden${inView ? ' section-visible' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}
