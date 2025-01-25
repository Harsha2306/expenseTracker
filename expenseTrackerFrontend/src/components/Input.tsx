interface InputProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorId?: string;
  placeHolder: string;
  className: string;
  labelClassName: string;
}

const Input = ({
  id,
  type,
  label,
  value,
  onChange,
  errorId,
  placeHolder,
  className,
  labelClassName,
}: InputProps) => {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        id={id}
        className={`${className} ${
          errorId
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-400"
        }`}
        placeholder={placeHolder}
      />
      {errorId && <p className="mt-1 text-sm text-red-500">{errorId}</p>}
    </div>
  );
};

export default Input;
