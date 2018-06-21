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
        name: 'Tolga',
        surname: 'Sariuslu',
        password: '123456',

    },
    {
        id: 2,
        name: 'Ender',
        surname: 'Kelleci',
        password: '123456',
        
    },
    {
        id: 3,
        name: 'Burcu',
        surname: 'Yilmazel',
        password: '987654',
        
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
