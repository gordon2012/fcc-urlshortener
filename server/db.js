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

// https://spectrum.chat/zeit/now/cant-deploy-node-app-with-mongoose-to-now-v2~e786fdfe-265b-4581-a764-237194df45fc
// https://spectrum.chat/zeit/now/now-2-0-connect-to-database-on-every-function-invocation~e25b9e64-6271-4e15-822a-ddde047fa43d?m=MTU0OTYxMDY4MDczMA==
// https://zeit.co/blog/serverless-ecommerce
