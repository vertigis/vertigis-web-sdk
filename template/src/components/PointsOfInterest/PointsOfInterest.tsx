import { LayoutElement, LayoutElementProperties } from "@geocortex/web/components";
import { useWatchCollectionAndRerender } from "@geocortex/web/ui";
import MenuList from "@geocortex/web/ui/menu-list";
import Typography from "@geocortex/web/ui/typography";
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
