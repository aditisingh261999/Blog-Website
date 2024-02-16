import express from "express";
import { signup } from "../controller/auth.controller.js";
const route = express.Router();

route.post("/signup", signup);

export default route;
