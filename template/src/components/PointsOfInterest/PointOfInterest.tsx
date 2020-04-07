import { xyToLngLat } from "esri/geometry/support/webMercatorUtils";
import { format as formatNumber } from "@geocortex/api/utilities/number";
import { useWatchAndRerender } from "@geocortex/web/ui";
import DynamicIcon from "@geocortex/web/ui/icon/DynamicIcon";
import IconButton from "@geocortex/web/ui/icon-button";
import ListItemText from "@geocortex/web/ui/list-item-text";
import MenuItem, { MenuItemProps } from "@geocortex/web/ui/menu-item";
import MenuItemSecondaryAction from "@geocortex/web/ui/menu-list-item-secondary-action";
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
