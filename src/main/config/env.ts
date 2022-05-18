export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'td3X9-89b=aT2'
}
