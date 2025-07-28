import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      <button onClick={toggleMenu} className="profile-button">
        <FaUserCircle size={24} />
      </button>
      {showMenu && (
        <div className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <div className="user-details">
                <div className="user-info-header">
                  <FaUserCircle size={32} />
                  <div className="user-text">
                    <h4>{user.firstName} {user.lastName}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/businesses/manage');
                  closeMenu();
                }}
              >
                📋 Manage My Businesses
              </button>
              
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/businesses/new');
                  closeMenu();
                }}
              >
                ➕ Add New Business
              </button>
              
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/reviews/manage');
                  closeMenu();
                }}
              >
                ⭐ My Reviews
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item logout-btn" onClick={logout}>
                🚪 Log Out
              </button>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ProfileButton;
