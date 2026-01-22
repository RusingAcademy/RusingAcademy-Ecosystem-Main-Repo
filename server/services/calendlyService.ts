// Calendly API Service - Sprint 9
export interface CalendlyEvent { uri: string; name: string; start_time: string; end_time: string; status: string; }
export interface CalendlyUser { uri: string; name: string; email: string; scheduling_url: string; timezone: string; }

const CALENDLY_API_BASE = 'https://api.calendly.com';

export class CalendlyService {
  private apiKey: string;
  private userUri: string | null = null;

  constructor(apiKey: string) { this.apiKey = apiKey; }

  private async request(endpoint: string, options = {}) {
    const response = await fetch(CALENDLY_API_BASE + endpoint, {
      ...options,
      headers: { 'Authorization': 'Bearer ' + this.apiKey, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Calendly API error');
    return response.json();
  }

  async initialize() {
    const response = await this.request('/users/me');
    this.userUri = response.resource.uri;
    return response.resource;
  }

  async getScheduledEvents(params = {}) {
    if (!this.userUri) await this.initialize();
    const queryParams = new URLSearchParams({ user: this.userUri || '' });
    return this.request('/scheduled_events?' + queryParams);
  }

  async getSchedulingUrl() {
    const user = await this.initialize();
    return user.scheduling_url;
  }
}

export function getCalendlyService() {
  const apiKey = process.env.CALENDLY_API_KEY;
  if (!apiKey) throw new Error('CALENDLY_API_KEY not set');
  return new CalendlyService(apiKey);
}

export default CalendlyService;
