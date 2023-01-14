import { getErrorMessage } from "./../utils/response-messages";
import {
	GetStocksDTO,
	StockDTO,
	TransactionDTO
} from "../interfaces/get-stocks-dto";
import stocks from "../mock-data/stock.json";
import transactions from "../mock-data/transaction.json";

export const getStockAvailability = async (
	sku: string
): Promise<GetStocksDTO> => {
	// Returning as a promise just to make thread wait until process over JSON files completes
	return new Promise((resolve, reject) => {
		try {
			const availableQuantity: number = computeAvailableQuantity(sku);
			resolve({ sku, quantity: availableQuantity });
		} catch (err) {
			const message = getErrorMessage(err);
			reject(message);
		}
	});
};

const computeAvailableQuantity = (sku: string): number => {
	// Finding the total number of entries for SKU in transaction.json
	const totalTranscationOfSKU: TransactionDTO[] = transactions.filter(
		(ele: TransactionDTO) => ele.sku === sku
	);

	// Fetching the stock quantity mentioned in stock.json for given SKU
	/* If there is an entry for SKU in stock.json, consider the stock of that SKU,
	   Else consider the starting quantity of that SKU as 0.
	*/
	let stockQuantity: number =
		stocks.find((ele: StockDTO) => ele.sku === sku)?.stock || 0;

	/*If we are unable to find the entries both in transaction.json and stock.json,
	Then the input does not have valid SKU, so throw an error */
	if (!totalTranscationOfSKU.length && !stockQuantity) {
		throw new Error(
			"Provided SKU is not available in both Stocks and Transactions"
		);
	}

	/*
		1. Considering current stock quantity available in stock.json as a initial value of quantity for that SKU.
		2. If transaction type is 'order', then substract quantity in that transaction,from stock quantity in stock.json
		3. If transaction type is 'refund', then add quantity in that transaction , to stock quantity in stock.json
	*/

	stockQuantity = totalTranscationOfSKU.reduce(
		(acc: number, cur: TransactionDTO) => {
			if (cur.type === "order") {
				acc = acc - cur.qty;
			} else {
				acc += cur.qty;
			}
			return acc;
		},
		stockQuantity
	);
	return stockQuantity;
};
