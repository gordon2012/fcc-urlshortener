import mongoose from 'mongoose';

const dbUrl =
    process.env.NODE_ENV !== 'production'
        ? 'mongodb://localhost:27017/fcc-urlshortener'
        : process.env.ATLAS_URI;

export const connect = (url = dbUrl) => {
    console.log('Connecting to DB');
    return mongoose.connect(url);
};
