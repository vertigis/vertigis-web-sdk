import {
    ComponentModelBase,
    serializable,
    ComponentModelProperties,
    importModel,
} from "@geocortex/web/models";
import { LocationMarkerEvent } from "@geocortex/viewer-framework/messaging/registry/location-marker";
import { toColor } from "@geocortex/web/branding";
import { GeometryResults } from "@geocortex/web/messaging";
import { MapExtension } from "@geocortex/api/mapping/MapExtension";
import { ChangeEvent } from "@geocortex/api/support/esri";
import Collection from "esri/core/Collection";
import Point from "esri/geometry/Point";

import PointOfInterestModel from "./PointOfInterestModel";

export type TestModelProperties = ComponentModelProperties;

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
export default class PointsOfInterestModel extends ComponentModelBase {
    // Declares a dependency on the map component. The value of `map` is
    // automatically managed by the framework.
    @importModel("map-extension")
    map: MapExtension;

    // Using an esri Collection instead of an array allows us to watch for
    // changes.
    readonly pointsOfInterest = new Collection<PointOfInterestModel>();
    private _nextId = 1;
    private _handles: IHandle[] = [];

    /**
     * Creates a new point of interest at the specified location.
     */
    async createNew(location: GeometryResults): Promise<void> {
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

    protected async _onInitialize(): Promise<void> {
        // This method is invoked automatically when the model is first created.
        // It gives you an opportunity to perform async initialization. It is
        // also the first opportunity to use injected dependencies such as the
        // message bus. Remember to always invoke the super version when you
        // override a method.
        await super._onInitialize();

        // Registration handles for event and command handlers should be saved
        // and cleaned up when no longer needed.
        this._handles.push(
            // Register an implementation for our custom command. The map's
            // onClick action is wired up to run this command in the sample
            // app.json.
            this.messages
                .command<GeometryResults>("points-of-interest.create")
                .register((location) => this.createNew(location)),
            this.messages.events.locationMarker.updated.subscribe(this._onMarkerUpdated),
            this.pointsOfInterest.on("change", this._onPointOfInterestsChange)
        );
    }

    destroy(): void {
        super.destroy();

        // Clean up event handlers.
        this._handles.forEach((h) => h.remove());
    }

    private readonly _onMarkerUpdated = (e: LocationMarkerEvent): void => {
        const matchingPoi = this.pointsOfInterest.find((poi) => poi.id === e.id);
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
                e.added.map((poi) =>
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
                e.removed.map((poi) =>
                    this.messages.commands.locationMarker.remove.execute({
                        id: poi.id,
                        maps: this.map,
                    })
                )
            );
        }
    };
}
