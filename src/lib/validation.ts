/**
 * Validation utilities for constitutional compliance
 * Supports form validation, accessibility validation, and data integrity
 */

// Base validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Airlines domain validation schemas
export const validationSchemas = {
  // Airport code validation (IATA 3-letter codes)
  airportCode: {
    pattern: /^[A-Z]{3}$/,
    message: 'Airport code must be a 3-letter IATA code (e.g., JFK, LAX)',
  },

  // Flight number validation
  flightNumber: {
    pattern: /^[A-Z]{2}\d{1,4}$/,
    message: 'Flight number must be airline code followed by 1-4 digits (e.g., AA123)',
  },

  // Date validation (ISO format)
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Date must be in YYYY-MM-DD format',
  },

  // Email validation (constitutional accessibility compliance)
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },

  // Phone validation (international format)
  phone: {
    pattern: /^\+?[\d\s\-()]{10,}$/,
    message: 'Please enter a valid phone number',
  },

  // Passenger count validation
  passengers: {
    min: 1,
    max: 9,
    message: 'Passenger count must be between 1 and 9',
  },

  // Price validation
  price: {
    min: 0,
    message: 'Price must be a positive number',
  },
};

// Form field validators
export const validators = {
  // Required field validator
  required: (value: unknown): ValidationResult => {
    const isValid = value !== null && value !== undefined && String(value).trim() !== '';
    return {
      isValid,
      errors: isValid ? [] : ['This field is required'],
    };
  },

  // Pattern matching validator
  pattern: (value: string, pattern: RegExp, message: string): ValidationResult => {
    const isValid = pattern.test(value);
    return {
      isValid,
      errors: isValid ? [] : [message],
    };
  },

  // Range validator for numbers
  range: (value: number, min?: number, max?: number, message?: string): ValidationResult => {
    const numValue = Number(value);
    const isValid = 
      !isNaN(numValue) &&
      (min === undefined || numValue >= min) &&
      (max === undefined || numValue <= max);
    
    return {
      isValid,
      errors: isValid ? [] : [message || `Value must be between ${min} and ${max}`],
    };
  },

  // Date validator with accessibility considerations
  date: (value: string): ValidationResult => {
    const patternResult = validators.pattern(value, validationSchemas.date.pattern, validationSchemas.date.message);
    if (!patternResult.isValid) return patternResult;

    const date = new Date(value);
    const isValidDate = !isNaN(date.getTime());
    
    return {
      isValid: isValidDate,
      errors: isValidDate ? [] : ['Please enter a valid date'],
    };
  },

  // Future date validator (for departure dates)
  futureDate: (value: string): ValidationResult => {
    const dateResult = validators.date(value);
    if (!dateResult.isValid) return dateResult;

    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const isFuture = inputDate >= today;
    
    return {
      isValid: isFuture,
      errors: isFuture ? [] : ['Please select a future date'],
    };
  },

  // Return date validator (must be after departure)
  returnDate: (value: string, departureDate: string): ValidationResult => {
    const dateResult = validators.date(value);
    if (!dateResult.isValid) return dateResult;

    const returnDateObj = new Date(value);
    const departureDateObj = new Date(departureDate);
    
    const isAfterDeparture = returnDateObj > departureDateObj;
    
    return {
      isValid: isAfterDeparture,
      errors: isAfterDeparture ? [] : ['Return date must be after departure date'],
    };
  },
};

