# webpack3-express
A basic Node.js + Express server, written in ES6 and bundled on server with Webpack 3.

Serving the following features:
- A simple User signup and login API with encrypted password mechanism. Data is stored on a MongoDB.
- A GraphQL equivalent of the above User API, using [express-graphql](https://www.npmjs.com/package/express-graphql) and [graphql-compose](https://graphql-compose.github.io/en/).
- A basic Facebook Chatbot, responding with Paul Simon queries to YouTube API.
- The Websocket-based doodling snippet 'PaintSocket' featured on [orenhadar.net](https://orenhadar.net/paint-socket/), using [Socket.IO](https://socket.io/).
