import { getErrorMessage } from "./../utils/response-messages";
import {
	GetStocksDTO,
	StockDTO,
	TransactionDTO
} from "./../interfaces/get-stocks-dto";
import { getStockAvailability } from "../services/stock-management-service";

const mockCAQ = jest.fn((sku: string): number => {
	const totalTranscationOfSKU: TransactionDTO[] = mockTransaction.filter(
		(ele: TransactionDTO) => ele.sku === sku
	);
	let mockStockQuantity: number =
		mockStocks.find((ele: StockDTO) => ele.sku === sku)?.stock || 0;
	if (!totalTranscationOfSKU.length && !mockStockQuantity) {
		throw new Error(
			"Provided SKU is not available in both Stocks and Transactions"
		);
	}
	mockStockQuantity = totalTranscationOfSKU.reduce(
		(acc: number, cur: TransactionDTO) => {
			if (cur.type === "order") {
				acc = acc - cur.qty;
			} else {
				acc += cur.qty;
			}
			return acc;
		},
		mockStockQuantity
	);
	return mockStockQuantity;
});

const mockStocks: StockDTO[] = [
	{ sku: "test123", stock: 100 },
	{ sku: "test456", stock: 100 }
];
const mockTransaction: TransactionDTO[] = [
	{ sku: "test123", type: "order", qty: 10 },
	{ sku: "test456", type: "refund", qty: 5 }
];

describe("Validate logic of getStockAvailability", () => {
	it("Get stocks quantity for specified sku", async () => {
		const mockedRes: GetStocksDTO = { sku: "LTV719449/39/39", quantity: 8510 };
		const availableQuantity: GetStocksDTO = await getStockAvailability(
			"LTV719449/39/39"
		);
		expect(availableQuantity).toEqual(mockedRes);
	});

	it("Check availability for SKU which is invalid", async () => {
		try {
			const res: GetStocksDTO = await getStockAvailability("SomeRandomSKU");
		} catch (err) {
			expect(getErrorMessage(err)).toEqual(
				"Provided SKU is not available in both Stocks and Transactions"
			);
		}
	});

	it("Check for SKUs which are not available in stocks but in transaction", async () => {
		const mockedRes: GetStocksDTO = { sku: "KSS894454/75/76", quantity: -85 };
		const availableQuantity: GetStocksDTO = await getStockAvailability(
			"KSS894454/75/76"
		);
		expect(availableQuantity).toEqual(mockedRes);
	});
});

describe("Validate logic of compute availabilty", () => {
    it("Check if stock decreases by quantity of transaction if type is order",() => {
        expect(mockCAQ("test123")).toBe(90);
        expect(mockCAQ).toHaveBeenCalledTimes(1);
        expect(mockCAQ).toHaveBeenCalledWith('test123');
    })

    it("Check if stock increases by quantity of transaction if type is refund",() => {
        expect(mockCAQ("test456")).toBe(105);
        expect(mockCAQ).toHaveBeenCalledTimes(2);
        expect(mockCAQ).toHaveBeenCalledWith('test456');
    })
});
