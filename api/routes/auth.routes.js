import express from "express";
import { signup, signin, google } from "../controller/auth.controller.js";
const route = express.Router();

route.post("/signup", signup);
route.post("/signin", signin);
route.post("/google", google);

export default route;
