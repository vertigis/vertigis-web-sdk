import { xyToLngLat } from "@arcgis/core/geometry/support/webMercatorUtils";
import { format as formatNumber } from "@vertigis/arcgis-extensions/utilities/format/number";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Box from "@vertigis/web/ui/Box";
import DynamicIcon from "@vertigis/web/ui/DynamicIcon";
import IconButton from "@vertigis/web/ui/IconButton";
import ListItemText from "@vertigis/web/ui/ListItemText";
import type { MenuItemProps } from "@vertigis/web/ui/MenuItem";
import MenuItem from "@vertigis/web/ui/MenuItem";
import MenuItemSecondaryAction from "@vertigis/web/ui/MenuItemSecondaryAction";
import type { FC } from "react";

import type PointOfInterestModel from "./PointOfInterestModel";
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
            <Box className="PointOfInterest-swatch" style={{ backgroundColor: color.toCss() }} />
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
