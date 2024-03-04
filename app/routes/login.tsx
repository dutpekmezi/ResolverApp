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
  const password = formData.get('password');

  return json({ success: true, message: 'Login successful!' });
};

export default function Login() {
    const actionData = useActionData<ActionData>();

    return (
      <center>
      <div className="register-container">
        <h1 className="form-title">Login</h1>
        {actionData?.success ? actionData?.message && <p className="success-message">{actionData.message}</p> : 
          actionData?.message && <p className="error-message">{actionData.message}</p>}
        <form method="post" className="register-form">
        <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="email" id="email" name="email" required className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input type="password" id="password" name="password" required className="form-input" />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        <Link to="/register" className="login-link">Don't have an account? Sign Up</Link>
      </div>
      </center>
    );
  }