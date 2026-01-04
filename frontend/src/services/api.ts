/**
 * Serviço de API
 * Camada isolada para comunicação com o backend
 */

export interface InterpretRequest {
  text: string;
}

export interface InterpretResponse {
  interpretation: {
    needs_confirmation: boolean;
    action_type: 'task' | 'note' | 'reminder' | 'unknown';
    task?: {
      title: string;
      description?: string;
      due_date?: string;
      priority?: 'low' | 'medium' | 'high';
    };
    note?: {
      title?: string;
      content: string;
    };
    reminder?: {
      title: string;
      description?: string;
      reminder_date: string;
      is_recurring?: boolean;
      recurrence_rule?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    };
    confirmation_message?: string;
  };
  interactionId: string;
  executed: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Interpreta texto usando a IA
 */
export async function interpretText(
  text: string,
  accessToken?: string
): Promise<InterpretResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/interpret`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Erro ao interpretar texto');
  }

  return response.json();
}

