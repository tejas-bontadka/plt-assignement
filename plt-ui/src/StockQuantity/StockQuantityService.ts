import axios from "axios";

export const getAvailability = async (sku: string) =>
	await axios.get(`http://localhost:8000/api/v0/quantity?sku=${sku}`);

export default { getAvailability };
