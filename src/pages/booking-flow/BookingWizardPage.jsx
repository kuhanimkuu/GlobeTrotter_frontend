import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { api } from '../../services/api';

const BookingWizardPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bookingType = state?.type;
  const bookingData = state?.data;

  const [formData, setFormData] = useState({
    passengers: [{
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: '',
      date_of_birth: '',
      gender: 'male'
    }],
    special_requests: ''
  });

  const steps = [
    { number: 1, title: 'Passenger Details' },
    { number: 2, title: 'Review & Confirm' },
    { number: 3, title: 'Payment' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        type: bookingType,
        data: bookingData,
        passengers: formData.passengers,
        special_requests: formData.special_requests
      };

      const response = await api.booking.create(bookingPayload);
      navigate('/booking-flow/payment', { state: { booking: response } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingType || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Booking Data</h2>
          <p className="text-gray-600">Please select a service to book</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step.number}
              </div>
              <span className="ml-2 text-sm font-medium hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
              {/* Passenger form fields */}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review Booking</h2>
              {/* Review content */}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => currentStep < 3 ? setCurrentStep(currentStep + 1) : handleSubmit()}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {currentStep === 3 ? 'Complete Booking' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWizardPage;