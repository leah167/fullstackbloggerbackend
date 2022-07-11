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

* Implement the following in the Server
  - [Optional] Install nodemon on the server and add the custom dev command in the package.json
    - npm i nodemon
    - "scripts": {
      "start": "PORT=4000 node ./bin/www",
      "dev": "PORT=4000 nodemon ./bin/www"
      }
  - In the "/blogs/all-blogs" route, implement the following:
    - Add the following variables inside the route handler function to get query param values from the incoming GET request url:
      - const limit = Number(req.query.limit)
      - const skip = Number(req.query.limit) \* (Number(req.query.page) - 1)
      - const sortField = req.query.sortField
      - const sortOrder = req.query.sortOrder
      - const filterField = req.query.filterField
      - const filterValue = req.query.filterValue
    - Update the mongo query method to properly incorporate the above variables in the query.
      - let filterObj = {}
        if (filterField && filterValue) {
        filterObj = {[filterField]: filterValue}
        }
        let sortObj = {}
        if (sortField && sortOrder) {
        sortObj = {[sortField]: sortOrder}
        }
        const allBlogs = await collection
        .find(filterObj)
        .sort(sortObj)
        .limit(limit)
        .skip(skip)
        .toArray();
      - Note: sortOrder may need to be converted from "ASC" and "DESC" to 1 and -1 respectively before the query is executed.
      - Note: The above code may have to be modified depending on your implementation of the "/blogs/all-blogs" route in the fullstack blogger project. But it should be very similar in functionality to the "/blogs/all" route in the ExpressJS example.
    - Note: The sorting, filter, limit and page functionality are now being handled by the database using the mongodb query. We will no longer need to use JS functions to implement this functionality on the blogs dataset anymore.
    - Stretch Goal: Add server-side validation to the "/blogs/all-blogs" route to ensure the following before the mongo query is executed:
      - sortField, sortOrder, filterField and filterValue must have truthy values. I.E. they must not be null or an empty string.
      - limit and page must be integer values greater than 0.

### Requirements (Fullstack Part 3 - POST Blog)

- Implement the following in the Server

  - Create a new POST route "/blog-submit" and implement the following
    - Inside the route handler function, add the following variables to get the incoming values from the POST request body:
      - const title = req.body.title
      - const text = req.body.text
      - const author = req.body.author
    - Create a new blogPost object with the following fields, some of which will need to be generated with each new post.
      - title {string}
      - text {string}
      - author {string}
      - createdAt {date}
      - id {number}
      - lastModified {date}
    - Add a mongo insert method to save the new blogPost object in the database.
  - Note: Use ExpressJS Example "/blog-submit" route as reference.

- Implement the following in the Client

  - Create a new page <PostBlogPage />
  - Create a new route in <App /> "/post-blog" with the element as <PostBlogPage />
  - Add the following function in <App />
    - const blogSubmit = async (blog) => {
      const url = `${urlEndpoint}/blogs/blog-submit`
      const response = await fetch(url, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(blog)
      });
      const responseJSON = await response.json();
      }
  - Modify the "/blogs" route to be the index route of <App /> so that it shows by default at localhost:3000
    - <Route index element={<BlogsPage message={serverJSON.message} blogSubmit={blogSubmit} />} />
  - Implement the following in <PostBlogPage />
    - Add three new state variables:
      - title {string}
      - author {string}
      - text {string}
    - Add the following input fields:
      - title
        - Should be a text input field
      - author
        - Should be a text input field
      - text
        - Should be a <textarea> field
    - Hook up all input fields to their corresponding state variables
    - Add a <button> called Submit
    - The Submit button should call props.blogSubmit(blogData) onClick and then programatically redirect to the home page.
      - const navigate = useNavigate()
      - navigate(`/`)
  - Note: blogData is going to be an object containing the current values of title, author, and text in the <PostBlogPage /> state. This data will be received by the server through the POST request, which will then in turn generate a new blog post with the added fields such as createdAt. The server will then save the new post using the mongo insert() method.

- Stretch Goal: Add a debounce in the Front-End to the text input fields
  - https://usehooks.com/useDebounce/
- Stretch Goal: Modify the mongo method for "all-blogs" so that you can do a text match search in a blog post text field for a specific string. Additionally, update the filter options dropdown on the Front-End to include the "text" option.
  - Note: This will NOT check for partial searches
  - db.articles.find( { $text: { $search: "coffee" } } )
  - https://www.mongodb.com/docs/manual/reference/operator/query/text/#examples
- Super Stretch Goal:
  - elemMatch may be able to do a partial string match
  - https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/
