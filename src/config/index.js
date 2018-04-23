import dotenv from 'dotenv';

dotenv.config();

const config = {
    app: {
        port: process.env.PORT || 8080,
    },
    mongodb: {
        uri: process.env.MONGODB_URI,
        usersCollection: 'meadows',
    },
    chatbot: {
        verifyToken: process.env.VERIFY_TOKEN,
        pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    },
    youtubeService: {
        apiKey: process.env.API_KEY,
    }
}

export default config;