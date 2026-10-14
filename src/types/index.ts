export type AircraftCategory = 'executive' | 'cargo' | 'evtol' | 'medevac';

export interface AircraftSpec {
  maxSpeedKmh: number;
  cruiseSpeedKmh: number;
  rangeKm: number;
  payloadKg: number;
  serviceCeilingMeters: number;
  noiseLevelDb: number;
  seats: number;
  powertrain: string;
}

export interface Aircraft {
  id: string;
  name: string;
  tagline: string;
  category: AircraftCategory;
  categoryLabel: string;
  heroImage: string;
  thumbnail: string;
  description: string;
  basePriceUsd: number;
  depositUsd: number;
  specs: AircraftSpec;
  features: string[];
  interiorOptions: {
    id: string;
    name: string;
    priceUsd: number;
    description: string;
  }[];
}

export interface CartItem {
  aircraftId: string;
  aircraftName: string;
  categoryLabel: string;
  selectedInteriorId: string;
  interiorName: string;
  depositUsd: number;
  totalConfiguredPriceUsd: number;
  customLiveryColor: string;
  quantity: number;
  addedAt: string;
}

export interface TelemetryEvent {
  id: string;
  type: 'click' | 'scroll' | 'view_model' | 'cart_action' | 'wishlist_action' | 'form_submit';
  target: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  scrollDepthPercentage?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: string }[];
}

export interface NewsletterFormData {
  fullName: string;
  email: string;
  phone: string;
  interestedCategory: AircraftCategory | 'all';
  flightExperienceDate?: string;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
