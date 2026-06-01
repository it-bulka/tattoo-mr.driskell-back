const crypto = require('crypto')

const WAYFORPAY_URL = 'https://secure.wayforpay.com/pay'

const generateHMAC = (params) => {
  const signString = params.map(String).join(';')
  return crypto
    .createHmac('md5', process.env.WAYFORPAY_MERCHANT_SECRET_KEY)
    .update(signString, 'utf8')
    .digest('hex')
}

const generatePaymentData = (order) => {
  if (!process.env.WAYFORPAY_MERCHANT_SECRET_KEY || !process.env.WAYFORPAY_MERCHANT_ACCOUNT) {
    throw new Error('WayForPay env vars are not configured (WAYFORPAY_MERCHANT_ACCOUNT, WAYFORPAY_MERCHANT_SECRET_KEY)')
  }

  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT
  const merchantDomainName = process.env.WAYFORPAY_DOMAIN_NAME
  const orderReference = order._id.toString()
  const orderDate = Math.floor(new Date(order.orderDate).getTime() / 1000)
  const amount = order.totalPrice
  const currency = 'UAH'

  const productNames = order.items.map((i) => i.nameAtPurchase)
  const productCounts = order.items.map((i) => i.quantity)
  const productPrices = order.items.map((i) => i.priceAtPurchase)

  const merchantSignature = generateHMAC([
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productNames,
    ...productCounts,
    ...productPrices,
  ])

  const clientOrigin = process.env.CLIENT_ORIGIN
  const apiBase = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}/api/v1`

  return {
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    productName: productNames,
    productCount: productCounts,
    productPrice: productPrices,
    merchantSignature,
    returnUrl: `${clientOrigin}/catalog/cart/payment-success?orderId=${orderReference}`,
    serviceUrl: `${apiBase}/orders/wayforpay/callback`,
    language: 'UA',
    paymentSystems: 'card',
  }
}

const verifyWebhookSignature = (body) => {
  const {
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
    merchantSignature: receivedSignature,
  } = body

  const expectedSignature = generateHMAC([
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
  ])

  return expectedSignature === receivedSignature
}

const generateCallbackResponseSignature = (orderReference, status, time) => {
  return generateHMAC([orderReference, status, time])
}

module.exports = {
  generatePaymentData,
  verifyWebhookSignature,
  generateCallbackResponseSignature,
  WAYFORPAY_URL,
}
