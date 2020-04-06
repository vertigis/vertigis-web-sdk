import PointsOfInterest, { PointsOfInterestModel } from "./components/PointsOfInterest";
import { LibraryRegistry } from "@geocortex/web/config";
import { ComponentType } from "react";

const LAYOUT_NAMESPACE = "custom.foo";

export default function (registry: LibraryRegistry) {
    registry.registerComponent({
        name: "points-of-interest",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => PointsOfInterest as ComponentType,
        itemType: "points-of-interest-model",
        title: "Points of Interest",
    });
    registry.registerModel({
        getModelType: () => PointsOfInterestModel,
        itemType: "points-of-interest-model",
    });
    registry.registerCommand("points-of-interest.create");
}
