import { useLocation } from "@remix-run/react";
import RenderStepArrow from "./RenderStepArrow";

type RenderStepsData = {
    titles? :string[]
};

export default function RenderSteps(data:RenderStepsData)
{
    const location = useLocation()

    console.log(`pathname: ${location.pathname}`);
    const splitted = location.pathname.split("/");
    
    let currentIndex = parseInt(splitted[splitted.length - 1]);

    if (Number.isNaN(currentIndex))
    {
        currentIndex = 0;
    }

    const arrows = data.titles?.map((title, index) => RenderStepArrow(index, index == currentIndex, title))

    return(
        <div className="wrap">
            {arrows}
        </div>
    );
}