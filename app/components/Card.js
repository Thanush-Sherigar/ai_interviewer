export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  ...props 
}) {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer' : '';
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: ''
  };
  
  const classes = `${baseClasses} ${hoverClasses} ${paddings[padding]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
