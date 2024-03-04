import { ActionFunction, json } from '@remix-run/node';
import { Link, useActionData } from '@remix-run/react';

import styles from '~/styles/register.css';

export function links() {
    return [{ rel: 'stylesheet', href: styles }];
}
type ActionData = {
    success:boolean,
    message:string
};

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const fullName = formData.get('fullName');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  if (password != confirmPassword)
  {
      return json({ success: false, message: 'Password doesn\'t match!' });
  }

  return json({ success: true, message: 'Registration successful!' });
};

export default function Register() {
    const actionData = useActionData<ActionData>();

    return (
      <center>
      <div className="register-container">
        <h1 className="form-title">Register</h1>
        {actionData?.success ? actionData?.message && <p className="success-message">{actionData.message}</p> : 
          actionData?.message && <p className="error-message">{actionData.message}</p>}
        <form method="post" className="register-form">
        <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="email" id="email" name="email" required className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name:</label>
            <input type="text" id="fullName" name="fullName" required className="form-input" placeholder='John Doe'/>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input type="password" id="password" name="password" required className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required className="form-input" />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
        <Link to="/login" className="login-link">Already have an account? Log in</Link>
      </div>
      </center>
    );
  }