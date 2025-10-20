import React from 'react';
import type { BookingConfirmation } from '../types/booking';

interface BookingConfirmationProps {
  confirmation: BookingConfirmation;
  onNewSearch: () => void;
}

export const BookingConfirmationComponent: React.FC<BookingConfirmationProps> = ({ 
  confirmation, 
  onNewSearch 
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download feature would be implemented here');
  };

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p className="confirmation-subtitle">
          Your flight has been successfully booked. Please save your booking reference for future use.
        </p>
      </div>

      <div className="confirmation-details">
        <div className="confirmation-card">
          <h3>Booking Information</h3>
          <div className="detail-row">
            <span className="label">Booking Reference:</span>
            <span className="value booking-ref">{confirmation.bookingReference}</span>
          </div>
          <div className="detail-row">
            <span className="label">Confirmation Number:</span>
            <span className="value">{confirmation.confirmationNumber}</span>
          </div>
          <div className="detail-row">
            <span className="label">Booking Date:</span>
            <span className="value">{new Date(confirmation.bookingDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="label">Status:</span>
            <span className={`value status ${confirmation.status}`}>
              {confirmation.status.toUpperCase()}
            </span>
          </div>
          <div className="detail-row total-amount">
            <span className="label">Total Amount:</span>
            <span className="value">${confirmation.totalAmount}</span>
          </div>
        </div>

        <div className="confirmation-card">
          <h3>Flight Details</h3>
          <div className="flight-summary">
            <div className="flight-route">
              <div className="airport">
                <div className="airport-code">{confirmation.flightDetails.from}</div>
                <div className="departure-time">{confirmation.flightDetails.departureTime}</div>
              </div>
              <div className="flight-arrow">✈️</div>
              <div className="airport">
                <div className="airport-code">{confirmation.flightDetails.to}</div>
                <div className="arrival-time">{confirmation.flightDetails.arrivalTime}</div>
              </div>
            </div>
            <div className="flight-info">
              <div className="detail-row">
                <span className="label">Flight:</span>
                <span className="value">{confirmation.flightDetails.flightNumber}</span>
              </div>
              <div className="detail-row">
                <span className="label">Airline:</span>
                <span className="value">{confirmation.flightDetails.airline}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(confirmation.flightDetails.departureDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-card">
          <h3>Passengers</h3>
          <div className="passengers-list">
            {confirmation.passengers.map((passenger, index) => (
              <div key={passenger.id} className="passenger-item">
                <div className="passenger-number">{index + 1}</div>
                <div className="passenger-info">
                  <div className="passenger-name">
                    {passenger.title} {passenger.firstName} {passenger.lastName}
                  </div>
                  <div className="passenger-details">
                    Born: {new Date(passenger.dateOfBirth).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button className="action-button secondary" onClick={handlePrint}>
          🖨️ Print Confirmation
        </button>
        <button className="action-button secondary" onClick={handleDownloadPDF}>
          📄 Download PDF
        </button>
        <button className="action-button primary" onClick={onNewSearch}>
          🔍 Book Another Flight
        </button>
      </div>

      <div className="important-notes">
        <h4>Important Information</h4>
        <ul>
          <li>Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights</li>
          <li>Ensure all passengers have valid identification documents</li>
          <li>Check-in online 24 hours before departure to save time</li>
          <li>Baggage allowances apply - check your airline's policy</li>
          <li>Keep this confirmation for your records and airport check-in</li>
        </ul>
      </div>

      <div className="contact-support">
        <h4>Need Help?</h4>
        <p>
          If you need to make changes to your booking or have questions, 
          contact our support team with your booking reference: 
          <strong> {confirmation.bookingReference}</strong>
        </p>
        <div className="support-contacts">
          <span>📞 1-800-FLY-DEMO</span>
          <span>✉️ support@airlinedemo.com</span>
        </div>
      </div>
    </div>
  );
};