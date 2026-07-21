// API Service mapping to the Enterprise Core Conventions backend

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface EnterpriseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  errors?: Record<string, string[]>;
}

export class ApiClient {
  static async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` -> In a real app, inject auth token here
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const payload: EnterpriseResponse<T> = await response.json();

    if (!response.ok || !payload.success) {
      console.error('API Error:', payload.errors || payload.message);
      throw new Error(payload.message || 'Une erreur est survenue.');
    }

    // Thanks to the EnterpriseJSONRenderer, we always know data is under the .data key
    return payload.data;
  }

  // --- Immobilisations Module API ---

  static async getFamilies() {
    return this.fetch<any[]>('/structure/families/');
  }

  static async getFamily(id: string) {
    return this.fetch<any>(`/structure/families/${id}/`);
  }

  static async createFamily(data: any) {
    return this.fetch<any>('/structure/families/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateFamily(id: string, data: any) {
    return this.fetch<any>(`/structure/families/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async getImmobilisations() {
    return this.fetch<any[]>('/structure/immobilisations/');
  }

  static async getImmobilisation(id: string) {
    return this.fetch<any>(`/structure/immobilisations/${id}/`);
  }

  static async createImmobilisation(data: any) {
    return this.fetch<any>('/structure/immobilisations/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateImmobilisation(id: string, data: any) {
    return this.fetch<any>(`/structure/immobilisations/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}
