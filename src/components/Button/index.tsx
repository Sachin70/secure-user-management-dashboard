import { ButtonVariant } from "../../appConstants/enum";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  /** The content inside the button, typically text or icons. */
  children: React.ReactNode;

  /** The variant of the button, either 'solid' or 'outline'. */
  variant?: ButtonVariant.SOLID | ButtonVariant.OUTLINE;

  /** The function to call when the button is clicked. */
  onClick?: () => void;

  /** Determines whether the button is disabled. */
  disabled?: boolean;

  /** Additional CSS classes to apply to the button. */
  className?: string;
}

/**
 * A reusable button component that supports different variants such as solid and outline.
 *
 * @component
 * @param {React.ReactNode} children - The content inside the button.
 * @param {ButtonVariant} [variant='solid'] - The variant of the button (solid or outline).
 * @param {Function} [onClick] - The function to call when the button is clicked.
 * @param {boolean} [disabled=false] - Determines whether the button is disabled.
 * @param {string} [className=''] - Additional CSS classes to apply to the button.
 * @returns {JSX.Element} The rendered button component.
 */
const Button = (props: ButtonProps) => {
  const {
    children,
    variant = ButtonVariant.SOLID,
    onClick,
    disabled = false,
    className,
    ...rest
  } = props;

  const baseStyles =
    "py-2 px-4 rounded-lg transition duration-200 focus:outline-none";

  const variantStyles = {
    solid: `bg-blue-500 text-white hover:bg-blue-600 ${
      disabled ? "cursor-not-allowed opacity-50" : ""
    }`,
    outline: `bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white ${
      disabled ? "cursor-not-allowed opacity-50" : ""
    }`,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
