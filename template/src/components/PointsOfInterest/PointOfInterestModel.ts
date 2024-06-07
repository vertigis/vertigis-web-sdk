import type Color from "@arcgis/core/Color";
import type Point from "@arcgis/core/geometry/Point";
import { ModelBase, serializable } from "@vertigis/web/models";

/**
 * A single point of interest on the map.
 */
@serializable
export default class PointOfInterestModel extends ModelBase {
    title: string;
    color: Color;
    geometry: Point;
}
