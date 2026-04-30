import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import opportunitiesRouter from "./opportunities";
import userRouter from "./user";
import quizRouter from "./quiz";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(opportunitiesRouter);
router.use(userRouter);
router.use(quizRouter);

export default router;
