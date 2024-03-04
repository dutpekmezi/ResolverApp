import { NavLink } from '@remix-run/react';

export default function MainNavigation() {
  return (
    <nav id="main-navigation">
      <ul>
        <li className="nav-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/About">About</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/login">login</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/register">Register</NavLink>
        </li>
      </ul>
    </nav>
  );
}