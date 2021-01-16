const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 },
];

const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
];

const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLIntGraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { argsToArgsConfig } = require("graphql/type/definition");
const app = express();

const AuthorType = new GraphQLObjectType({
  name: "author",
  description: "Represets a singleauthor",
  fields: () => ({
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    id: {
      type: GraphQLNonNull(GraphQLInt),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of all books",
      resolve: (parent, args) => books.filter((x) => x.authorId === parent.id),
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "book",
  description: "Represets a book written by an author",
  fields: () => ({
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    id: {
      type: GraphQLNonNull(GraphQLInt),
    },
    authorId: {
      type: GraphQLNonNull(GraphQLInt),
    },

    author: {
      type: AuthorType,
      description: "author of the book",
      resolve: (parent, args) =>
        authors.find((author) => author.id === parent.id),
    },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "rootquery",
    fields: () => ({
      book: {
        type: BookType,
        description: "A single book",
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (parent, args) => books.find((x) => x.id === args.id),
      },
      books: {
        type: new GraphQLList(BookType),
        description: "List of all books",
        resolve: () => books,
      },
      authors: {
        type: new GraphQLList(AuthorType),
        description: "List of all authors",
        resolve: () => authors,
      },
      author: {
        type: AuthorType,
        description: "author and their books",
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (parent, args) => {
          return authors.find((x) => x.id === args.id);
        },
      },
    }),
  }),
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);
app.listen(5000, () => console.log("Server Running"));
