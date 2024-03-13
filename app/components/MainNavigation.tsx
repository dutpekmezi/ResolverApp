import { Form, NavLink } from '@remix-run/react';

export default function MainNavigation(isLoggedIn:boolean) {
  return (
    <nav id="main-navigation">
      {
      isLoggedIn ?

      <ul>
        <li className="nav-item">
          <NavLink to="/userDashboard">Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/userDashboard/render">Render</NavLink>
        </li>
        <li className="nav-item">
          <Form method='post' action='/logout'>
          <button type="submit" className="submit-button">Logout</button>
          </Form>
        </li>
      </ul> :   

      <ul>
        <li className="nav-item">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/login">login</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/register">Register</NavLink>
        </li>
      </ul>
      }
    </nav>
  );
}