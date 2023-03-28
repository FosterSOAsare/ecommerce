import mongoose from "mongoose";

mongoose.connection.once("open", () => {
	console.log(`MongoDB Connected:`.cyan.underline);
});
mongoose.connection.on("error", (e) => {
	console.log(e);
	console.error(`MongoDB Connected:`.red);
});
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
			useCreateIndex: true,
		});
	} catch (error) {
		console.error(`Error: ${error.message}`.red.underline.bold);
		process.exit(1);
	}
};

export default connectDB;
