import { redirect } from "@remix-run/node";

export default async function Fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
{
    const response = await fetch(input, init);

    if (response.status == 401)
    {
        throw redirect("/login");
    }

    return response;
}