/**
 * Enhanced loader spinner component with improved UI.
 * @returns {JSX.Element} The loader component.
 */
const Loader = () => {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="relative">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
