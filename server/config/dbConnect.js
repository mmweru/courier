// config/dbConnect.js
import mongoose from 'mongoose';  // Note: it's "mongoose", not "moongose"

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`Database connection: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

export default dbConnect;  // Using ES Module export