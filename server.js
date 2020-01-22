const express = require('express')
const graphqlHTTP = require('express-graphql')
// const bodyParser = require('body-parser')

// const schema = require('./schema/schema.js')
const keys = require('./config/keys.js')
const mongoose = require('mongoose')

const GQlSchema = require('./graphql/index')
// const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express()

mongoose.connect(keys.mongoDB.dbURI)
mongoose.connection.once('open', () => {
    console.log('Connection to Atlas estabilished')
})


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next()
})

app.use(isAuth)

app.use('/graphql', graphqlHTTP({
    schema: GQlSchema,
    graphiql: true
}))


app.listen(process.env.PORT || 8000, () => {
    console.log('Server Up & Running')
})
