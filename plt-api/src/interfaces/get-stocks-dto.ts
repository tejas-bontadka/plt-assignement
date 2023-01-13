export interface GetStocksDTO {
	sku: string;
	quantity: number;
}

export interface TransactionDTO {
	sku: string;
	type: string;
	qty: number;
}

export interface StockDTO {
	sku: string;
	stock: number;
}
