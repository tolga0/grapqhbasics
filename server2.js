var express = require('express');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        customer(id: Int!): customer
        customers(topic: String): [customer]
    }
    type Mutation {
        updatecustomerTopic(id: Int!, password: String!): customer
    }
    type customer {
        id: Int
        name: String
        surname: String
        password: String
            }
`);

var customersData = [
    {
        id: 1,
        name: 'The Complete Node.js Developer Course',
        surname: 'Andrew Mead, Rob Percival',
        password: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',

    },
    {
        id: 2,
        name: 'Node.js, Express & MongoDB Dev to Deployment',
        surname: 'Brad Traversy',
        password: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        
    },
    {
        id: 3,
        name: 'JavaScript: Understanding The Weird Parts',
        surname: 'Anthony Alicea',
        password: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        
    }
]

var getcustomer = function(args) {
    var id = args.id;
    return customersData.filter(customer => {
        return customer.id == id;
    })[0];
}

var getcustomers = function(args) {
    if (args.password) {
        var password = args.password;
        return customersData.filter(customer => customer.password === password);
    } else {
        return customersData;
    }
}

var updatecustomerpassword = function({id, password}) {
    customersData.map(customer => {
        if (customer.id === id) {
            customer.password = password;
            return customer;
        }
    });
    return customersData.filter(customer => customer.id === id)[0];
}

// Root resolver
var root = {
    customer: getcustomer,
    customers: getcustomers,
    updatecustomerpassword: updatecustomerpassword
};

// Create an expres server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));