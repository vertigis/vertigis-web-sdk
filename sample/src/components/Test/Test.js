import React from "react";
import { LayoutElement } from "@geocortex/web-viewer!/framework/components";

export default function Test(props) {
    return (
        <LayoutElement {...props}>
            <div>
                <img src="https://www.reactiongifs.us/wp-content/uploads/2013/07/its_working_star_wars.gif" />
            </div>
        </LayoutElement>
    );
}
