import { GetStocksDTO } from "./get-stocks-dto";

export interface ResponseInterface {
	data: GetStocksDTO | null;
	message: string | null;
	errorMessage: string | null;
	status: number;
}
