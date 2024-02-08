import { ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	unstable_composeUploadHandlers,
	unstable_createMemoryUploadHandler,
	writeAsyncIterableToWritable
	} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getSession } from "~/session";
import { bucket } from "~/utils/firebase";

export async function loader({
    request,
  }: LoaderFunctionArgs) {
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const scene = session.get("scene");
  
    const data = { "scene": scene };
  
    return json(data);
}

async function UploadFileToFirebase(filename:string, data: AsyncIterable<Uint8Array>) : Promise<string>
{	
	const file = bucket.file(filename);

	await writeAsyncIterableToWritable(
		data,
		file.createWriteStream()
	);
	
	return file.publicUrl();
}

interface UploadResult
{
	fileName:string
};


export async function action ({ request }: ActionFunctionArgs) 
{
	const formData = await request.formData();
	const filename = formData.get("upload") as string;

	const uploadHandler = unstable_composeUploadHandlers(
		// our custom upload handler
		async ({ name, data }) => {
		  if (name !== "file") {
			return undefined;
		  }
		  let publicUrl:string = await UploadFileToFirebase(filename, data);
		  return publicUrl;
		},
		// fallback to memory for everything else
		unstable_createMemoryUploadHandler()
	  );

	return { filename };
};

export default function UploadObject()
{  
  	const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData() as UploadResult;

	if (actionData && actionData.fileName) {
		return <>Upload successful.</>;
	}

	return (
		<div>
			<p>{loaderData.scene}</p>
			<Form method="post" encType="multipart/form-data">
				<input type="file" name="upload" />
				<button type="submit">upload</button>
			</Form>
		</div>
	);
}