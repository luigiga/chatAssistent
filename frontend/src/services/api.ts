/**
 * Serviço de API
 * Camada isolada para comunicação com o backend
 */

export interface MemoryInputRequest {
  text: string;
}

// Alias para compatibilidade com API
export type InterpretRequest = MemoryInputRequest;
export type InterpretResponse = MemoryInterpretationResponse;

export interface MemoryInterpretationResponse {
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

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Interpreta texto usando a IA
 * Faz refresh automático do token se receber 401
 */
export async function interpretText(
  text: string,
  accessToken: string,
  refreshTokenFn?: () => Promise<void>,
): Promise<InterpretResponse> {
  const makeRequest = async (tokenToUse: string): Promise<InterpretResponse> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenToUse}`,
    };

    const response = await fetch(`${API_BASE_URL}/interpret`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text }),
    });

    // Se receber 401, tentar refresh do token
    if (response.status === 401 && refreshTokenFn) {
      try {
        await refreshTokenFn();
        const newToken = localStorage.getItem('lumeo_access_token');
        if (newToken) {
          // Tentar novamente com o novo token
          return makeRequest(newToken);
        }
        throw new Error('Token não disponível após refresh');
      } catch {
        // Se refresh falhar, lançar erro específico
        throw new Error('Sessão expirada');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Erro ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.message || 'Não foi possível processar');
    }

    return response.json();
  };

  if (!accessToken) {
    throw new Error('Token não disponível. Faça login novamente.');
  }

  return makeRequest(accessToken);
}

/**
 * Faz login do usuário
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Erro ao fazer login');
  }

  return response.json();
}

/**
 * Registra novo usuário
 */
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Não foi possível criar conta');
  }

  return response.json();
}

/**
 * Renova access token usando refresh token
 */
export async function refreshToken(refreshTokenValue: string): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Erro ao renovar token');
  }

  return response.json();
}

/**
 * Faz logout do usuário
 */
export async function logout(refreshTokenValue: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Não foi possível sair');
  }
}

// ===== Tasks =====

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

export async function listTasks(
  accessToken: string,
  filters?: { completed?: boolean; priority?: string },
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters?.completed !== undefined) {
    params.append('completed', String(filters.completed));
  }
  if (filters?.priority) {
    params.append('priority', filters.priority);
  }

  const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao listar tasks');
  }

  return response.json();
}

export async function completeTask(accessToken: string, taskId: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao completar task');
  }

  return response.json();
}

// ===== Notes =====

export interface Note {
  id: string;
  userId: string;
  title?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function listNotes(accessToken: string): Promise<Note[]> {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao listar notes');
  }

  return response.json();
}

// ===== Reminders =====

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  reminderDate: string;
  isRecurring: boolean;
  recurrenceRule?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

export async function listReminders(accessToken: string): Promise<Reminder[]> {
  const response = await fetch(`${API_BASE_URL}/reminders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao listar reminders');
  }

  return response.json();
}

export async function completeReminder(accessToken: string, reminderId: string): Promise<Reminder> {
  const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}/complete`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao completar lembrete');
  }

  return response.json();
}

export async function undoneReminder(accessToken: string, reminderId: string): Promise<Reminder> {
  const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}/undone`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao desfazer lembrete');
  }

  return response.json();
}

// ===== Memories (Unified) =====

export interface MemoryResponse {
  id: string;
  type: 'task' | 'note' | 'reminder';
  content?: string;
  interpretation: MemoryInterpretationResponse['interpretation'];
  timestamp: string;
  metadata?: {
    completed?: boolean;
    completedAt?: string;
    isFavorite?: boolean;
    isPinned?: boolean;
    category?: {
      id: string;
      name: string;
      color: string;
    };
  };
}

