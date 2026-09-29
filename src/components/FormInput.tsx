import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightLabel?: React.ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  required,
  error,
  rightLabel,
  labelClassName = "text-[11px] font-bold uppercase tracking-wider text-[#1A1615] lg:text-[#6E6A66]",
  className = "",
  wrapperClassName = "mb-5 w-full",
  ...props
}) => {
  return (
    <div className={wrapperClassName}>
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelClassName}>
          {label} {required && <span className="text-[#B7362F] ml-0.5">*</span>}
        </label>
        {rightLabel && (
          <span className="text-[11px] font-semibold text-[#9E9A93]">
            {rightLabel}
          </span>
        )}
      </div>
      <input
        required={required}
        className={`w-full px-4 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-[#EFECE6]'} rounded-lg text-[13px] font-bold text-[#1A1615] placeholder:text-[#B0ABA5] focus:outline-none focus:border-[#D4A753] transition-colors shadow-sm ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs font-semibold mt-1.5">{error}</p>}
    </div>
  );
};
