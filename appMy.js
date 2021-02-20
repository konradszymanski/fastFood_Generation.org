const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())

global.orders = [] // all orders will be pushed to array

let states = [] // 
states.push("ordered")
states.push("cooked")
states.push("served")
states.push("paid")

app.post('/PlaceOrder', (req, res) => {
    order = {}
    order.state = "ordered"
    order.tableNumber = req.body["tableNumber"]
    delete req.body.tableNumber
    order.items = req.body
    order.number = global.orders.length + 1 //Note, the order number is 1 more than the orders index in the array (becuase we don't want an order #0)
    global.orders.push(order)
    res.send('Order Accepted #' + order.number)
})

app.get('/view', (req, res) => {
    outputOrders(req, res)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.get('/setState', (req, res) => {
    setOrderState(req, res)
    outputOrders(req, res)
})
path = require("path")
app.use(express.static(path.join(__dirname, 'public'))); // directs to public folder

function outputOrders(req, res) {
    let filter = req.query["filter"]
    let ordersHTML = []
    ordersHTML.push('<html><body><table border="1px solid black" >')
    for (const order of global.orders) {
        if (filter == null || order.state == filter) {
            ordersHTML.push(orderHTML(order))
        }
    }
    ordersHTML.push('</body></html><table>')
    //res.send(ordersHTML.join(''))
    res.send(ordersHTML.join(' '))
}


function orderHTML(order) {
    let elements = []
    elements.push('<tr><th colspan="2">Order#' + order.number + '</th></tr>')
    elements.push('<tr><td colspan="2">Table# ' + order.tableNumber + '</td></tr>')
    for (let key in order.items) {
        quantity = order.items[key]
        if (quantity > 0) {
            elements.push("<tr><td style='font-size: 20px' >" + quantity + " * " + key + "</td></tr>")
        }
    }

    elements.push("<td>" + order.state + "</td>")
    elements.push(stateButtons(order))

    //    console.log(elements)
    //return (elements.join(" - ") + "<br>")
    return (elements + "<br>")

}


// function orderHTML(order) {
//     let elements = []
//     elements.push(`<span>Order#${order.number}</span>`)
//     elements.push(`<span>Table#${order.tableNumber}</span>`)
//     for (let key in order.items) {
//         quantity = order.items[key]
//         if (quantity > 0) {
//             elements.push("<span>" + quantity + " * " + key + "</span>")
//         }
//     }
//     elements.push("<span>" + order.state + "</span>")
//     elements.push(stateButtons(order))
//     return (elements.join(" - ") + "<br>")
// }
function stateButtons(order) {
    let buttons = []
    for (const state of states) {
        buttons.push(`<tr><td><a href=/setState?orderNumber=${order.number}&state=\${state}><button>Mark as ${state}</button></a><td></tr>`)
    }
    //return (buttons.join(' '))
    return (buttons)
}

function setOrderState(req, res) {
    //transition state - based on a ?state=ordernum NameValue pair
    let order = global.orders[parseInt(req.query["orderNumber"]) - 1]
    order.state = req.query["state"]
}

// app.post('placeOrder', (req, res) => { //this is handler//it will execute requests
//     order = {}; //new empty objecy
//     order.state = "ordered"; // givind property called state
//     order.tableNumber = req.body["tableNumber"]; // when form isposted to server, it will get the proper element, e.g if we type table.no 37, it will be 37
//     delete req.body.tableNumber; // removing No 
//     order.items = req.body;
//     order.number = global.orders.length + 1; //Note, the order number is 1 more than the orders index in the array (becuase we don't want an order #0)
//     global.orders.push(order); // it will be pushed to an array
//     res.send('Order Accepted #' + order.number); // send back that order is accepted

// })