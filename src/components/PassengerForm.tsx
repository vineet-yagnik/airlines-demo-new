import React from 'react';
import type { Passenger } from '../types/booking';

interface PassengerFormProps {
  passenger: Passenger;
  index: number;
  onUpdate: (index: number, passenger: Passenger) => void;
  isContactPassenger?: boolean;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({ 
  passenger, 
  index, 
  onUpdate, 
  isContactPassenger = false 
}) => {
  const handleChange = (field: keyof Passenger, value: string) => {
    onUpdate(index, { ...passenger, [field]: value });
  };

  return (
    <div className="passenger-form">
      <h4>
        Passenger {index + 1}
        {isContactPassenger && <span className="contact-badge"> (Primary Contact)</span>}
      </h4>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`title-${index}`}>Title</label>
          <select
            id={`title-${index}`}
            value={passenger.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          >
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`firstName-${index}`}>First Name</label>
          <input
            id={`firstName-${index}`}
            type="text"
            value={passenger.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
            placeholder="Enter first name"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`lastName-${index}`}>Last Name</label>
          <input
            id={`lastName-${index}`}
            type="text"
            value={passenger.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`dob-${index}`}>Date of Birth</label>
          <input
            id={`dob-${index}`}
            type="date"
            value={passenger.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {isContactPassenger && (
          <>
            <div className="form-group">
              <label htmlFor={`email-${index}`}>Email</label>
              <input
                id={`email-${index}`}
                type="email"
                value={passenger.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`phone-${index}`}>Phone</label>
              <input
                id={`phone-${index}`}
                type="tel"
                value={passenger.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};