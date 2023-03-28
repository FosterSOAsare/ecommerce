import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

async function insertUsers() {
	return new Promise(async (resolve, reject) => {
		try {
			let array = [];
			users.forEach(async (user) => {
				let promise = new Promise(async (resolve, reject) => {
					let res = await User.findOne({ name: user.name, email: user.email });
					if (!res) {
						await User.create(user);
					}
					resolve();
				});
				array.push(promise);
			});
			let res = await Promise.all(array);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
}
async function insertProducts() {
	return new Promise(async (resolve, reject) => {
		try {
			// Fetch admin id
			let admin = await User.findOne({ isAdmin: true });
			let admin_id = admin?._id;
			console.log(admin_id);
			let array = [];
			if (admin_id) {
				products.forEach(async (product) => {
					let promise = new Promise(async (resolve, reject) => {
						let res = await Product.findOne(product);
						if (!res) {
							await Product.create({ ...product, user: admin_id });
						}
						resolve();
					});
					array.push(promise);
				});
				await Promise.all(array);
				resolve();
			} else {
				reject("Admin not found yet");
			}
		} catch (e) {
			reject(e);
		}
	});
}

const importData = async () => {
	try {
		await connectDB();
		await insertUsers();
		await insertProducts();

		// In this . Check if the product already exists . If it isn't insert it into the database
		// console.log(users);

		console.log("Data Imported!".green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		console.log("Data Destroyed!".red.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
