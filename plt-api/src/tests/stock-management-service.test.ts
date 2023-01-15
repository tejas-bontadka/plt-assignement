import { getErrorMessage } from "./../utils/response-messages";
import {
	GetStocksDTO,
	StockDTO,
	TransactionDTO
} from "./../interfaces/get-stocks-dto";
import { getStockAvailability } from "../services/stock-management-service";

// mocking computeAvailability function exactly to replicate the processing, but param signature has been changed
// added one extra parameter to support all use cases in unit testing
const mockCAQ = jest.fn(
	(sku: string, transactions: TransactionDTO[]): number | null => {
		const totalTranscationOfSKU: TransactionDTO[] = transactions.filter(
			(ele: TransactionDTO) => ele.sku === sku
		);
		let mockStockQuantity: number =
			mockStocks.find((ele: StockDTO) => ele.sku === sku)?.stock || 0;

		if (!totalTranscationOfSKU.length && !mockStockQuantity) {
			throw new Error("SKU not available");
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
	}
);

const mockStocks: StockDTO[] = [
	{ sku: "test123", stock: 100 },
	{ sku: "test456", stock: 100 }
];
const mockTransaction: TransactionDTO[] = [
	{ sku: "test123", type: "order", qty: 10 },
	{ sku: "test456", type: "refund", qty: 5 }
];

const mockTransactionOrderAndRefund: TransactionDTO[] = [
	{ sku: "test123", type: "order", qty: 10 },
	{ sku: "test123", type: "refund", qty: 10 }
];


// Unit testing the logics of getStockAvailability function

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


// Unit tests to validate the logic scenarios of computeAvailability function

describe("Validate logic of compute availabilty", () => {
	it("Check if stock decreases by quantity of transaction if type is order", () => {
		expect(mockCAQ("test123", mockTransaction)).toBe(90);
		expect(mockCAQ).toHaveBeenCalledTimes(1);
		expect(mockCAQ).toHaveBeenCalledWith("test123", mockTransaction);
	});

	it("Check if stock increases by quantity of transaction if type is refund", () => {
		expect(mockCAQ("test456", mockTransaction)).toBe(105);
		expect(mockCAQ).toHaveBeenCalledTimes(2);
		expect(mockCAQ).toHaveBeenCalledWith("test456", mockTransaction);
	});

	it("If type is order, then available quantity should be less than the SKUs stock", () => {
		const sku: string = "test123";
		const stockValue: number = mockStocks.find((ele) => ele.sku === sku)
			?.stock as number;
		expect(mockCAQ(sku, mockTransaction)).toBeLessThan(stockValue);
		expect(mockCAQ).toHaveBeenCalledTimes(3);
		expect(mockCAQ).toHaveBeenCalledWith(sku, mockTransaction);
	});

	it("If type is refund, then available quantity should be greater than the SKUs stock", () => {
		const sku: string = "test456";
		const stockValue: number = mockStocks.find((ele) => ele.sku === sku)
			?.stock as number;
		expect(mockCAQ(sku, mockTransaction)).toBeGreaterThan(stockValue);
		expect(mockCAQ).toHaveBeenCalledTimes(4);
		expect(mockCAQ).toHaveBeenCalledWith(sku, mockTransaction);
	});

	it("If transaction has both types,with same quantity then, quantity should be same of SKus stock", () => {
		const sku: string = "test123";
		const stockValue: number = mockStocks.find((ele) => ele.sku === sku)
			?.stock as number;
		expect(mockCAQ(sku, mockTransactionOrderAndRefund)).toEqual(stockValue);
		expect(mockCAQ).toHaveBeenCalledTimes(5);
		expect(mockCAQ).toHaveBeenCalledWith(sku, mockTransactionOrderAndRefund);
	});

	it("If given SKU is not a part of both Stock and Transaction, then should stop processing and throw error message", () => {
		try {
			const res = mockCAQ("SomeRandomSKU", mockTransaction);
		} catch (err) {
			expect(getErrorMessage(err)).toEqual("SKU not available");
		}
	});
});
