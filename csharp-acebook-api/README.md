# AceBook

Below, we assume that you're using this C# API with the [React Frontend Template](https://github.com/makersacademy/acebook-react-frontend-only-template/)

## Authentication

The app uses JSON Web Tokens (JWTs) for authentication. The flow is as follows...

1. A user submits their email and password to login
2. If the credentials are valid, the API returns a new JWT
3. The JWT should then be submitted with every subsequent request
4. Since the JWT has an expiry time, a new JWT is issued in response to each request

> Confused? Below, you're guided to start the app and explore how it works using PostMan - this should help to clarify the above

## Quickstart

First, clone this repository. Then:

- Install the .NET Entity Framework CLI
  * `dotnet tool install --global dotnet-ef`
- Create the database/s in `psql`
  * `CREATE DATABASE acebook_csharp_development;`
  * `CREATE DATABASE acebook_csharp_test;`
- Run the migration to create the tables
  * `cd` into `/Acebook`
  * `dotnet ef database update` (the default database is acebook_csharp_test)
  * `DATABASE_NAME=acebook_csharp_development dotnet ef database update` (you must specify the development db)
- Start the application, with the development database
  * `DATABASE_NAME=acebook_csharp_development dotnet watch run`

### Creating a user

You can create a user in `psql` by connecting to the database then doing `insert into "Users" ("Email", "Password") values ('user@email.com', 12345678)`.

OR...

Send a `POST` request using PostMan
- URL: `http://localhost:5287/api/users`
- Body (select `raw`, `JSON`): `{ "email": "user@email.com", "password": "12345678" }`
- Click `Send`
> This should return a 201

### Logging in / getting a token

Send a `POST` request using PostMan
- URL: `http://localhost:5287/api/tokens`
- Body (select `raw`, `JSON`): `{ "email": "user@email.com", "password": "12345678" }` (assuming you create a user with those details)
- Click `Send`
> This should return a 201 with a `token` in the response body. Copy the value of `token` for later.

### Creating a post

Send a `POST` request using PostMan
- URL: `http://localhost:5287/api/posts`
- Body (select `raw`, `JSON`): `{ "message": "Hello!" }`
- Under `Authorization` use the `Auth Type` dropdown to choose `Bearer Token` and paste your token into the `Token` field.
- Click `Send`
> This should return a 201. The response body should contain the details of your new post and a new token.

### Getting all the posts

Send a `GET` request using PostMan
- URL: `http://localhost:5287/api/posts`
- Under `Authorization` use the `Auth Type` dropdown to choose `Bearer Token` and paste your token into the `Token` field.
- Click `Send`
> This should return a 200. The response body should contain a list of all the posts in your DB and a new token.

## Running the Tests

- Start the application, with the default (test) database
  * `dotnet watch run`
- Open a second terminal session and run the tests (they should all pass)
  * `dotnet test`
- The test database is cleared out and re-seeded with one user automtically

### Troubleshooting

If you see a popup about not being able to open Chromedriver...
- Go to **System Preferences > Security and Privacy > General**
- There should be another message about Chromedriver there
- If so, Click on **Allow Anyway**

## Updating the Database

Changes are applied to the database programatically, using files called _migrations_, which live in the `/Migrations` directory. The process is as follows...

- To update an existing table
  * For example, you might want to add a title to the `Post` model
  * In which case, you would add a new field there
- To create a new table
  * For example, you might want to add a table called Comments
  * First, create the `Comment` model
  * Then go to AcebookDbContext
  * And add this `public DbSet<Comment>? Comments { get; set; }` 
- Generate the migration file
  * `cd` into `/Acebook`
  * Decide what you wan to call the migration file
  * `AddTitleToPosts` or `CreateCommentsTable` would be good descriptive names
  * Then do `dotnet ef migrations add ` followed by the name you chose
  * E.g.  `dotnet ef migrations add AddTitleToPosts`
- Run the migration
  * `dotnet ef database update`

### Troubleshooting

#### Seeing `role "postgres" does not exist`?

Your application tries to connect to the database as a user called `postgres`, which is normally created automatically when you install PostgresQL. If the `postgres` user doesn't exist, you'll see `role "postgres" does not exist`.

To fix it, you'll need to create the `postgres` user.

Try this in your terminal...

```
; createuser -s postgres
```

If you see `command not found: createuser`, start a new `psql` session and do this...

```sql
create user postgres;
```

#### Want to Change an Existing Migration?

Don't edit the migration files after they've been applied / run. If you do that, it'll probably lead to problems. If you decide that the migration you just applied wasn't quite right for some reason, you have two options

- Create and run another migration (using the process above)

OR...

- Rollback / undo the last migration
- Then edit the migration file before re-running it

How do you rollbacl a migration? Let's assume that you have two migrations, both of which have been applied.

1. CreatePostsAndUsers
2. AddTitleToPosts

To rollback the second, you again use `dotnet ef database update` but this time adding the name of the last 'good' migration. In this case, that would be `CreatePostsAndUsers`. So the command is...

```shell
; dotnet ef database update CreatePostsAndUsers
```
