import ReactDOM from "react-dom";
import { makeMainRoutes } from "./routes";

// eslint-disable-next-line
const loc = location.pathname.replace(/^\/?|\/$/g, "")

const routes = makeMainRoutes(loc);
ReactDOM.render(routes, document.getElementById("root"));
