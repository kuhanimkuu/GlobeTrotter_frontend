import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  const links = [];

  if (role === "admin") {
    links.push(
      { to: "/admin/hotels", label: "Manage Hotels" },
      { to: "/admin/cars", label: "Manage Cars" },
      { to: "/admin/destinations", label: "Manage Destinations" },
      { to: "/settings", label: "Settings" }
    );
  }

  if (role === "organizer") {
    links.push(
      { to: "/organizer/packages", label: "Manage Tour Packages" },
      { to: "/settings", label: "Settings" }
    );
  }

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 capitalize">{role} Dashboard</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="block px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
