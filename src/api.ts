/**
 * API Helper Functions
 * Centralizes all API calls with support for both development (proxy) and production (VITE_API_URL)
 */

const getBaseUrl = (): string => {
  // In production, use VITE_API_URL environment variable
  // In development, the Vite proxy will handle /api/* requests
  return import.meta.env.VITE_API_URL || '';
};

/**
 * Make a fetch request to the API
 * @param endpoint - The API endpoint (e.g., '/login', '/plans')
 * @param options - Fetch options
 * @returns Fetch response
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const baseUrl = getBaseUrl();
  const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
  
  console.log(`[API] ${options.method || 'GET'} ${url}`);
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

/**
 * Login API call
 */
export async function login(email: string, password: string) {
  const res = await apiCall('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return res.json();
}

/**
 * Fetch plans for an agency
 */
export async function getPlans(agencyId: string | null) {
  const res = await apiCall(`/api/plans?agency_id=${agencyId}`);
  if (!res.ok) throw new Error('Failed to fetch plans');
  return res.json();
}

/**
 * Delete a plan
 */
export async function deletePlan(id: string) {
  const res = await apiCall(`/api/plans/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete plan');
  return res.json();
}

/**
 * Fetch form fields for an agency
 */
export async function getFormFields(agencyId: string | null) {
  const res = await apiCall(`/api/form-fields?agency_id=${agencyId}`);
  if (!res.ok) throw new Error('Failed to fetch form fields');
  return res.json();
}

/**
 * Delete a form field
 */
export async function deleteFormField(id: string) {
  const res = await apiCall(`/api/form-fields/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete form field');
  return res.json();
}

/**
 * Fetch processes
 */
export async function getProcesses(query: string) {
  const res = await apiCall(`/api/processes?${query}`);
  if (!res.ok) throw new Error('Failed to fetch processes');
  return res.json();
}

/**
 * Delete a process
 */
export async function deleteProcess(id: string) {
  const res = await apiCall(`/api/processes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete process');
  return res.json();
}

/**
 * Health check
 */
export async function healthCheck() {
  const res = await apiCall('/api/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
