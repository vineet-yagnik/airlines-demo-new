import React from 'react';
import type { PaymentDetails } from '../types/booking';

interface PaymentFormProps {
  paymentDetails: PaymentDetails;
  onUpdate: (paymentDetails: PaymentDetails) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ paymentDetails, onUpdate }) => {
  const handleChange = (field: keyof PaymentDetails | string, value: string) => {
    if (field.startsWith('billing.')) {
      const billingField = field.split('.')[1] as keyof PaymentDetails['billingAddress'];
      onUpdate({
        ...paymentDetails,
        billingAddress: {
          ...paymentDetails.billingAddress,
          [billingField]: value
        }
      });
    } else {
      onUpdate({
        ...paymentDetails,
        [field]: value
      });
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove non-numeric characters and limit to 16 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    // Add spaces every 4 digits
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    handleChange('cardNumber', formatted);
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 4);
  };

  return (
    <div className="payment-form">
      <h3>💳 Payment Information</h3>
      
      <div className="payment-section">
        <h4>Card Details</h4>
        
        <div className="form-row">
          <div className="form-group card-number-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              value={paymentDetails.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              required
              maxLength={19}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name</label>
            <input
              id="cardholderName"
              type="text"
              value={paymentDetails.cardholderName}
              onChange={(e) => handleChange('cardholderName', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryMonth">Expiry Month</label>
            <select
              id="expiryMonth"
              value={paymentDetails.expiryMonth}
              onChange={(e) => handleChange('expiryMonth', e.target.value)}
              required
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                  {(i + 1).toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="expiryYear">Expiry Year</label>
            <select
              id="expiryYear"
              value={paymentDetails.expiryYear}
              onChange={(e) => handleChange('expiryYear', e.target.value)}
              required
            >
              <option value="">Year</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              type="text"
              value={paymentDetails.cvv}
              onChange={(e) => handleChange('cvv', formatCVV(e.target.value))}
              placeholder="123"
              required
              maxLength={4}
            />
          </div>
        </div>
      </div>

      <div className="billing-section">
        <h4>Billing Address</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="billingStreet">Street Address</label>
            <input
              id="billingStreet"
              type="text"
              value={paymentDetails.billingAddress.street}
              onChange={(e) => handleChange('billing.street', e.target.value)}
              placeholder="123 Main St"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="billingCity">City</label>
            <input
              id="billingCity"
              type="text"
              value={paymentDetails.billingAddress.city}
              onChange={(e) => handleChange('billing.city', e.target.value)}
              placeholder="New York"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="billingState">State</label>
            <input
              id="billingState"
              type="text"
              value={paymentDetails.billingAddress.state}
              onChange={(e) => handleChange('billing.state', e.target.value)}
              placeholder="NY"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="billingZipCode">ZIP Code</label>
            <input
              id="billingZipCode"
              type="text"
              value={paymentDetails.billingAddress.zipCode}
              onChange={(e) => handleChange('billing.zipCode', e.target.value)}
              placeholder="10001"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="billingCountry">Country</label>
            <select
              id="billingCountry"
              value={paymentDetails.billingAddress.country}
              onChange={(e) => handleChange('billing.country', e.target.value)}
              required
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="AU">Australia</option>
              <option value="JP">Japan</option>
              {/* Add more countries as needed */}
            </select>
          </div>
        </div>
      </div>

      <div className="security-notice">
        <div className="security-icon">🔒</div>
        <div className="security-text">
          <strong>Secure Payment</strong>
          <p>Your payment information is encrypted and secure. We never store your card details.</p>
        </div>
      </div>
    </div>
  );
};