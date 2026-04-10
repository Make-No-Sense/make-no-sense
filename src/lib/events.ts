export type EventSource = "sff" | "calendar";

export interface TruckEvent {
  id: string;
  title: string;      // venue/event name
  date: string;       // formatted display string e.g. "Friday, April 17"
  time: string;       // formatted display string e.g. "11am – 2pm"
  address?: string;   // full address for display + geocoding
  source: EventSource;
}
