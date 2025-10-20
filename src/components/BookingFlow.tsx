import React from 'react';
import { PassengerForm } from './PassengerForm';
import { PaymentForm } from './PaymentForm';
import { BookingConfirmationComponent } from './BookingConfirmation';
import type { FlightOffer } from '../lib/flight-api';
import type { 
  BookingStep, 
  BookingData, 
  Passenger, 
  PaymentDetails, 
  BookingConfirmation 
} from '../types/booking';

interface BookingFlowProps {
  selectedFlight: FlightOffer;
  passengerCount: number;
  onCancel: () => void;
  onComplete: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ 
  selectedFlight, 
  passengerCount, 
  onCancel, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = React.useState<BookingStep>('flight-selected');
  const [bookingData, setBookingData] = React.useState<BookingData>({
    passengers: Array.from({ length: passengerCount }, (_, index) => ({
      id: `passenger-${index}`,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      title: 'Mr' as const,
      type: 'adult' as const,
      email: index === 0 ? '' : undefined,
      phone: index === 0 ? '' : undefined,
    })),
    contactInfo: {
      email: '',
      phone: ''
    }
  });
  
  const [paymentDetails, setPaymentDetails] = React.useState<PaymentDetails>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  const [confirmation, setConfirmation] = React.useState<BookingConfirmation | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [specialRequests, setSpecialRequests] = React.useState('');

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? match[1].replace('H', 'h ') : '';
    const minutes = match[2] ? match[2].replace('M', 'm') : '';
    return (hours + minutes).trim();
  };

  const handlePassengerUpdate = (index: number, passenger: Passenger) => {
    const updatedPassengers = [...bookingData.passengers];
    updatedPassengers[index] = passenger;
    
    // Update contact info from primary passenger
    if (index === 0) {
      setBookingData({
        ...bookingData,
        passengers: updatedPassengers,
        contactInfo: {
          email: passenger.email || '',
          phone: passenger.phone || ''
        }
      });
    } else {
      setBookingData({
        ...bookingData,
        passengers: updatedPassengers
      });
    }
  };

  const validatePassengerDetails = () => {
    return bookingData.passengers.every(passenger => 
      passenger.firstName.trim() &&
      passenger.lastName.trim() &&
      passenger.dateOfBirth &&
      passenger.title
    ) && bookingData.contactInfo.email && bookingData.contactInfo.phone;
  };

  const validatePaymentDetails = () => {
    return paymentDetails.cardNumber.replace(/\s/g, '').length >= 13 &&
           paymentDetails.expiryMonth &&
           paymentDetails.expiryYear &&
           paymentDetails.cvv.length >= 3 &&
           paymentDetails.cardholderName.trim() &&
           paymentDetails.billingAddress.street.trim() &&
           paymentDetails.billingAddress.city.trim() &&
           paymentDetails.billingAddress.state.trim() &&
           paymentDetails.billingAddress.zipCode.trim() &&
           paymentDetails.billingAddress.country;
  };

  const processBooking = async () => {
    setIsProcessing(true);
    
    // Simulate booking processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const segment = selectedFlight.itineraries[0].segments[0];
      const bookingConfirmation: BookingConfirmation = {
        bookingReference: `AD${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        confirmationNumber: `${segment.carrierCode}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        bookingDate: new Date().toISOString(),
        totalAmount: selectedFlight.price.total,
        status: 'confirmed',
        passengers: bookingData.passengers,
        flightDetails: {
          flightNumber: `${segment.carrierCode}${segment.number}`,
          departureDate: segment.departure.at.split('T')[0],
          departureTime: formatTime(segment.departure.at),
          arrivalTime: formatTime(segment.arrival.at),
          from: segment.departure.iataCode,
          to: segment.arrival.iataCode,
          airline: `${segment.carrierCode} Airlines`
        }
      };
      
      setConfirmation(bookingConfirmation);
      setCurrentStep('confirmation');
    } catch (bookingError) {
      console.error('Booking processing error:', bookingError);
      alert('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStepNavigation = (nextStep: BookingStep) => {
    if (nextStep === 'passenger-details' && currentStep === 'flight-selected') {
      setCurrentStep('passenger-details');
    } else if (nextStep === 'payment' && currentStep === 'passenger-details') {
      if (validatePassengerDetails()) {
        setCurrentStep('payment');
      } else {
        alert('Please fill in all required passenger details');
      }
    } else if (nextStep === 'confirmation' && currentStep === 'payment') {
      if (validatePaymentDetails()) {
        processBooking();
      } else {
        alert('Please fill in all required payment details');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'passenger-details') {
      setCurrentStep('flight-selected');
    } else if (currentStep === 'payment') {
      setCurrentStep('passenger-details');
    }
  };

  if (confirmation && currentStep === 'confirmation') {
    return (
      <BookingConfirmationComponent 
        confirmation={confirmation} 
        onNewSearch={onComplete}
      />
    );
  }

  const segment = selectedFlight.itineraries[0].segments[0];

  return (
    <div className="booking-flow">
      <div className="booking-header">
        <button className="back-button" onClick={onCancel}>
          ← Back to Search
        </button>
        <h2>Complete Your Booking</h2>
      </div>

      <div className="booking-progress">
        <div className={`progress-step ${currentStep === 'flight-selected' ? 'active' : 'completed'}`}>
          <div className="step-number">1</div>
          <span>Flight Selected</span>
        </div>
        <div className={`progress-step ${currentStep === 'passenger-details' ? 'active' : currentStep === 'payment' || currentStep === 'confirmation' ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span>Passenger Details</span>
        </div>
        <div className={`progress-step ${currentStep === 'payment' ? 'active' : currentStep === 'confirmation' ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <span>Payment</span>
        </div>
        <div className={`progress-step ${currentStep === 'confirmation' ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="booking-content">
        <div className="flight-summary-card">
          <h3>Your Selected Flight</h3>
          <div className="flight-summary">
            <div className="flight-route">
              <div className="airport">
                <div className="airport-code">{segment.departure.iataCode}</div>
                <div className="time">{formatTime(segment.departure.at)}</div>
              </div>
              <div className="flight-duration">
                <div>✈️</div>
                <div>{formatDuration(selectedFlight.itineraries[0].duration)}</div>
              </div>
              <div className="airport">
                <div className="airport-code">{segment.arrival.iataCode}</div>
                <div className="time">{formatTime(segment.arrival.at)}</div>
              </div>
            </div>
            <div className="flight-details">
              <span>{segment.carrierCode} Airlines - {segment.carrierCode}{segment.number}</span>
              <span className="price">${selectedFlight.price.total}</span>
            </div>
          </div>
        </div>

        {currentStep === 'flight-selected' && (
          <div className="booking-step">
            <h3>Booking Summary</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span>Passengers:</span>
                <span>{passengerCount} passenger{passengerCount > 1 ? 's' : ''}</span>
              </div>
              <div className="summary-item">
                <span>Base Price:</span>
                <span>${selectedFlight.price.base}</span>
              </div>
              <div className="summary-item">
                <span>Taxes & Fees:</span>
                <span>${(parseFloat(selectedFlight.price.total) - parseFloat(selectedFlight.price.base)).toFixed(2)}</span>
              </div>
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>${selectedFlight.price.total}</span>
              </div>
            </div>
            <button 
              className="continue-button"
              onClick={() => handleStepNavigation('passenger-details')}
            >
              Continue to Passenger Details
            </button>
          </div>
        )}

        {currentStep === 'passenger-details' && (
          <div className="booking-step">
            <h3>👥 Passenger Information</h3>
            <div className="passengers-section">
              {bookingData.passengers.map((passenger, index) => (
                <PassengerForm
                  key={passenger.id}
                  passenger={passenger}
                  index={index}
                  onUpdate={handlePassengerUpdate}
                  isContactPassenger={index === 0}
                />
              ))}
            </div>

            <div className="special-requests-section">
              <h4>Special Requests (Optional)</h4>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requests or dietary requirements..."
                rows={3}
                className="special-requests-textarea"
              />
            </div>

            <div className="step-actions">
              <button className="back-button" onClick={handleBack}>
                ← Back
              </button>
              <button 
                className="continue-button"
                onClick={() => handleStepNavigation('payment')}
                disabled={!validatePassengerDetails()}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {currentStep === 'payment' && (
          <div className="booking-step">
            <PaymentForm 
              paymentDetails={paymentDetails}
              onUpdate={setPaymentDetails}
            />

            <div className="final-summary">
              <h4>Final Total</h4>
              <div className="final-amount">${selectedFlight.price.total}</div>
              <p className="terms-text">
                By completing this booking, you agree to our terms and conditions 
                and privacy policy. All bookings are subject to availability.
              </p>
            </div>

            <div className="step-actions">
              <button className="back-button" onClick={handleBack}>
                ← Back
              </button>
              <button 
                className="complete-booking-button"
                onClick={() => handleStepNavigation('confirmation')}
                disabled={!validatePaymentDetails() || isProcessing}
              >
                {isProcessing ? 'Processing...' : `Complete Booking - $${selectedFlight.price.total}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};