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
      metadata: { note: booking.note || 'Payment for flight booking' },
    };

    // Call your fake API
    const paymentResult = await api.payments.create(paymentPayload);

    // Wrap with all details receipt needs
    const enrichedPayment = {
      ...paymentResult,
      method: paymentMethod,
      transaction_id: paymentResult.transaction_id || `TXN-${Date.now()}`,
      amount,
      currency,
      status: paymentResult.status || 'success',
      date: new Date().toISOString(),
    };

    navigate('/receipt', {
      state: { booking, payment: enrichedPayment },
    });
  } catch (err) {
    setError(err.message || 'Payment processing failed');
  } finally {
    setLoading(false);
  }
};


  if (!booking || !booking.id || !amount) {
    return (
      <div className="min-h-screen bg-white py-8">
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16 mb-12">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Invalid Booking
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Please complete your booking first
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16 mb-12">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Complete Your
            <span className="block text-yellow-400">Payment</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Secure and easy payment process
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b-2 border-gray-100">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">{format.currency(amount, currency)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-yellow-600">{format.currency(amount, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

              {/* Payment method selection */}
              <div className="space-y-4 mb-8">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-400 cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mr-4 w-5 h-5 text-yellow-600"
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Credit / Debit Card</span>
                    <p className="text-sm text-gray-600">Pay with your credit or debit card</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-400 cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mr-4 w-5 h-5 text-yellow-600"
                  />
                  <div>
                    <span className="font-semibold text-gray-900">PayPal</span>
                    <p className="text-sm text-gray-600">Pay securely with PayPal</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-400 cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile"
                    checked={paymentMethod === 'mobile'}
                    onChange={() => setPaymentMethod('mobile')}
                    className="mr-4 w-5 h-5 text-yellow-600"
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Mobile Money</span>
                    <p className="text-sm text-gray-600">Pay with mobile money</p>
                  </div>
                </label>
              </div>

              {/* Card details form */}
              {paymentMethod === 'card' && (
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      name="number"
                      value={cardDetails.number}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay ${format.currency(amount, currency)}`
                )}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  🔒 Your payment is secure and encrypted
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;