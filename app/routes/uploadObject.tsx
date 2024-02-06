import { ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	unstable_parseMultipartFormData,
	unstable_composeUploadHandlers,
	unstable_createMemoryUploadHandler,
	writeAsyncIterableToWritable
	} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getStorage } from "firebase-admin/storage";
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

async function UploadFileToFirebase(filename:string, data: AsyncIterable<Uint8Array>) 
{	
	const file = bucket.file(filename);

	return await writeAsyncIterableToWritable(
		data,
		file.createWriteStream()
	);	
}


export async function action ({ request }: ActionFunctionArgs) 
{
	const formData = await request.formData();

	const uploadHandler = unstable_composeUploadHandlers(
		// our custom upload handler
		async ({ name, contentType, data, filename }) => {
		  if (name !== "file") {
			return undefined;
		  }
		  const uploadedImage = await UploadFileToFirebase(request data);
		  return uploadedImage.secure_url;
		},
		// fallback to memory for everything else
		unstable_createMemoryUploadHandler()
	  );

	return { "filename": filename };
};

export default function UploadObject()
{  
  	const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData();

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