// Airlines domain-specific validators
export const airlinesValidators = {
  // Flight search form validation
  searchRequest: (data: {
    from: string;
    to: string;
    departure: string;
    return?: string | null;
    passengers: number;
  }): ValidationResult => {
    const errors: string[] = [];

    // Validate origin airport
    const fromResult = validators.pattern(data.from, validationSchemas.airportCode.pattern, 'Origin: ' + validationSchemas.airportCode.message);
    errors.push(...fromResult.errors);

    // Validate destination airport
    const toResult = validators.pattern(data.to, validationSchemas.airportCode.pattern, 'Destination: ' + validationSchemas.airportCode.message);
    errors.push(...toResult.errors);

    // Cannot fly to same airport
    if (data.from === data.to) {
      errors.push('Origin and destination airports cannot be the same');
    }

    // Validate departure date
    const departureResult = validators.futureDate(data.departure);
    errors.push(...departureResult.errors);

    // Validate return date if provided
    if (data.return) {
      const returnResult = validators.returnDate(data.return, data.departure);
      errors.push(...returnResult.errors);
    }

    // Validate passenger count
    const passengersResult = validators.range(
      data.passengers, 
      validationSchemas.passengers.min, 
      validationSchemas.passengers.max,
      validationSchemas.passengers.message
    );
    errors.push(...passengersResult.errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Passenger information validation
  passenger: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth: string;
  }): ValidationResult => {
    const errors: string[] = [];

    // Required fields
    const firstNameResult = validators.required(data.firstName);
    if (!firstNameResult.isValid) errors.push('First name is required');

    const lastNameResult = validators.required(data.lastName);
    if (!lastNameResult.isValid) errors.push('Last name is required');

    // Email validation
    const emailResult = validators.pattern(data.email, validationSchemas.email.pattern, validationSchemas.email.message);
    errors.push(...emailResult.errors);

    // Phone validation (if provided)
    if (data.phone) {
      const phoneResult = validators.pattern(data.phone, validationSchemas.phone.pattern, validationSchemas.phone.message);
      errors.push(...phoneResult.errors);
    }

    // Date of birth validation
    const dobResult = validators.date(data.dateOfBirth);
    errors.push(...dobResult.errors);

    // Age validation (must be reasonable)
    if (dobResult.isValid) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0 || age > 120) {
        errors.push('Please enter a valid date of birth');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Flight data validation
  flight: (data: {
    flightNumber: string;
    departure: { airport: string; time: string };
    arrival: { airport: string; time: string };
    price: number;
    duration: string;
  }): ValidationResult => {
    const errors: string[] = [];

    // Flight number validation
    const flightNumberResult = validators.pattern(
      data.flightNumber, 
      validationSchemas.flightNumber.pattern, 
      validationSchemas.flightNumber.message
    );
    errors.push(...flightNumberResult.errors);

    // Airport codes validation
    const departureAirportResult = validators.pattern(
      data.departure.airport, 
      validationSchemas.airportCode.pattern, 
      'Departure airport: ' + validationSchemas.airportCode.message
    );
    errors.push(...departureAirportResult.errors);

    const arrivalAirportResult = validators.pattern(
      data.arrival.airport, 
      validationSchemas.airportCode.pattern, 
      'Arrival airport: ' + validationSchemas.airportCode.message
    );
    errors.push(...arrivalAirportResult.errors);

    // Time validation (ISO format)
    const departureTime = new Date(data.departure.time);
    const arrivalTime = new Date(data.arrival.time);
    
    if (isNaN(departureTime.getTime())) {
      errors.push('Invalid departure time format');
    }
    if (isNaN(arrivalTime.getTime())) {
      errors.push('Invalid arrival time format');
    }

    // Arrival must be after departure
    if (!isNaN(departureTime.getTime()) && !isNaN(arrivalTime.getTime())) {
      if (arrivalTime <= departureTime) {
        errors.push('Arrival time must be after departure time');
      }
    }

    // Price validation
    const priceResult = validators.range(data.price, validationSchemas.price.min, undefined, validationSchemas.price.message);
    errors.push(...priceResult.errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Accessibility validation helpers
export const accessibilityValidators = {
  // Validate form accessibility compliance
  formAccessibility: (formElement: HTMLFormElement): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for form legend/title
    const fieldsets = formElement.querySelectorAll('fieldset');
    fieldsets.forEach((fieldset, index) => {
      if (!fieldset.querySelector('legend')) {
        errors.push(`Fieldset ${index + 1} is missing a legend`);
      }
    });

    // Check form inputs for proper labeling
    const inputs = formElement.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const inputElement = input as HTMLInputElement;
      const id = inputElement.id;
      const label = formElement.querySelector(`label[for="${id}"]`);
      const ariaLabel = inputElement.getAttribute('aria-label');
      const ariaLabelledBy = inputElement.getAttribute('aria-labelledby');

      if (!label && !ariaLabel && !ariaLabelledBy) {
        errors.push(`Input ${index + 1} (${inputElement.name || inputElement.type}) has no accessible label`);
      }

      // Check for error message association
      if (inputElement.getAttribute('aria-invalid') === 'true') {
        const ariaDescribedBy = inputElement.getAttribute('aria-describedby');
        if (!ariaDescribedBy) {
          warnings.push(`Invalid input ${index + 1} should have aria-describedby pointing to error message`);
        }
      }
    });

    // Check for submit button
    const submitButton = formElement.querySelector('button[type="submit"], input[type="submit"]');
    if (!submitButton) {
      errors.push('Form is missing a submit button');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },

  // Validate ARIA live regions
  liveRegionAccessibility: (container: HTMLElement): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const liveRegions = container.querySelectorAll('[aria-live]');
    
    if (liveRegions.length === 0) {
      warnings.push('No ARIA live regions found - consider adding for dynamic content announcements');
    }

    liveRegions.forEach((region, index) => {
      const politeness = region.getAttribute('aria-live');
      if (politeness !== 'polite' && politeness !== 'assertive' && politeness !== 'off') {
        errors.push(`Live region ${index + 1} has invalid aria-live value: ${politeness}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },

  // Validate heading structure
  headingStructure: (container: HTMLElement): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));

    // Must have an h1
    if (!levels.includes(1)) {
      errors.push('Page must have an h1 heading');
    }

    // Check for level skipping
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      if (diff > 1) {
        warnings.push(`Heading level skipped: h${levels[i - 1]} followed by h${levels[i]}`);
      }
    }

    // Check for empty headings
    headings.forEach((heading, index) => {
      if (!heading.textContent?.trim()) {
        errors.push(`Heading ${index + 1} (h${heading.tagName.charAt(1)}) is empty`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },
};

// Data sanitization utilities
export const sanitizers = {
  // Sanitize airport code input
  airportCode: (value: string): string => {
    return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  },

  // Sanitize phone number
  phone: (value: string): string => {
    return value.replace(/[^\d+\-\s()]/g, '');
  },

  // Sanitize passenger name
  name: (value: string): string => {
    return value.replace(/[^a-zA-Z\s\-']/g, '').trim();
  },

  // Sanitize numeric input
  numeric: (value: string): string => {
    return value.replace(/[^\d.]/g, '');
  },
};

// Real-time validation hook for React components
export function useFormValidation<T extends Record<string, unknown>>(
  initialData: T,
  validator: (data: T) => ValidationResult
) {
  const [data, setData] = React.useState<T>(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateField = (name: keyof T, value: unknown) => {
    const testData = { ...data, [name]: value };
    const result = validator(testData);
    
    // Extract field-specific errors (simple approach)
    const fieldErrors: Record<string, string> = {};
    result.errors.forEach(error => {
      if (error.toLowerCase().includes(String(name).toLowerCase())) {
        fieldErrors[String(name)] = error;
      }
    });

    setErrors(prev => ({ ...prev, ...fieldErrors }));
    return result.isValid;
  };

  const handleChange = (name: keyof T, value: unknown) => {
    setData(prev => ({ ...prev, [name]: value }));
    if (touched[String(name)]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [String(name)]: true }));
    validateField(name, data[name]);
  };

  const validate = () => {
    const result = validator(data);
    // Set all fields as touched
    const allTouched = Object.keys(data).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    return result;
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    isValid: Object.keys(errors).length === 0,
  };
}

// Import React for the hook
import * as React from 'react';