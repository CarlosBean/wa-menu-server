// port
process.env.PORT = process.env.PORT || 3000;

// enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//expiration time token
process.env.EXP_TOKEN = 60 * 60 * 24;

// auth seed token
process.env.SEED = process.env.SEED || 'development-seed';

// database
if (process.env.NODE_ENV === 'dev') {
    process.env.DB = 'mongodb://localhost:27017/coffee';
} else {
    process.env.DB = process.env.MONGO_URL;
}