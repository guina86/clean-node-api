export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://docker:mongopw@localhost:49153',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'td3X9-89b=aT2'
}
