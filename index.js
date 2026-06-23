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

const logger = require('./app/utils/logger')
const connectDB = require('./app/db/connectDB')
// MIDDLEWARE
const languageMiddleware = require('./app/middleware/language-middleware')
const errorMiddleware = require('./app/middleware/error-handler')
const notFoundMiddleware = require('./app/middleware/not-found')

// ROUTES
const authRouter = require('./app/routes/auth.js')
const userRouter = require('./app/routes/user.js')
const tattooMachineRouter = require('./app/routes/tattoo-machines.js')
const orderRouter = require('./app/routes/order.js')
const favouritesRouter = require('./app/routes/favourite')
const carts = require('./app/routes/cart')
const promo = require('./app/routes/promo')
const servicesRouter = require('./app/routes/service')
const brandsRouter = require('./app/routes/brands')
const discountRouter = require('./app/routes/discount')
const bundleRouter = require('./app/routes/bundle')

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60
})

app.set('trust proxy', 1);
app.use(rateLimiter)
app.use(helmet())
app.use(xssClean())
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Device-Id', 'Accept-Language'],
}))
app.use(mongoSanitize())

app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

morgan.token('body', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) return ''
  const sanitized = logger.sanitize({ ...req.body })
  const str = JSON.stringify(sanitized)
  return str.length > 500 ? str.slice(0, 500) + '...' : str
})

app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms :body'))

app.use(languageMiddleware)

app.get('/', (req, res) => {
  res.send('SUCCESS')
})

router.use("/auth", authRouter)
router.use("/users", userRouter)
router.use("/tattoo-machines", tattooMachineRouter)
router.use("/orders", orderRouter)
router.use("/favourites", favouritesRouter)
router.use("/carts", carts)
router.use("/promo", promo)
router.use("/services", servicesRouter)
router.use("/brands", brandsRouter)
router.use("/discounts", discountRouter)
router.use("/bundles", bundleRouter)
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