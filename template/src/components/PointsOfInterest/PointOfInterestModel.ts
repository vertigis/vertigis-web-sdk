import Point from "esri/geometry/Point";
import Color from "esri/Color";
import { ModelBase, serializable } from "@geocortex/web/models";

/**
 * A single point of interest on the map.
 */
@serializable
export default class PointOfInterestModel extends ModelBase {
    title: string;
    color: Color;
    geometry: Point;
}
