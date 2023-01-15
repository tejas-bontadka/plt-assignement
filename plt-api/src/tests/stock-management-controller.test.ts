import app from "../index";

import request from "supertest";

// Unit tests for /quantity end point, and test the scenarios when it interacts with services

describe("GET stocks quantity by /quantity api", () => {
	
	it("Hit API without sending sku in query", async () => {
		const resp = await request(app).get("/api/v0/quantity");
		expect(resp.body.message).toEqual("SKU not found in query param");
	});

	it("Hit API with sku which is not present in both stocks and transactions", async () => {
		const resp = await request(app).get("/api/v0/quantity?sku=someRandomSKU");
		expect(resp.body.errorMessage).toEqual(
			"Provided SKU is not available in both Stocks and Transactions"
		);
	});

	it("Hit API with valid SKU in query", async () => {
		const resp = await request(app).get("/api/v0/quantity?sku=LTV719449/39/39");
		expect(resp.body.data.quantity).toEqual(8510);
	});

	it("Hit API with sku which is not present in stocks but in transaction", async () => {
		const resp = await request(app).get("/api/v0/quantity?sku=KSS894454/75/76");
		expect(resp.body.data.quantity).toEqual(-85);
	});
});
