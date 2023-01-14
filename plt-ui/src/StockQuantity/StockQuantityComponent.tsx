import { useState } from "react";
import "./StockQuantityComponent.css";
import { getAvailability } from "./StockQuantityService";

export const StockQuantityComponent = () => {
	const [sku, setSku] = useState("");
	const [availability, setAvailability] = useState(null);
	const [error, setError] = useState({ isError: false, message: "" });

	const handleSetSku = (value: string) => {
		setAvailability(null);
		setSku(value);
		setError({ isError: false, message: "" });
	};

	const checkAvailability = async () => {
		setAvailability(null);
		setError({ isError: false, message: "" });
		try {
			const res = await getAvailability(sku);
			if (res && res.status === 200) {
				const {
					data: {
						data: { quantity }
					}
				} = res;
				setAvailability(quantity);
			}
		} catch (err: any) {
			const {
				response: {
					data: { errorMessage }
				}
			} = err;
			setError({ isError: true, message: errorMessage });
		}
	};

	return (
		<div className="wrapper">
			<div className="header">Stock quantity availability</div>
			<div className="form-window">
				<div className="form-wrapper">
					<div className="input-wrapper">
						<input
							type="text"
							value={sku}
							onChange={(e) => handleSetSku(e.target.value)}
							placeholder="Enter SKU"
						/>
					</div>
					<div className="button-wrapper">
						<button onClick={() => checkAvailability()} disabled={!sku}>
							Check availability
						</button>
					</div>
				</div>
				{availability && (
					<div className="quant-message">
						Available quantity of {sku} is : {availability}
					</div>
				)}
				{error.isError && <div className="error-message">{error.message}</div>}
			</div>
		</div>
	);
};
