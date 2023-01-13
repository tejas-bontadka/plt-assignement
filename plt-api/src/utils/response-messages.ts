import { GetStocksDTO } from "../interfaces/get-stocks-dto";
import { ResponseInterface } from "../interfaces/response-interfaces";

export const successResponse = (result: GetStocksDTO): ResponseInterface => {
	return {
		status: 200,
		errorMessage: null,
		data: result,
		message: "Stocks quantity fetched succesfully"
	};
};

export const failedResponse = (errorMsg: string): ResponseInterface => {
	return {
		status: 500,
		errorMessage: errorMsg,
		data: null,
		message: null
	};
};

export const badRequest = (): ResponseInterface => {
	return {
		status: 400,
		errorMessage: "Bad request",
		data: null,
		message: "SKU not found in query param"
	};
};

export const getErrorMessage = (error: unknown) => {
	if (error instanceof Error) return error.message;
	return String(error);
};
