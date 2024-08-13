const express = require('express')
const uuid = require('uuid')

const app = express()
const port = 3001
const orders = []
app.use(express.json())

const checkOrderId = (req, res, next) => {
    const { id } = req.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return res.status(404).json({ error: "Order not found" })
    }

    req.orderIndex = index
    req.orderId = id

    next()
}

    // req = request
    // res = response

    const checktOrderUrl = (req, res, next) => {

        const url = req.url
        const method = req.method
    
        console.log(`The method used is: ${method}, and the url used is: ${url}`)
    
        next()
    }


    app.patch('/order/:id', checkOrderId, checktOrderUrl, (req, res) => {
        const { order, clientName, price } = req.body
        const id = req.orderId
        const index = req.orderIndex
        const orderReady = {
          id,
          order: orders[index].order,
          clientName: orders[index].clientName,
          price: orders[index].price,
          status: "Pronto"
        }
      
        orders[index] = orderReady
      
        return res.json(orderReady)
      })
    
    
    



app.get('/order', checktOrderUrl, (req, res) => {
    return res.json(orders)
})

app.post('/order', checktOrderUrl, (req, res) => {
    const { order, clientName, price } = req.body
    const status = "Em preparação"
    const orde = { id: uuid.v4(), order, clientName, price, status }

    orders.push(orde)

    return res.status(201).json(orders)
})

app.put('/order/:id',checkOrderId, checktOrderUrl,   (req, res) => {
    const { order, clientName, price } = req.body
    const index = req.orderIndex
    const id = req.orderId

    const updatedOrder = { id, order, clientName, price }

    orders[index] = updatedOrder

    return res.json(updatedOrder)
})

app.delete('/order/:id', checkOrderId, checktOrderUrl, (req, res) => {
    const index = req.orderndex

    orders.splice(index, 1)

    return res.status(204).json()
})

app.get('/order/:id', checkOrderId, checktOrderUrl, (req, res) => {
    const index = req.orderIndex
  
    const viewOrder = orders[index]
  
    return res.json(viewOrder)
  })



app.listen(3001, () => {
    console.log(`🚀 Server started on port ${port} 🔥`)
})