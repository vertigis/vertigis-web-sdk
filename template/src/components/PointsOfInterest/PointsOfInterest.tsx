import { LayoutElement, LayoutElementProperties } from "@vertigis/web/components";
import { useWatchCollectionAndRerender } from "@vertigis/web/ui";
import MenuList from "@vertigis/web/ui/MenuList";
import Typography from "@vertigis/web/ui/Typography";
import React, { FC } from "react";

import PointsOfInterestModel from "./PointsOfInterestModel";
import PointOfInterest from "./PointOfInterest";
import "./PointsOfInterest.css";

const PointsOfInterest: FC<LayoutElementProperties<PointsOfInterestModel>> = (props) => {
    const { model } = props;
    // Re-render whenever points of interest are added or removed from the
    // collection.
    useWatchCollectionAndRerender(model.pointsOfInterest);
    return (
        <LayoutElement {...props} stretch className="PointsOfInterest">
            <Typography variant="h2">Points of Interest</Typography>
            <MenuList>
                {model.pointsOfInterest.toArray().map((poi) => (
                    <PointOfInterest
                        key={poi.id}
                        model={poi}
                        onClick={() => model.goto(poi)}
                        onDelete={() => model.pointsOfInterest.remove(poi)}
                    />
                ))}
            </MenuList>
        </LayoutElement>
    );
};

export default PointsOfInterest;
