import express from "express";
import { signup, signin } from "../controller/auth.controller.js";
const route = express.Router();

route.post("/signup", signup);
route.post("/signin", signin);

export default route;
