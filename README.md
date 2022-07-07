# fullstackbloggerbackend

Part 1:

- Create a new github repo called fullstackbloggerbackend, clone the repo to your computer and add the link to populi. Note: when you create this repository, you must add a README, and a node .gitignore template.
- Initialize the repo with express-generator.
- Change the server port to 4000.
- Add the following code, after the line var app = express();, to app.js:
  - var blogsRouter = require('./routes/blogs');
  - app.use('/blogs', blogsRouter);
- Create a new file ./routes/blogs.js.
- Create a new express GET route "hello-blogs" in the ./routes/blogs.js file that sends the following as a response:
  - res.json({message: "hello from express"})
- Run npm start in ./ and navigate to "localhost:4000/blogs/hello-blogs" to see if the above works.

Part 2:

- Install mongodb and dotenv

  - npm i mongodb dotenv
  - Create a new file ./.env
  - Add your Mongo Atlas connection string to the .env file
    - MONGO_URI=mongodb+srv://<myusername>:<mypassword>@<mycluster>.mongodb.net/?retryWrites=true&w=majority
    - Note: NoSqlBooster will still have your URI stored in the connections window. Click Connect -> Select export to URI.
  - Create a new file ./mongo.js and add the following code to it:

    - const { MongoClient } = require("mongodb");
      require("dotenv").config();

      let db;

      async function mongoConnect() {
      const uri = process.env.MONGO_URI;
      const client = new MongoClient(uri);
      try {
      await client.connect();
      db = await client.db(process.env.MONGO_DATABASE);
      console.log("db connected");
      } catch (error) {
      console.error(error)
      }
      }
      function blogsDB() {
      return db;
      }
      module.exports = {
      mongoConnect,
      blogsDB,
      };

  - Add the following code, after the line var app = express();, to app.js:
    - var { mongoConnect } = require('./mongo.js');
      mongoConnect();
  - Add a new GET route "all-blogs" in ./routes/blogs.js
  - Implement the following functionality in the "all-blogs" route:
    - It should respond with a list of all the blogs currently stored in your blogs database as a JSON object
      - res.send(allBlogs).
