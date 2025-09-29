import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
   
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      

      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'info@globetrotter.com',
      description: 'Send us an email anytime',
      link: 'mailto:globetrotter@gmail.com'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+254 799 626 531',
      description: 'Mon-Fri from 8am to 6pm',
      link: 'tel:+254799626531'
    },
    {
      icon: '💬',
      title: 'Chat Support',
      details: 'Live Chat Available',
      description: '24/7 customer support',
      link: '#chat'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Adventure Street',
      description: 'Moi Avenue, Nairobi, Kenya',
      link: '#map'
    }
  ];

  const faqs = [
    {
      question: "How far in advance should I book my tour?",
      answer: "We recommend booking at least 2-3 months in advance for international tours and 1 month for domestic tours to ensure availability."
    },
    {
      question: "What's included in the tour package price?",
      answer: "Our packages typically include accommodation, transportation, guided tours, and some meals. Specific inclusions are detailed in each package description."
    },
    {
      question: "Do you offer custom tour packages?",
      answer: "Yes! We specialize in creating personalized itineraries. Contact us with your requirements, and we'll design your dream vacation."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Cancellations made 30+ days before departure receive a full refund. Between 15-30 days, we offer 50% refund. Less than 15 days is non-refundable."
    }
  ];

  const teamMembers = [
    {
      name: "David Murunga",
      role: "Travel Consultant",
      image: "/images/team/david.jpg",
      bio: "Specialized in African safaris and adventure tours with 8 years of experience.",
      email: "david@adventuretrip.com"
    },
    {
      name: "Peter Mwangi",
      role: "Destination Expert",
      image: "/images/team/peter.jpg",
      bio: "Expert in Asian and European destinations. Fluent in 4 languages.",
      email: "peter@adventuretrip.com"
    },
    {
      name: "Elvis Ochieng",
      role: "Luxury Travel Specialist",
      image: "/images/team/elvis.jpg",
      bio: "Creating bespoke luxury experiences for discerning travelers worldwide.",
      email: "elvis@adventuretrip.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-28">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Get In Touch
            <span className="block text-yellow-400">With Us</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Ready to start your adventure? Our travel experts are here to help you plan the perfect trip.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400 group text-center"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                {method.title}
              </h3>
              <p className="text-lg font-semibold text-blue-600 mb-1">{method.details}</p>
              <p className="text-gray-600 text-sm">{method.description}</p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-yellow-400 transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6">
                ✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Assistance</option>
                  <option value="custom">Custom Tour Request</option>
                  <option value="support">Customer Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Tell us about your travel plans, questions, or how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Sending Message...
                  </span>
                ) : (
                  'Send Message →'
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Team */}
          <div className="space-y-8">
            {/* Office Hours */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Office Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="font-semibold">Monday - Friday</span>
                  <span className="text-blue-600 font-bold">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="font-semibold">Saturday</span>
                  <span className="text-blue-600 font-bold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold">Sunday</span>
                  <span className="text-blue-600 font-bold">10:00 AM - 4:00 PM</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-100 rounded-xl border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <span className="font-bold">Emergency Support:</span> Available 24/7 for existing bookings
                </p>
              </div>
            </div>

            {/* Meet the Team */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-yellow-400 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Meet Our Experts</h3>
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4 group cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-800">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-blue-600 text-sm font-semibold">{member.role}</p>
                      <p className="text-gray-600 text-xs">{member.bio}</p>
                      <a 
                        href={`mailto:${member.email}`}
                        className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about our services
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-yellow-400 transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-yellow-500 mr-3">❓</span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions? We're happy to help!
            </p>
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 inline-block"
            >
              Contact Our Support Team
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's create your perfect travel experience together. Contact us now and let the adventure begin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tour-packages"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              🌍 Explore Packages
            </Link>
            <a
              href="tel:+15551234567"
              className="border-2 border-white hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Come see us in person! We'd love to discuss your travel plans face-to-face.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Google Maps iframe */}
                <div className="rounded-2xl overflow-hidden h-80 shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.166584890607!2d36.81664655!3d-1.2863892499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d45c9d17f9%3A0x8bbf51f7e0e8611!2sMoi%20Avenue%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1727600000000!5m2!1sen!2ske"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Address</h3>
                  <p className="text-gray-600">
                    GlobeTrotter Headquarters<br />
                    Moi Avenue<br />
                    Nairobi 00100, Kenya
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Getting Here</h3>
                  <p className="text-gray-600 text-sm">
                    • 10 min walk from City Center Station<br />
                    • Parking available onsite<br />
                    • Wheelchair accessible<br />
                    • Free WiFi for visitors
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Local Attractions</h3>
                  <p className="text-gray-600 text-sm">
                    Near Nairobi National Park, Giraffe Centre, and Karen Blixen Museum. Perfect starting point for your Kenyan adventure!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;