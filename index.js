require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const router = express.Router();

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit').default
const helmet = require('helmet')
const xssClean = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

const connectDB = require('./app/db/connectDB')
// MIDDLEWARE
const languageMiddleware = require('./app/middleware/language-middleware')
const errorMiddleware = require('./app/middleware/error-handler')
const notFoundMiddleware = require('./app/middleware/not-found')

// ROUTES
const userRouter = require('./app/routes/user.js')
const tattooMachineRouter = require('./app/routes/tattoo-machines.js')
const orderRouter = require('./app/routes/order.js')
const favouritesRouter = require('./app/routes/favourite')
const carts = require('./app/routes/cart')

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60
})

app.set('trust proxy', 1);
app.use(rateLimiter)
app.use(helmet())
app.use(xssClean())
app.use(cors())
app.use(mongoSanitize())

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(languageMiddleware)

app.get('/', (req, res) => {
  res.send('SUCCESS')
})

router.use("/users", userRouter)
router.use("/tattoo-machines", tattooMachineRouter)
router.use("/orders", orderRouter)
router.use("/favourites", favouritesRouter)
router.use("/carts", carts)
app.use("/api/v1", router)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB()
    app.listen(PORT)
  } catch (err) {
    console.log({err})
  }
}

start()