export async function listMemories(
  accessToken: string,
  space?: 'reminders' | 'today' | 'week' | 'all',
  refreshAccessToken?: () => Promise<string>,
): Promise<MemoryResponse[]> {
  const params = new URLSearchParams();
  if (space) {
    params.append('space', space);
  }

  let response = await fetch(`${API_BASE_URL}/memories?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/memories?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao listar memórias');
  }

  return response.json();
}

// ===== Search =====

export interface SearchResult {
  id: string;
  type: 'task' | 'note' | 'reminder';
  title: string;
  snippet: string;
  createdAt: string;
  when?: string;
  category?: { id: string; name: string; color: string } | null;
}

export async function searchMemories(
  accessToken: string,
  query: string,
  filters?: {
    types?: ('task' | 'note' | 'reminder')[];
    categoryIds?: string[];
    from?: string;
    to?: string;
    status?: 'open' | 'done';
  },
  refreshAccessToken?: () => Promise<string>,
): Promise<SearchResult[]> {
  const params = new URLSearchParams();
  params.append('q', query);
  
  if (filters?.types && filters.types.length > 0) {
    filters.types.forEach(type => params.append('types', type));
  }
  
  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    filters.categoryIds.forEach(id => params.append('categoryIds', id));
  }
  
  if (filters?.from) {
    params.append('from', filters.from);
  }
  
  if (filters?.to) {
    params.append('to', filters.to);
  }
  
  if (filters?.status) {
    params.append('status', filters.status);
  }

  let response = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Se token expirou, tentar refresh
  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao buscar memórias');
  }

  return response.json();
}

// ===== Favorites & Pins =====

export async function toggleFavorite(
  accessToken: string,
  memoryId: string,
  type: 'task' | 'note' | 'reminder',
  refreshAccessToken?: () => Promise<string>,
): Promise<{ isFavorite: boolean }> {
  let response = await fetch(`${API_BASE_URL}/memories/${memoryId}/favorite?type=${type}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/memories/${memoryId}/favorite?type=${type}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao favoritar memória');
  }

  return response.json();
}

export async function togglePin(
  accessToken: string,
  memoryId: string,
  type: 'task' | 'note' | 'reminder',
  refreshAccessToken?: () => Promise<string>,
): Promise<{ isPinned: boolean }> {
  let response = await fetch(`${API_BASE_URL}/memories/${memoryId}/pin?type=${type}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/memories/${memoryId}/pin?type=${type}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao fixar memória');
  }

  return response.json();
}

// ===== Categories =====

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function listCategories(
  accessToken: string,
  refreshAccessToken?: () => Promise<string>,
): Promise<Category[]> {
  let response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao listar categorias');
  }

  return response.json();
}

export async function createCategory(
  accessToken: string,
  name: string,
  color: string,
  refreshAccessToken?: () => Promise<string>,
): Promise<Category> {
  let response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name, color }),
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
      },
      body: JSON.stringify({ name, color }),
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao criar categoria');
  }

  return response.json();
}

export async function updateCategory(
  accessToken: string,
  id: string,
  name: string,
  color: string,
  refreshAccessToken?: () => Promise<string>,
): Promise<Category> {
  let response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name, color }),
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
      },
      body: JSON.stringify({ name, color }),
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao atualizar categoria');
  }

  return response.json();
}

export async function deleteCategory(
  accessToken: string,
  id: string,
  refreshAccessToken?: () => Promise<string>,
): Promise<void> {
  let response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao deletar categoria');
  }
}

export async function setMemoryCategory(
  accessToken: string,
  memoryId: string,
  type: 'task' | 'note' | 'reminder',
  categoryId: string | null,
  refreshAccessToken?: () => Promise<string>,
): Promise<void> {
  let response = await fetch(`${API_BASE_URL}/memories/${memoryId}/category?type=${type}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ categoryId }),
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/memories/${memoryId}/category?type=${type}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
      },
      body: JSON.stringify({ categoryId }),
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao atribuir categoria');
  }
}

// ===== Interactions (Confirmação de Ações Pendentes) =====

export interface PendingInteraction {
  id: string;
  userInput: string;
  interpretation: MemoryInterpretationResponse['interpretation'];
  confirmationMessage?: string;
  createdAt: string;
}

export interface ConfirmInteractionResponse {
  interactionId: string;
  executed: boolean;
  createdEntity?: {
    id: string;
    type: 'task' | 'note' | 'reminder';
  };
}

/**
 * Lista todas as interações pendentes do usuário
 */
export async function listPendingInteractions(accessToken: string): Promise<PendingInteraction[]> {
  const response = await fetch(`${API_BASE_URL}/interactions/pending`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Erro ao listar interações pendentes');
  }

  return response.json();
}

