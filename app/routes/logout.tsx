import { ActionFunction, ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import styles from '~/styles/userDashboard.css';
import { commitSession, getSession } from '~/utils/session';
import { RedirectToLoginIfUserInvalid } from '~/utils/userUtils';

export function links() {
    return [{ rel: 'stylesheet', href: styles }];
}

export async function loader({request}: LoaderFunctionArgs) {

   await RedirectToLoginIfUserInvalid(request.headers);
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {  
    
    const session = await getSession(
        request.headers.get("Cookie")
    );

    session.unset("accessToken");
    session.unset("userId");

    throw redirect("/login",{
        headers: {
            "Set-Cookie": await commitSession(session),
        }
    });
};

export default function Logout()
{
    return (<>
        <h3>Logging out..</h3>
    </>);
}