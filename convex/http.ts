import "./polyfills";
import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth/helpers";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

export default http;
