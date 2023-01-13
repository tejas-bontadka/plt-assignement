import express, { Router, Request, Response } from "express";
import { getStockAvailability } from "../services/stock-management-service";
import {
	badRequest,
	failedResponse,
	successResponse
} from "../utils/response-messages";
import { GetStocksDTO } from "../interfaces/get-stocks-dto";
import { getErrorMessage } from "./../utils/response-messages";

const router: Router = express.Router();

router.get("/quantity", async (req: Request, res: Response) => {
	try {
		const sku: string = req.query.sku as string;
		if (sku) {
			const result: GetStocksDTO = await getStockAvailability(sku);
			res.send(successResponse(result));
		} else {
			res.send(badRequest());
		}
	} catch (err) {
		const message: string = getErrorMessage(err);
		res.send(failedResponse(message));
	}
});

export = router;
