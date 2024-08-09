interface InputProps extends React.HTMLProps<HTMLInputElement> {
  /** The label text for the input field. */
  label?: string;

  /** The name of the input field, used for form submission and accessibility. */
  name: string;

  /** The type of the input field (e.g., text, password, email). */
  type?: string;

  /** The current value of the input field. */
  value: string;

  /** Function to handle changes in the input field. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** An error message to display below the input field. */
  error?: string;

  /** A React node to display at the start (left) of the input field. */
  startAdornment?: React.ReactNode;

  /** A React node to display at the end (right) of the input field. */
  endAdornment?: React.ReactNode;

  /** Placeholder text to display when the input field is empty. */
  placeholder?: string;

  /** Additional CSS classes to apply to the input field container. */
  className?: string;
}

/**
 * A reusable input component that supports labels, adornments, and error messages.
 *
 * @component
 * @param {string} [label] - The label text for the input field.
 * @param {string} name - The name of the input field, used for form submission and accessibility.
 * @param {string} [type='text'] - The type of the input field (e.g., text, password, email).
 * @param {string} value - The current value of the input field.
 * @param {Function} onChange - Function to handle changes in the input field.
 * @param {string} [error] - An error message to display below the input field.
 * @param {React.ReactNode} [startAdornment] - A React node to display at the start (left) of the input field.
 * @param {React.ReactNode} [endAdornment] - A React node to display at the end (right) of the input field.
 * @param {string} [placeholder] - Placeholder text to display when the input field is empty.
 * @param {string} [className=''] - Additional CSS classes to apply to the input field container.
 * @returns {JSX.Element} The rendered input component.
 */
const Input = (props: InputProps) => {
  const {
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    startAdornment,
    endAdornment,
    placeholder,
    className,
  } = props;

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-gray-700 mb-2">{label}</label>}

      <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500">
        {startAdornment && <div className="mr-2">{startAdornment}</div>}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border-none focus:outline-none text-gray-700`}
        />

        {endAdornment && <div className="ml-2">{endAdornment}</div>}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
