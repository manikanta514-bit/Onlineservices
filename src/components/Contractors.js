import React from "react";

const Contractors = () => {
  const workersData = {
    Cleaning: [
      { name: "Sita Devi", skill: "Deep Home Cleaner", exp: "6 years of professional cleaning", price: "₹249/hr", img: "/images/cleaner1.png" },
      { name: "Ramesh Kumar", skill: "Office Cleaning Expert", exp: "3 years in corporate sanitization", price: "₹299/hr", img: "/images/cleaner2.png" },
      { name: "Meena Sharma", skill: "Kitchen & Bathroom Specialist", exp: "5 years in hygiene services", price: "₹349/hr", img: "/images/cleaner3.png" },
      { name: "Asha Patel", skill: "Move-In/Move-Out Cleaning", exp: "7 years of service", price: "₹399/hr", img: "/images/cleaner4.png" },
      { name: "Lakshmi Rao", skill: "Window & Glass Cleaning", exp: "4 years in residential services", price: "₹279/hr", img: "/images/cleaner5.png" },
      { name: "Nandini Singh", skill: "Carpet & Upholstery Cleaner", exp: "6 years in deep cleaning", price: "₹329/hr", img: "/images/cleaner6.png" },
      { name: "Priya Iyer", skill: "Eco-Friendly Cleaning Specialist", exp: "3 years in organic cleaning", price: "₹299/hr", img: "/images/cleaner7.png" },
      { name: "Geeta Verma", skill: "Floor & Tile Cleaning Expert", exp: "5 years of experience", price: "₹349/hr", img: "/images/cleaner8.png" },
    ],
    Repairs: [
      { name: "Ravi Kumar", skill: "Electrician", exp: "5 years in wiring & appliance repair", price: "₹299/hr", img: "/images/electrician1.png" },
      { name: "Vikram Singh", skill: "Plumber", exp: "4 years of plumbing fixes", price: "₹349/hr", img: "/images/plumber1.png" },
      { name: "Anil Mehta", skill: "AC & Fridge Repair", exp: "6 years in appliance repair", price: "₹449/hr", img: "/images/repair1.png" },
      { name: "Sunil Reddy", skill: "General Handyman", exp: "8 years in home repairs", price: "₹299/hr", img: "/images/handyman.png" },
      { name: "Kiran Das", skill: "Carpenter", exp: "7 years of woodwork & furniture fixes", price: "₹399/hr", img: "/images/carpenter1.png" },
      { name: "Ajay Nair", skill: "Computer & Laptop Repair", exp: "5 years in IT hardware support", price: "₹349/hr", img: "/images/repair2.png" },
      { name: "Mohit Chauhan", skill: "Water Purifier Technician", exp: "4 years in RO system servicing", price: "₹329/hr", img: "/images/repair3.png" },
      { name: "Farhan Ali", skill: "Refrigerator & Washing Machine Expert", exp: "6 years in appliance services", price: "₹449/hr", img: "/images/repair4.png" },
    ],
    Installations: [
      { name: "Amit Sharma", skill: "TV & Entertainment Setup", exp: "5 years experience", price: "₹349/hr", img: "/images/install1.png" },
      { name: "Deepak Joshi", skill: "Furniture Assembly Expert", exp: "3 years in modular furniture installation", price: "₹299/hr", img: "/images/install2.png" },
      { name: "Pooja Verma", skill: "Light & Fan Installation", exp: "4 years in electrical fitting", price: "₹249/hr", img: "/images/install3.png" },
      { name: "Harish Naidu", skill: "New Appliance Installer", exp: "6 years in home appliance setup", price: "₹399/hr", img: "/images/install4.png" },
      { name: "Rajeev Menon", skill: "Smart Home Setup", exp: "4 years in IoT device installations", price: "₹449/hr", img: "/images/install5.png" },
      { name: "Shalini Gupta", skill: "CCTV & Security Systems", exp: "5 years in surveillance setup", price: "₹499/hr", img: "/images/install6.png" },
      { name: "Ankush Batra", skill: "Kitchen Appliance Installer", exp: "6 years in modular kitchens", price: "₹399/hr", img: "/images/install7.png" },
      { name: "Rohit Malhotra", skill: "Water Heater & Geyser Setup", exp: "4 years of service", price: "₹349/hr", img: "/images/install8.png" },
    ],
    Painting: [
      { name: "Sanjay Kumar", skill: "Interior Wall Painter", exp: "7 years in residential painting", price: "₹399/hr", img: "/images/painter1.png" },
      { name: "Anita Joshi", skill: "Exterior Painting Specialist", exp: "6 years in outdoor paint work", price: "₹449/hr", img: "/images/painter2.png" },
      { name: "Rohit Singh", skill: "Decorative & Mural Painter", exp: "5 years of creative painting", price: "₹499/hr", img: "/images/painter3.png" },
      { name: "Meera Iyer", skill: "Wood & Furniture Painter", exp: "4 years in furniture finishing", price: "₹399/hr", img: "/images/painter4.png" },
      { name: "Ajay Patel", skill: "Wallpaper & Textured Paint", exp: "3 years in specialty painting", price: "₹349/hr", img: "/images/painter5.png" },
      { name: "Sunita Reddy", skill: "Eco-Friendly Paint Specialist", exp: "4 years in green painting solutions", price: "₹429/hr", img: "/images/painter6.png" },
      { name: "Karan Mehta", skill: "Commercial Painter", exp: "6 years in office and retail painting", price: "₹479/hr", img: "/images/painter7.png" },
      { name: "Pooja Sharma", skill: "Ceiling & Drywall Painter", exp: "5 years experience", price: "₹399/hr", img: "/images/painter8.png" },
    ],
  };

  return (
    <div className="workers-container">
      <h2 className="workers-title">Our Skilled Workers</h2>
      {Object.entries(workersData).map(([category, workers]) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="workers-grid">
            {workers.map((worker, index) => (
              <div key={index} className="worker-card">
                <img src={worker.img} alt={worker.name} className="worker-img" />
                <h3>{worker.name}</h3>
                <p><b>Skill:</b> {worker.skill}</p>
                <p><b>Experience:</b> {worker.exp}</p>
                <p><b>Charges:</b> {worker.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contractors;
