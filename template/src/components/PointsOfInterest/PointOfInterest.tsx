import { xyToLngLat } from "esri/geometry/support/webMercatorUtils";
import { format as formatNumber } from "@vertigis/arcgis-extensions/utilities/number";
import { useWatchAndRerender } from "@vertigis/web/ui";
import DynamicIcon from "@vertigis/web/ui/DynamicIcon";
import IconButton from "@vertigis/web/ui/IconButton";
import ListItemText from "@vertigis/web/ui/ListItemText";
import MenuItem, { MenuItemProps } from "@vertigis/web/ui/MenuItem";
import MenuItemSecondaryAction from "@vertigis/web/ui/MenuItemSecondaryAction";
import React, { FC } from "react";

import PointOfInterestModel from "./PointOfInterestModel";
import "./PointOfInterest.css";

function formatLatLon(n: number): string {
    // formatNumber() respects locale and the app's configured region settings.
    return `${formatNumber({ fractionalDigits: 2 }, n)}°`;
}

export interface PointOfInterestProps extends MenuItemProps {
    model: PointOfInterestModel;
    onDelete?: () => void;
}

const PointOfInterest: FC<PointOfInterestProps> = ({ model, onDelete, ...other }) => {
    const { title, geometry, color } = model;

    // Re-render whenever any of these properties change. Notice how you can
    // deeply watch properties like "geometry.x", which will update whenever
    // anything along the path changes.
    useWatchAndRerender(model, ["title", "geometry.x", "geometry.y", "color"]);
    const [lon, lat] = xyToLngLat(geometry.x, geometry.y);
    return (
        <MenuItem {...other}>
            <div className="PointOfInterest-swatch" style={{ backgroundColor: color.toCss() }} />
            <ListItemText
                primary={title}
                secondary={`Lat: ${formatLatLon(lat)}, Lon: ${formatLatLon(lon)}`}
            />
            <MenuItemSecondaryAction>
                <IconButton onClick={onDelete} title="Delete">
                    <DynamicIcon src="trash" />
                </IconButton>
            </MenuItemSecondaryAction>
        </MenuItem>
    );
};

export default PointOfInterest;
