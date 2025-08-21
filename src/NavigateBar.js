import { NavLink, Outlet, useNavigate } from "react-router-dom";
import './styles/navigateBar.css';
import Icon from '@mdi/react';
import { mdiMenu, mdiClose } from '@mdi/js';
import { useState } from "react";

function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleOnRegister = () => {
    navigate('/myfood/register');
  };

  const showHamburgerNavMenu = () => {
    setIsMenuOpen(true);
  };

  const hideHamburgerNavMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      {/* Top navigation bar for desktop */}
      <div className="navigation-bar">
        <div id="part-1">
          <h1>my food</h1>
        </div>

        <div id="part-2">
          <NavLink
            to="/myfood"
            end
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Home
          </NavLink>
          <NavLink
            to="/myfood/about-us"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            About
          </NavLink>
          <NavLink
            to="/myfood/reviews"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Reviews
          </NavLink>
        </div>

        <div id="part-3">
          <button className="register" onClick={handleOnRegister}>Register</button>
          <div className="hamburger-icon" onClick={showHamburgerNavMenu}>
            <Icon path={mdiMenu} size={1.1} />
          </div>
        </div>
      </div>

      {/* Hamburger nav menu for small devices */}
      <div
        className="hamburger-nav-menu"
        style={{ right: isMenuOpen ? '0' : '-360px' }}
      >
        <div>
          <button className="close" onClick={hideHamburgerNavMenu}>
            <Icon path={mdiClose} size={1} />
          </button>
        </div>
        <NavLink
          to="/myfood"
          end
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Home
        </NavLink>
        <NavLink
          to="/myfood/about-us"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          About
        </NavLink>
        <NavLink
          to="/myfood/reviews"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Reviews
        </NavLink>
        <NavLink
          to="/myfood/register"
          className="nav-link"
          style={{ color: "#B9B9B9" }}
        >
          Register or log in
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}

export default NavigationBar;
