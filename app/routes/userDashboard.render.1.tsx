import { ActionFunctionArgs,
	LoaderFunctionArgs,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_parseMultipartFormData as parseMultipartFormData,
	unstable_createFileUploadHandler as createFileUploadHandler,
	UploadHandler,
	redirect
	} from "@remix-run/node";
import { getSession } from "~/utils/session";
import {googleCloudUploadHandler} from "../services/googleCloudService"
import { RedirectToLoginIfUserInvalid, userId } from "~/utils/userUtils";
import DragDropFileUpload from "~/components/DragDropFile";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FetchAllModelsResponse, FetchAllModels as FetchAllModelsRequest, Model } from "~/services/userService";
import ModelSelectionBox from "~/components/ModelSelectionBox";

type LoaderData = {
	scene:string;
	userId:string;
	fetchAllModelsResponse:FetchAllModelsResponse;
  };

export async function loader({ request }: LoaderFunctionArgs) 
{	
    const session = await getSession(
      request.headers.get("Cookie")
    );
  
    const scene = session.get("scene");
  
    if (scene == null)
	{
		throw redirect("/userDashboard/render");
	}

	const fetchAllModelsResponse = await FetchAllModelsRequest();
  
    return {scene, userId, fetchAllModelsResponse};
}

type ActionData = {
	success:Boolean;
	message:string;
	actionType:string;
	isNameTaken?:boolean;
  };

export async function action ({ request }: ActionFunctionArgs) : Promise<ActionData>
{
	await RedirectToLoginIfUserInvalid(request.headers);

	const uploadHandler: UploadHandler = composeUploadHandlers(
		googleCloudUploadHandler,
		createFileUploadHandler(),
	);

	const formData = await parseMultipartFormData(request, uploadHandler);

	const uploadResult = formData.get("fileUpload");

	if (!uploadResult) {
		return {
			success: false,
			message: "Couldn't upload file.",
			actionType: "upload"
		};
	}

	return JSON.parse(uploadResult.toString())
};

export default function UploadObject()
{

	const fetcher = useFetcher<ActionData>();
	const loader = useLoaderData<LoaderData>();

	const [overridingModel, setOverridingModel] = useState(false);
	const [modelNameValid, setModelNameValid] = useState(false);

	useEffect(() => {
		if (fetcher.data) 
		{
			if (fetcher.data.success && fetcher.data.actionType == "nameCheck" && fetcher.data.isNameTaken == false)
			{
				setModelNameValid(true);
			}
			
			if (fetcher.data.success && fetcher.data.actionType == "upload" )
			{
				setModelNameValid(false);
			}
		}

	}, [fetcher.data]);

	const _fileInputRef = useRef<HTMLInputElement>(null);

	var uploadState = null;

	if (fetcher.state != "idle")
	{
		uploadState = <h4 className="text">{(overridingModel == false && modelNameValid == false) ? "Status: Checking if model name exist.." : "Uploading File.."} </h4>;
	}
	else if (fetcher.data)
	{
		uploadState = <h4 className="text">Status: {fetcher.data.message}</h4>
	}

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => 
		{
			event.preventDefault();
			if (_fileInputRef.current && _fileInputRef.current.files && _fileInputRef.current.files.length > 0) {
				//const file = fileInputRef.current?.files?.item(0);
				const file = _fileInputRef.current.files[0];

				const formData = new FormData();
				formData.append('fileUpload', file);

				if (overridingModel == false && modelNameValid == false)
				{
					fetcher.submit(formData,
					{
						action: "isFileExist",
						method: "post",
						encType: "multipart/form-data",
					});
				}
				else
				{
					fetcher.submit(formData,
					{
						method: "post",
						encType: "multipart/form-data",
					});
				}
			}
        },
        [fetcher, overridingModel],
      );

	  const handleOverrideModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOverridingModel(event.target.checked);
	  };

	const models = loader.fetchAllModelsResponse.models.map((model) => ModelSelectionBox(model as unknown as Model));

	return (
	  <center>
		<h2 className="text">Upload New Model</h2>
		<fetcher.Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
			<div className="upload-model-form">
				<DragDropFileUpload onFileChange={() => { setModelNameValid(false); }} fileInputRef={_fileInputRef} />
				<div className="upload-model-override-checkbox">
					<label className='text' htmlFor="overrideModel">Override Existing Model</label>
					<input id="overrideModel" name="overrideModel" type="checkbox" onChange={handleOverrideModelChange}/>
				</div>
			</div>
			<button className="upload-mode-button" type="submit" >{overridingModel || modelNameValid ? "Upload Model" : "Check File Exist"}</button>
		</fetcher.Form>
		{uploadState}

		<Outlet/>
		<div className="existing-model-selection-wrapper">
			{models}
		</div>

	  </center>
	);
}