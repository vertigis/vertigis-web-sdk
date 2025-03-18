import defaultWebpackConfig from "@vertigis/web-sdk/config/webpack.config.js";
import { merge } from "webpack-merge";

export default merge(defaultWebpackConfig, {
    // Add custom webpack configuration for your project here.
});
