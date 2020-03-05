import React from "react";
import Button from "@material-ui/core/Button";

const bar: AppConfig = {};

const foo: ButtonProps = {};

export default function Test(props) {
    return (
        <LayoutElement {...props}>
            {/* <Button>Hey</Button> */}
            <ButtonBase></ButtonBase>
            <ListItem></ListItem>
            <div>
                <img src="https://www.reactiongifs.us/wp-content/uploads/2013/07/its_working_star_wars.gif" />
            </div>
        </LayoutElement>
    );
}
