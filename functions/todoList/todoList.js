const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!): Todo
    deleteTask(id: ID!): Todo

  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAD5rID0MACBTs47TwGR8D1Itfdj3cyo79VVDWD' });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('task'))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result.data)

        return result.data.map(d=>{
          return {
            id: d.ref.id,
            status: d.data.status,
            task: d.data.task
          }
        })
      }
      catch (err) {
        console.log(err)
        return err.toString();
      }
    }
    // authorByName: (root, args, context) => {
    //   console.log('hihhihi', args.name)
    //   return authors.find(x => x.name === args.name) || 'NOTFOUND'
    // },
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAD5rID0MACBTs47TwGR8D1Itfdj3cyo79VVDWD' });
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            {
              data: {
                task: task,
                status: true
              }
            },
          )
        )
        return result.data;
      }
      catch (err) {
        console.log(err)
      }
    },
    deleteTask: async (_, { id }) => {
      try {
        const reqId = JSON.stringify(id);
        const reqId2 = JSON.parse(id);
        console.log(id);
        var adminClient = new faunadb.Client({ secret: 'fnAD5rID0MACBTs47TwGR8D1Itfdj3cyo79VVDWD' });
        const result = await adminClient.query(
          q.Delete(q.Ref(q.Collection("todos"), id))
        );
        console.log(result);
        return result.ref.data;
      } catch (error) {
        return error.toString();
      }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
