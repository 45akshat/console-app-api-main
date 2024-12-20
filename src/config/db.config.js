module.exports = {
    url: process.env.MONGODB_URI || 'mongodb+srv://slayde:slayde9638@cluster0.xycoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};