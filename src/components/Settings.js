import { useNavigate } from "react-router-dom";
/*import { FiLogOut } from "react-icons/fi"; 
import { MdLogout } from "react-icons/md"; */
import { RiLogoutBoxRLine } from "react-icons/ri"; 
import "../App.css";
const Settings = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <div className="settings-page">
      <i className="fas fa-cogs fa-3x card-icon"></i>
      <h1 className="text-center">Settings</h1>
      <p className="text-center">
        Manage your account and preferences here. You can log out anytime.</p>
      <div className="text-center" style={{ marginTop: "40px" }}>
        <button className="logout-btn" onClick={handleLogout}>
          <RiLogoutBoxRLine size={20} style={{ marginRight: "8px" }} />
          Logout
        </button>
      </div>
    </div>
  );
};
export default Settings;