interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    placeholder ?: string;
    type?: string; 
    name?: string;
    error?: string;
    color?: string;
    fontSize?: string
    isSubmitted?: boolean
}

const Input = ({
    placeholder,
    type = "text",
    name,
    error,
    color,
    fontSize,
    isSubmitted,
    ...props
}: InputProps) => {
  return (
        <input 
            type={type}
            name= {name}
            placeholder={placeholder}
            {...props}
            value={(props.value as string | undefined) ?? ''}
            className={`flex-1 h-full focus:outline-none focus:ring-0 ${color} placeholder:${color}  ${fontSize}`}
        />
  )
}

export default Input