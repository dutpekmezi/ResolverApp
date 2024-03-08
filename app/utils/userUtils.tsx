import { Session, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/utils/session";

export type UserCookies = {
    valid:boolean;
    accessToken:string;
    userId:string;
    session:Session;
};

let accessToken: string;
let userId: string;


export async function HasAccesTokenAndUserId(headers: Headers, cleanIfNotValid:boolean = false) : Promise<UserCookies> {
    const session = await getSession(
        headers.get("Cookie")
    );

    accessToken = session.get("accessToken") as string;
    userId = session.get("userId") as string;

    if (accessToken == null || userId == null)
	{
        session.unset("accessToken");
        session.unset("userId");

		return {"valid": false, "session": session} as UserCookies 
	}

    return {"valid": true, accessToken, userId} as UserCookies;
}

export async function RedirectToLoginIfUserInvalid(headers: Headers) : Promise<UserCookies>  {
    const userCookies = await HasAccesTokenAndUserId(headers);
  
    if (!userCookies.valid)
	{
		throw redirect("/login",{
            headers: {
                "Set-Cookie": await commitSession(userCookies.session),
            }
        });
	}

    return userCookies;
}

export {accessToken, userId};