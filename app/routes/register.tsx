import { ActionFunction, json, redirect } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { Register as RegisterRequest, RegisterRequestData, RegisterResponse } from '~/services/authenticateService';
import { useNavigate } from '@remix-run/react';

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

  const email = formData.get('email') as string;
  const fullName = formData.get('fullName') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password != confirmPassword)
  {
      return json({ success: false, message: 'Confirm Password doesn\'t match!' });
  }

  const registerRequest: RegisterRequestData = {
    email: email,
    fullname:fullName,
    password:password
};

  const registerResponse:RegisterResponse = await RegisterRequest(registerRequest);

  if (!registerResponse.success)
  {
    return json({ success: registerResponse.success, message: registerResponse.message });
  }
  else
  {
    return redirect("/login")
  }
  
};

export default function Register() {
    const actionData = useActionData<ActionData>();
    const navigate = useNavigate();

    return (
      <center>
      <div className="register-container">
        { (actionData != null && actionData?.success) ? 
        <h2 className="form-title">You are being redirected to login...</h2>: 
        <>
          <h1 className="form-title">Register</h1>
          {actionData?.success ? actionData?.message && <p className="success-message">{actionData.message}</p> : 
            actionData?.message && <p className="error-message">{actionData.message}</p>}
          <Form method="post" className="register-form">
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
          </Form>
          <Link to="/login" className="login-link">Already have an account? Log in</Link>
        </> }
      </div>
      </center>
    );
}