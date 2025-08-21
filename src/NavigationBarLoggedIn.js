import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Icon from '@mdi/react';
import {
  mdiShoppingOutline,
  mdiLogout,
  mdiMagnify,
  mdiMenu,
  mdiClose,
  mdiAccountCircle
} from '@mdi/js';
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Mapp from "./Mapp";

function NavigationBarLoggedIn({ user, onLogout }) {
  const [shoppingBasketCount, setShoppingBasketCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
  };

  // Get location info from localStorage
  const userLocation = JSON.parse(localStorage.getItem('user_location')) || {};

  const updateBasketCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setShoppingBasketCount(totalItems);
  };

  useEffect(() => {
    updateBasketCount();

    const onCartUpdated = () => updateBasketCount();
    const onStorageChange = (event) => {
      if (event.key === 'cart') updateBasketCount();
    };

    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  const handleOnLogOut = async () => {
    localStorage.removeItem("user");
    navigate('/myfood/login');
  };

  const showHamburgerNavMenu = () => setIsMenuOpen(true);
  const hideHamburgerNavMenu = () => setIsMenuOpen(false);

  return (
    <div>
      <div className="login-top-navigation-bar">
        <div id="part-1">
          <Icon path={mdiMagnify} size={1} rotate={90} />
          <SearchBar />
          
        </div>

        <div id="part-2" style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
          <button
            onClick={() => navigate('/myfood/payment')}
            className="shopping-basket"
          >
            <Icon path={mdiShoppingOutline} size={1} />
            <span style={{ visibility: shoppingBasketCount === 0 ? 'hidden' : 'visible' }}>
              {shoppingBasketCount}
            </span>
          </button>

          <button className="log-out" onClick={handleOnLogOut}>
            <Icon path={mdiLogout} size={1} />
          </button>

          <button onClick={toggleProfileDropdown} className="profile-icon-button">
            <Icon path={mdiAccountCircle} size={1.5} />
          </button>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <p style={{textTransform: 'capitalize'}}><strong>{user?.username || 'Unknown User'}</strong></p>
              <p>{user?.email || 'No Email'}</p>
              <NavLink to="/myfood/history">View Order History</NavLink>
            </div>
          )}
        </div>
      </div>

      <div className="login-navigation-bar">
        <h1>my food</h1>
        <div className="profile-image"></div>
        <h2>{user?.displayName}</h2>
        <NavLink
          style={({ isActive }) => ({
            backgroundColor: isActive ? "rgb(252, 72, 102)" : "transparent"
          })}
          to='/myfood/categories'
        >
          <p>Categories</p>
        </NavLink>
        <NavLink
          style={({ isActive }) => ({
            backgroundColor: isActive ? "rgb(252, 72, 102)" : "transparent"
          })}
          to='/myfood/payment'
        >
          <p>Payment</p>
        </NavLink>
         <NavLink
          style={({ isActive }) => ({
            backgroundColor: isActive ? "rgb(252, 72, 102)" : "transparent"
          })}
          to='/myfood/history'
        >
          <p>Orders</p>
        </NavLink>
        <NavLink
          style={({ isActive }) => ({
            backgroundColor: isActive ? "rgb(252, 72, 102)" : "transparent"
          })}
          to='/myfood/about-us'
        >
          <p>About us</p>
        </NavLink>
      </div>

      <div className="login-top-navigation-bar-small-devices">
        <div id="part-1">
          <h1>my food</h1>
        </div>
        <div id="part-2">
          <button
            className="shopping-basket"
            onClick={() => navigate('/myfood/payment')}
          >
            <Icon path={mdiShoppingOutline} size={1} />
            <span style={{ visibility: shoppingBasketCount === 0 ? 'hidden' : 'visible' }}>
              {shoppingBasketCount}
            </span>
          </button>
          <div className="hamburger-icon" onClick={showHamburgerNavMenu}>
            <Icon path={mdiMenu} size={1.1} />
          </div>
        </div>
      </div>

      <div
        className="login-hamburger-nav-menu"
        style={{ right: isMenuOpen ? '0' : '-360px' }}
      >
        <div>
          <button className="close" onClick={hideHamburgerNavMenu}>
            <Icon path={mdiClose} size={1} />
          </button>
        </div>
        <div id="part-1">
          <div className="profile-image"></div>
          <h3>{user?.displayName}</h3>
        </div>
        <NavLink to='/myfood/categories'><p>Categories</p></NavLink>
        <NavLink to='/myfood/payment'><p>Payment</p></NavLink>
        <NavLink to='/myfood/about-us'><p>About us</p></NavLink>
        <div id="part-3">
          <Icon path={mdiMagnify} size={1} rotate={90} />
          <SearchBar />
        </div>
        <a id="part-4" onClick={handleOnLogOut}>Log out</a>
      </div>

      <Outlet />
    </div>
  );
}

export default NavigationBarLoggedIn;
