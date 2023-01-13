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
	const totalTranscationOfSKU: TransactionDTO[] = transactions.filter(
		(ele: TransactionDTO) => ele.sku === sku
	);
	let stockQuantity: number =
		stocks.find((ele: StockDTO) => ele.sku === sku)?.stock || 0;

	if (!totalTranscationOfSKU.length && !stockQuantity) {
		throw new Error(
			"Provided SKU is not available in both Stocks and Transactions"
		);
	}

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
