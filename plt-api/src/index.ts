import express, { Express, Request, Response, NextFunction } from "express";

import StockManagementController from "./controller/stock-management-controller";

const app: Express = express();

const port: number = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req: Request, res: Response, next: NextFunction) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"origin, X-Requested-With,Content-Type,Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,DELETE,POST");
		return res.status(200).json({});
	}
	next();
});

app.use("/api/v0", StockManagementController);

app.get("/check", (req: Request, res: Response) => {
	res.send("APIs are up and running");
});
if (require.main === module) {
	app.listen(port, () => console.log(`Server started on port ${port}`));
}

export = app;
