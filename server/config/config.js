// PORT
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev') {
    process.env.DB = 'mongodb://localhost:27017/coffee';
} else {
    process.env.DB = 'mongodb+srv://carlosbean:5wa7XGD5sH454Rkx@cluster0-jsfn9.mongodb.net/coffee';
}