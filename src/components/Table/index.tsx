import React, { ReactNode } from "react";
import Loader from "../Loader";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading: boolean;
  renderCell?: (item: T, accessor: keyof T) => React.ReactNode;
}

/**
 * Reusable table component with an integrated loader.
 * @param {TableProps<T>} props - The table props.
 * @returns {JSX.Element} The rendered table component.
 */
const Table = <T extends object>({
  data,
  columns,
  loading,
  renderCell,
}: TableProps<T>): JSX.Element => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <Loader />
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition ease-in-out duration-150"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.accessor)}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {renderCell
                      ? renderCell(item, column.accessor)
                      : (item[column.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
