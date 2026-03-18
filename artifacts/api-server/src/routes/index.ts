import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meetupsRouter from "./meetups";
import rsvpsRouter from "./rsvps";
import resourcesRouter from "./resources";
import merchantsRouter from "./merchants";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meetupsRouter);
router.use(rsvpsRouter);
router.use(resourcesRouter);
router.use(merchantsRouter);

export default router;
