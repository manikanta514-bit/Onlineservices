import { useNavigate } from "react-router-dom";
import { GiDrill } from "react-icons/gi";
import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";

const Installations = () => {
  const navigate = useNavigate();
  const { addBooking } = useContext(BookingContext);

  const installServices = [
    { name: "Ceiling Fan Installation", price: "₹299-₹499", desc: "Professional mount and wiring for ceiling fans.", img: "/images/install/fan installation.png" },
    { name: "RO Water Purifier Installation", price: "₹599-₹999", desc: "Wall or under-sink RO purifier fix & plumbing.", img: "/images/install/ROWinstallation.png" },
    { name: "Split AC Installation (1 Ton)", price: "₹1,299-₹1,999", desc: "Indoor + outdoor unit setup, piping, gas charging.", img: "/images/install/ac1ton.png" },
    { name: "Split AC Installation (1.5 Ton)", price: "₹1,499-₹2,299", desc: "Expert installation for 1.5 T split AC.", img: "/images/install/ac1.5ton.png" },
    { name: "Split AC Installation (2 Ton)", price: "₹1,499-₹2,299", desc: "Expert installation for 2 T split AC.", img: "/images/install/ac2ton.png" },
    { name: "LED TV Wall Mounting", price: "₹249-₹499", desc: "Secure mounting & wiring for LED/LCD Smart TVs.", img: "/images/install/Tvinstallation.png" },
    { name: "Geyser Installation", price: "₹499-₹999", desc: "Electric or gas geyser mounting & plumbing.", img: "/images/install/geysarinstallation.png" },
    { name: "Washing Machine Installation", price: "₹499-₹799", desc: "Top-/front-load installation & drainage setup.", img: "/images/install/washingmachine install.png" },
    { name: "Microwave Oven Installation", price: "₹299-₹599", desc: "Wall mounting or countertop microwave setup.", img: "/images/install/microwaveoven install.png" },
    { name: "Electric Chimney Installation", price: "₹399-₹799", desc: "Kitchen chimney mounting, duct work & suction check.", img: "/images/install/electrichimney install.png" },
    { name: "Refrigerator Installation", price: "₹299-₹499", desc: "Positioning, connection & cooling check of fridge.", img: "/images/install/refrigerator install.png" },
    { name: "Dishwasher Installation", price: "₹499-₹1,199", desc: "Built-in/hob built dishwasher plumbing & electrical setup.", img: "/images/install/dishwasher install.png" },
    { name: "Water Dispenser Installation", price: "₹249-₹499", desc: "Cold/hot water dispenser plumbing & electrical setup.", img: "/images/install/waterdispenserinstall.png" }
  ];

  const handleSub = (service) => {
    addBooking({ ...service, category: "Installations" });
    navigate("/myactivity");
  };

  return (
    <div className="guys-detail">
      <h1>
        Home Appliance Installation Services{" "}
        <GiDrill style={{ color: "gold", marginLeft: "8px" }} />
      </h1>
      <p>
        Certified technicians for reliable installations of household appliances at your doorstep.
      </p>
      <div className="guys-grid">
        {installServices.map((service, index) => (
          <div key={index} className="guys-card">
            {service.img && (
              <div className="logo-container">
                <img src={service.img} alt={service.name} className="service-logo" />
              </div>
            )}
            <h3>{service.name}</h3>
            <p>{service.desc}</p>
            <h4 className="guys-price">{service.price}</h4>
            <button className="guys-btn" onClick={() => handleSub(service)}>
              Book Service
            </button>
          </div>
        ))}
      </div>
      <div className="back-btn-container">
        <button className="back-btn" onClick={() => navigate("/services")}>
          Back to Services
        </button>
      </div>
    </div>
  );
};

export default Installations;