/**
 * Confirma uma interação pendente e executa a ação
 */
export async function confirmInteraction(
  accessToken: string,
  interactionId: string,
  refreshTokenFn?: () => Promise<void>,
): Promise<ConfirmInteractionResponse> {
  const makeRequest = async (tokenToUse: string): Promise<ConfirmInteractionResponse> => {
    const response = await fetch(`${API_BASE_URL}/interactions/${interactionId}/confirm`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenToUse}`,
      },
    });

    // Se receber 401, tentar refresh do token
    if (response.status === 401 && refreshTokenFn) {
      try {
        await refreshTokenFn();
        const newToken = localStorage.getItem('lumeo_access_token');
        if (newToken) {
          return makeRequest(newToken);
        }
        throw new Error('Token não disponível após refresh');
      } catch {
        throw new Error('Sessão expirada');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Erro ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.message || 'Não foi possível confirmar');
    }

    return response.json();
  };

  return makeRequest(accessToken);
}

/**
 * Rejeita uma interação pendente
 */
export async function rejectInteraction(
  accessToken: string,
  interactionId: string,
  refreshTokenFn?: () => Promise<void>,
): Promise<void> {
  const makeRequest = async (tokenToUse: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/interactions/${interactionId}/reject`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenToUse}`,
      },
    });

    // Se receber 401, tentar refresh do token
    if (response.status === 401 && refreshTokenFn) {
      try {
        await refreshTokenFn();
        const newToken = localStorage.getItem('lumeo_access_token');
        if (newToken) {
          return makeRequest(newToken);
        }
        throw new Error('Token não disponível após refresh');
      } catch {
        throw new Error('Sessão expirada');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Erro ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.message || 'Não foi possível cancelar');
    }
  };

  return makeRequest(accessToken);
}

/**
 * Interface de Notificação
 */
export interface Notification {
  id: string;
  kind: 'REMINDER_DUE' | 'TASK_DUE';
  title: string;
  body: string;
  entityType: 'Task' | 'Reminder';
  entityId: string;
  readAt: string | null;
  createdAt: string;
}

/**
 * Lista notificações do usuário
 */
export async function listNotifications(
  accessToken: string,
  unreadOnly?: boolean,
  refreshAccessToken?: () => Promise<string>,
): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (unreadOnly) {
    params.append('unread', 'true');
  }

  let response = await fetch(`${API_BASE_URL}/notifications?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/notifications?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao listar notificações');
  }

  return response.json();
}

/**
 * Marca uma notificação como lida
 */
export async function markNotificationRead(
  accessToken: string,
  notificationId: string,
  refreshAccessToken?: () => Promise<string>,
): Promise<void> {
  let response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao marcar notificação como lida');
  }
}

/**
 * Busca contagem de notificações não lidas
 */
export async function getUnreadCount(
  accessToken: string,
  refreshAccessToken?: () => Promise<string>,
): Promise<number> {
  let response = await fetch(`${API_BASE_URL}/notifications/unread/count`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/notifications/unread/count`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error('Erro ao buscar contagem de não lidas');
  }

  const data = await response.json();
  return data.count;
}

/**
 * Interface para requisição de snooze
 */
export interface SnoozeNotificationRequest {
  mode: 'minutes' | 'until' | 'tomorrow_9';
  minutes?: number;
  until?: string;
}

/**
 * Interface para resposta de snooze
 */
export interface SnoozeNotificationResponse {
  notification: Notification;
  updatedEntitySummary: {
    id: string;
    type: 'Task' | 'Reminder';
    newDate: string;
  };
}

/**
 * Adia (snooze) uma notificação
 */
export async function snoozeNotification(
  accessToken: string,
  notificationId: string,
  request: SnoozeNotificationRequest,
  refreshAccessToken?: () => Promise<string>,
): Promise<SnoozeNotificationResponse> {
  let response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/snooze`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  if (response.status === 401 && refreshAccessToken) {
    const newToken = await refreshAccessToken();
    response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/snooze`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
      },
      body: JSON.stringify(request),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Erro ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.message || 'Erro ao adiar notificação');
  }

  return response.json();
}
