import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">GlobeTrotter</h3>
            <p className="text-gray-400">
              Your premier travel booking platform for unforgettable adventures around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/packages" className="text-gray-400 hover:text-white">Tour Packages</Link></li>
              <li><Link to="/destinations" className="text-gray-400 hover:text-white">Destinations</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">Flight Bookings</span></li>
              <li><span className="text-gray-400">Hotel Reservations</span></li>
              <li><span className="text-gray-400">Car Rentals</span></li>
              <li><span className="text-gray-400">Tour Packages</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-400">
              <p>📞 +254 799 626 531</p>
              <p>✉️ info@globetrotter.com</p>
              <p>📍 Moi Avenue, Nairobi, Kenya</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GlobeTrotter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;