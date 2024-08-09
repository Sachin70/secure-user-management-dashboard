import { fetchWithAuth } from '../../../api';


export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

/**
 * Fetch users with pagination.
 * @param {number} page - The current page number.
 * @param {number} per_page - The number of items per page.
 * @param {string} token - The authentication token.
 * @returns {Promise<ApiResponse>} The API response.
 */
export const fetchUsers = async (
  page: number,
  per_page: number,
  token: string
): Promise<ApiResponse> => {
  const url = 'https://reqres.in/api/users';
  const queryParams = { page, per_page };
  return await fetchWithAuth<ApiResponse>(url, 'GET', token, null, queryParams);
};
