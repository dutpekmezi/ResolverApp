import { ActionFunction, ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { Login as LoginRequest, LoginResponse } from '~/services/authenticateService';
import { commitSession, getSession } from "~/utils/session";

import styles from '~/styles/register.css';

export function links() {
    return [{ rel: 'stylesheet', href: styles }];
}
type ActionData = {
    success:boolean,
    message:string
};

// Action function to handle form submission
export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const loginResponse:LoginResponse = await LoginRequest(email, password);

  const session = await getSession(
    request.headers.get("Cookie")
  );

  session.set("accessToken", loginResponse.accessToken);
  session.set("userId", loginResponse.userId);
  
  if (!loginResponse.success)
  {
    return json({ success: loginResponse.success, message: loginResponse.message });
  }

  return redirect("/userDashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    }
  });
};

export default function Login() {
    const actionData = useActionData<ActionData>();

    return (
      <center>
      <div className="register-container">
        <h1 className="form-title">Login</h1>
        {actionData?.success ? actionData?.message && <p className="success-message">{actionData.message}</p> : 
          actionData?.message && <p className="error-message">{actionData.message}</p>}
        <Form method="post" className="register-form">
        <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="email" id="email" name="email" required className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input type="password" id="password" name="password" required className="form-input" />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </Form>
        <Link to="/register" className="login-link">Don't have an account? Sign Up</Link>
      </div>
      </center>
    );
  }