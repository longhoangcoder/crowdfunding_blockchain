const routes = require('next-routes')()

routes
    .add('/campaigns/new', 'campaigns/new') 
    //have to have this first cause '/campaigns/new' also matches route pattern below
    .add('/campaigns/:address', '/campaigns/show') 
//the ':' indicates this part of the URL is going to be a wildcard
//'address' is a variable name that you can use to know what page the user is trying to get to
//second argument to 'add' function is which route you want user to go to if they type something looks like the first argument 
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new')

module.exports = routes