import mongoose from 'mongoose';

export const dbUrl =
    process.env.NODE_ENV !== 'production'
        ? 'mongodb://localhost:27017/fcc-urlshortener'
        : process.env.ATLAS_URI;

export const urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: Number,
});

export const connect = async (dbUrl, model, schema) => {
    const connection = await mongoose.createConnection(dbUrl, {
        useNewUrlParser: true,
        bufferCommands: false,
        bufferMaxEntries: 0,
    });

    return connection.model(model, schema);
};
