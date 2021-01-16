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
const app = express();

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
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "helloworld",
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => "Hello world",
      },
      id: {
        type: GraphQLString,
        resolve: () => 1,
      },

      books: {
        type: new GraphQLList(BookType),
        description: "List of all books",
        resolve: () => books,
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
