import { cn } from '../../utils/helpers';
import { Check } from 'lucide-react';

const Checkbox = ({ 
  label, 
  checked, 
  onChange, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            'w-5 h-5 border-2 rounded transition-all duration-200',
            checked
              ? 'bg-primary-600 border-primary-600'
              : 'border-gray-300 bg-white',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {checked && (
            <Check className="w-full h-full text-white p-0.5" strokeWidth={3} />
          )}
        </div>
      </div>
      {label && (
        <span className={cn('text-sm text-gray-700', disabled && 'opacity-50')}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;