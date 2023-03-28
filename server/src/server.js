import path from "path";
import http from "http";
import colors from "colors";
import Product from "./models/productModel.js";

import app from "./app.js";
import connectDB from "./config/db.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// connectDB()

(async function () {
	await connectDB();

	server.listen(PORT, () => {
		console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
	});
})();
