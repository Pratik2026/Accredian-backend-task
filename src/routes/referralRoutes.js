import { Router } from "express";
import {referralController, getCoursesController} from "../controllers/referrralcontroller.js";

const referralRoutes = Router();
referralRoutes.get("/courses", getCoursesController);
referralRoutes.post("/referral", referralController);

export default referralRoutes;
