import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <Link to="/admin" className="block hover:text-gray-300">Dashboard</Link>
          <Link to="/admin/cars" className="block hover:text-gray-300">Manage Cars</Link>
          <Link to="/admin/hotels" className="block hover:text-gray-300">Manage Hotels</Link>
          <Link to="/admin/destinations" className="block hover:text-gray-300">Manage Destinations</Link>
          <Link to="/admin/tour-packages" className="block hover:text-gray-300">Manage Tour Packages</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
