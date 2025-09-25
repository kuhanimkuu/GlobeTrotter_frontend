
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { api } from '../../services/api';
import { format } from '../../utils/format';
import { validation } from '../../utils/validation';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const booking = state?.booking;
 const amount = state?.amount !== undefined ? state.amount : (booking?.total ? parseFloat(booking.total) : 0);
const currency = state?.currency || booking?.currency || 'USD';

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    if (!booking?.id) throw new Error('Booking data is missing');

        const paymentPayload = {
      booking_id: booking.id,
      gateway: 'fake', 
      idempotency_key: `booking-${booking.id}-${Date.now()}`,
      return_urls: {
        success: 'https://yourfrontend.com/success',
        failure: 'https://yourfrontend.com/failure',
      },
      payment_method: paymentMethod,
      amount,
      currency,
      metadata: { note: booking.note || 'Payment for hotel booking' },
    };

    const paymentResult = await api.payments.create(paymentPayload);

    navigate('/receipt', {
      state: { booking, payment: paymentResult },
    });
  } catch (err) {
    setError(err.message || 'Payment processing failed');
  } finally {
    setLoading(false);
  }
};

  if (!booking || !booking.id || !amount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Booking</h2>
          <p className="text-gray-600">Please complete your booking first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{format.currency(amount, currency)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{format.currency(amount, currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

          {/* Payment method selection */}
          <div className="space-y-2 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="mr-2"
              />
              Credit / Debit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                className="mr-2"
              />
              PayPal
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="mobile"
                checked={paymentMethod === 'mobile'}
                onChange={() => setPaymentMethod('mobile')}
                className="mr-2"
              />
              Mobile Money
            </label>
          </div>

          {/* Card details form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardChange}
                placeholder="Card Number"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleCardChange}
                placeholder="Cardholder Name"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  className="w-1/2 border rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="CVV"
                  className="w-1/2 border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay ${format.currency(amount, currency)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
