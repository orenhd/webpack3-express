import dotenv from 'dotenv';

dotenv.config();

const config = {
    env: process.env.NODE_ENV,
    app: {
        port: process.env.PORT || 8080,
        at_string: process.env.AT_STRING,
        jwt_life_span: 180,
    },
    databases: {
        mongodb: {
            uri: process.env.MONGODB_URI,
            usersCollection: 'meadows',
        },
    },
    chatbot: {
        verifyToken: process.env.VERIFY_TOKEN,
        pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
    },
    services: {
        youtube_api: {
            apiKey: process.env.API_KEY,
        }
    }
}

export default config;
