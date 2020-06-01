import PointsOfInterest, { PointsOfInterestModel } from "./components/PointsOfInterest";
import { LibraryRegistry } from "@vertigis/web/config";

const LAYOUT_NAMESPACE = "custom.foo";

export default function (registry: LibraryRegistry) {
    registry.registerComponent({
        name: "points-of-interest",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => PointsOfInterest,
        itemType: "points-of-interest-model",
        title: "Points of Interest",
    });
    registry.registerModel({
        getModel: (config) => new PointsOfInterestModel(config),
        itemType: "points-of-interest-model",
    });
    registry.registerCommand({
        name: "points-of-interest.create",
        itemType: "points-of-interest-model",
    });
}
