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

// End point to fetch the stock quantity of SKU
router.get("/quantity", async (req: Request, res: Response) => {
	try {
		const sku: string = req.query.sku as string; // Converting the query parameter to string just to make sure the type matching should be intact in case of null or undefined

		// Null checks just to avoid unnecessary checking in JSON file
		if (sku) {
			const result: GetStocksDTO = await getStockAvailability(sku);
			res.status(200).send(successResponse(result));
		} else {
			res.status(400).send(badRequest());
		}
	} catch (err) {
		const message: string = getErrorMessage(err); //Error message has been retrieved by a helper function as type of error is 'unknown'
		res.status(500).send(failedResponse(message));
	}
});

export = router;
