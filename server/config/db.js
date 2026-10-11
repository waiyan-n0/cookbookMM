const mongoose = require('mongoose');

const MongoUsername = process.env.MONGODB_USERNAME;
const MongoPw = process.env.MONGODB_PASSWORD;

async function connectToMongoDB() {
    try {
        const conn = await mongoose.connect(`mongodb+srv://${MongoUsername}:${MongoPw}@cluster0.qqs3jci.mongodb.net/?appName=Cluster0`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return mongoose;
    } catch (err) {
        console.log(err.message);
        console.dir(err);
        process.exit(1);
    }
}

async function disconnectFromMongoDB() {
    await mongoose.connection.close();
}

module.exports = { connectToMongoDB, disconnectFromMongoDB };