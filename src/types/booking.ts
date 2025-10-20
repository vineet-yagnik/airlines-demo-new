// Booking-related TypeScript interfaces

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr';
  type: 'adult' | 'child' | 'infant';
}

export interface PaymentDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface BookingData {
  passengers: Passenger[];
  contactInfo: {
    email: string;
    phone: string;
  };
  paymentDetails?: PaymentDetails;
  specialRequests?: string;
  seatPreferences?: string[];
}

export interface BookingConfirmation {
  bookingReference: string;
  confirmationNumber: string;
  bookingDate: string;
  totalAmount: string;
  status: 'confirmed' | 'pending' | 'failed';
  passengers: Passenger[];
  flightDetails: {
    flightNumber: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    from: string;
    to: string;
    airline: string;
  };
}

export type BookingStep = 'flight-selected' | 'passenger-details' | 'payment' | 'confirmation';