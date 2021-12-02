require('rootpath')()
const express = require('express')
const cors = require('cors')
const errorHandler = require('_middleware/error-handler')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Redirect requests
app.use('/user', require('./routes/user.routes'))
app.use('/vehicle', require('./routes/vehicle.routes'))
app.use('/manufacturer', require('./routes/mfr.routes'))
app.use('/repair', require('./routes/repair.routes'))
app.use('/sale', require('./routes/sale.routes'))
app.use('/customer', require('./routes/customer.routes'))
app.use('/color', require('./routes/color.routes'))
app.use('/part', require('./routes/part.routes'))
app.use('/belowcostsales', require('./routes/belowcostsales.routes'))
app.use('/repairsmanufacturer', require('./routes/repairsmanufacturer.routes'))
app.use('/avetimeinventory', require('./routes/avetimeinventory.routes'))
app.use('/monthlysales', require('./routes/monthlysales.routes'))


// global error handler

app.use(errorHandler)

/*global process*/
// start server
const port = process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000
app.listen(port, () => console.log('Server listening on port ' + port))
