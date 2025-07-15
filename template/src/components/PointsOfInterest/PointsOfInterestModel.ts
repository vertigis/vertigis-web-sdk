import Collection from "@arcgis/core/core/Collection";
import type Point from "@arcgis/core/geometry/Point";
import type { ChangeEvent } from "@vertigis/arcgis-extensions/support/esri";
import type { LocationMarkerEvent } from "@vertigis/viewer-spec/messaging/registry/location-marker";
import { toColor } from "@vertigis/web/branding";
import type { MapModel } from "@vertigis/web/mapping";
import { command, type HasGeometry } from "@vertigis/web/messaging";
import {
    ComponentModelBase,
    serializable,
    type ComponentModelProperties,
    importModel,
} from "@vertigis/web/models";

import PointOfInterestModel from "./PointOfInterestModel";

export type PointsOfInterestModelProperties = ComponentModelProperties;

const colors = [
    "#0000ff",
    "#ff0000",
    "#33ff00",
    "#0066ff",
    "#ff0099",
    "#ccff00",
    "#00ffff",
    "#cc00ff",
    "#ff9900",
    "#00ff66",
];

@serializable
export default class PointsOfInterestModel extends ComponentModelBase<PointsOfInterestModelProperties> {
    // Declares a dependency on the map component. The value of `map` is
    // automatically managed by the framework.
    @importModel("map-extension")
    map: MapModel;

    // Using an esri Collection instead of an array allows us to watch for
    // changes.
    readonly pointsOfInterest = new Collection<PointOfInterestModel>();
    private _nextId = 1;
    private readonly _handles: IHandle[] = [];

    /**
     * Creates a new point of interest at the specified location.
     */
    @command("points-of-interest.create")
    async createNew(location: HasGeometry): Promise<void> {
        const id = this._nextId++;

        // Prompt the user for a name using the built-in ui.prompt operation.
        const title = await this.messages.operations.ui.prompt.execute({
            title: "New Point",
            message: "Name",
        });
        if (!title) {
            // User canceled or didn't type anything.
            return;
        }
        const color = colors[id % colors.length];
        const poi = new PointOfInterestModel({
            id: id.toString(),
        });
        poi.title = title;
        poi.color = toColor(color);
        poi.geometry = location.geometry as Point;
        this.pointsOfInterest.add(poi);
    }

    /**
     * Zooms the map to the specified point of interest.
     */
    async goto(poi: PointOfInterestModel): Promise<void> {
        await this.messages.commands.map.zoomToViewpoint.execute({
            viewpoint: { targetGeometry: poi.geometry, scale: 50000000 },
        });
    }

    protected override async _onInitialize(): Promise<void> {
        // This method is invoked automatically when the model is first created.
        // It gives you an opportunity to perform async initialization. It is
        // also the first opportunity to use injected dependencies such as the
        // message bus. Remember to always invoke the super version when you
        // override a method.
        await super._onInitialize();

        // Registration handles for event handlers should be saved and cleaned
        // up when no longer needed.
        this._handles.push(
            this.messages.events.locationMarker.updated.subscribe(this._onMarkerUpdated),
            this.pointsOfInterest.on("change", this._onPointOfInterestsChange)
        );
    }

    protected override async _onDestroy(): Promise<void> {
        // Always invoke the super implementation.
        await super._onDestroy();

        // Clean up event handlers.
        this._handles.forEach(h => h.remove());
    }

    private readonly _onMarkerUpdated = (e: LocationMarkerEvent): void => {
        const matchingPoi = this.pointsOfInterest.find(poi => poi.id === e.id);
        if (matchingPoi) {
            matchingPoi.geometry = e.geometry as Point;
        }
    };

    private readonly _onPointOfInterestsChange = async (
        e: ChangeEvent<PointOfInterestModel>
    ): Promise<void> => {
        // Add or remove markers on the map as appropriate whenever the
        // collection changes.
        if (e.added?.length) {
            await Promise.all(
                e.added.map(poi =>
                    this.messages.commands.locationMarker.create.execute({
                        id: poi.id,
                        geometry: poi.geometry,
                        maps: this.map,
                        color: poi.color,
                        userDraggable: true,
                        scale: 1.5,
                    })
                )
            );
        }
        if (e.removed?.length) {
            await Promise.all(
                e.removed.map(poi =>
                    this.messages.commands.locationMarker.remove.execute({
                        id: poi.id,
                        maps: this.map,
                    })
                )
            );
        }
    };
}
