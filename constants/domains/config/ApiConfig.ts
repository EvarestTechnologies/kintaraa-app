// API Configuration for Kintaraa Platform

export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:8000/api' : 'https://api.kintaraa.com/api',
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',

    // Incidents
    INCIDENTS: '/incidents',
    INCIDENT_BY_ID: (id: string) => `/incidents/${id}`,
    INCIDENT_MESSAGES: (id: string) => `/incidents/${id}/messages`,
    INCIDENT_EVIDENCE: (id: string) => `/incidents/${id}/evidence`,

    // Providers
    PROVIDERS: '/providers',
    PROVIDER_CASES: '/providers/assigned-cases',
    PROVIDER_STATS: '/providers/stats',
    CASE_ASSIGNMENTS: '/providers/assignments',

    // Real-time
    WEBSOCKET: __DEV__ ? 'ws://localhost:8000/ws' : 'wss://api.kintaraa.com/ws',

    // File uploads
    UPLOAD: '/incidents/upload-voice',

    // AI Services
    TRANSCRIPTION: 'https://toolkit.rork.com/stt/transcribe/',
    AI_RECOMMENDATIONS: 'https://toolkit.rork.com/text/llm/',
  },
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const getAuthHeaders = (token?: string) => ({
  ...API_CONFIG.HEADERS,
  ...(token && { Authorization: `Bearer ${token}` }),
});

export const createApiUrl = (endpoint: string) => 
  `${API_CONFIG.BASE_URL}${endpoint}`;