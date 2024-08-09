// components/Pagination.tsx

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Enhanced pagination component with Tailwind CSS.
 * @param {PaginationProps} props - The pagination props.
 * @returns {JSX.Element} The rendered pagination component.
 */
const Pagination = (props: PaginationProps) => {
  const { currentPage, totalPages, onPageChange } = props;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
              page === currentPage
                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Pagination;
