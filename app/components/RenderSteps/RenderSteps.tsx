import { useLocation } from "@remix-run/react";
import RenderStepArrow from "./RenderStepArrow";

type RenderStepsData = {
    titles? :string[]
};

export default function RenderSteps(data:RenderStepsData)
{
    const location = useLocation()

    const splitted = location.pathname.split("/");
    
    let currentIndex = 0;

    for (let i = 0; i < splitted.length; i++) 
    {
        if (splitted[i] == "render")
        {
            if (i+1 < splitted.length)
            {
                currentIndex = parseInt(splitted[i + 1]);
            }
        }
    }

    const arrows = data.titles?.map((title, index) => RenderStepArrow(index, index == currentIndex, title))

    return(
        <div className="wrap">
            {arrows}
        </div>
    );
}