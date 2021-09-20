This sandbox is a skeleton for a simple GraphQL server application. Please fork this sandbox and build out the functionality described below. Here's a few things to keep in mind:

- The sandbox includes a sample SQLite database. See [here](https://www.sqlitetutorial.net/sqlite-sample-database) for more information about the sample database, including a diagram of the available tables. You should only need to work with the `artists` and `albums` tables.
- For convenience, the sandbox already has `sqlite` as a dependency and already exposes a [Database](https://github.com/kriasoft/node-sqlite/blob/master/docs/classes/_src_database_.database.md) instance through the resolver context for querying the database. However, you can use any database driver, ORM or query builder you're comfortable with to query the database.
- The existing schema is created using `graphql-js`, but you're welcome to use whatever library to create the schema that you'd like.
- Your schema will be a reflection of how you approach schema design. It should utilize whatever conventions and design patterns you feel are important for a production application.

Your forked sandbox should implement the following functionality:

- The ability to query all artists and the albums for each artist
- The ability to update an artist's name
- The ability to subscribe to changes to an individual artist