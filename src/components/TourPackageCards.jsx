import React, { useState } from "react";

const TourPackageCard = ({
  label,
  items = [],
  selectedItem,
  setSelectedItem,
  itemType = "hotel", 
}) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleItemChange = (e) => {
    const item = items.find((i) => String(i.id) === e.target.value);
    setSelectedItem(item);
    setSelectedRoom(null); 
  };

  const handleRoomChange = (e) => {
    if (!selectedItem) return;
    const room = selectedItem.room_types.find(
      (r) => String(r.id) === e.target.value
    );
    setSelectedRoom(room);
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>

      {/* Main Item Dropdown */}
      <select
        value={selectedItem?.id || ""}
        onChange={handleItemChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">-- Select {itemType} --</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {itemType === "hotel" && (
              <>
                {item.name} {item.rating ? `(${item.rating}⭐)` : ""}
              </>
            )}
            {itemType === "car" && (
              <>
                {item.make} {item.model} ({item.category})
                {item.daily_rate ? ` - $${item.daily_rate}/day` : ""}
              </>
            )}
          </option>
        ))}
      </select>

      {/* Details Section */}
      {selectedItem && (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          {/* Hotel details */}
          {itemType === "hotel" && (
            <>
              {selectedItem.description && (
                <p className="text-gray-700 mb-2">{selectedItem.description}</p>
              )}

              {selectedItem.room_types?.length > 0 && (
                <div className="mb-2">
                  <label className="block font-medium mb-1">
                    Select Room Type
                  </label>
                  <select
                    value={selectedRoom?.id || ""}
                    onChange={handleRoomChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">-- Choose Room --</option>
                    {selectedItem.room_types.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ${room.base_price} - Available:{" "}
                        {room.quantity}
                      </option>
                    ))}
                  </select>
                  {selectedRoom && (
                    <p className="mt-1 text-green-700 font-medium">
                      Selected Room Price: ${selectedRoom.base_price}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Car details */}
          {itemType === "car" && (
            <div>
              <p className="text-gray-700 mb-1">
                {selectedItem.make} {selectedItem.model} (
                {selectedItem.category})
              </p>
              {selectedItem.driver_name && (
                <p className="text-sm text-gray-600">
                  Driver: {selectedItem.driver_name}
                </p>
              )}
              {selectedItem.driver_contact && (
                <p className="text-sm text-gray-600">
                  Contact: {selectedItem.driver_contact}
                </p>
              )}
              {selectedItem.daily_rate && (
                <p className="text-green-700 font-medium">
                  Daily Rate: ${selectedItem.daily_rate}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TourPackageCard;
