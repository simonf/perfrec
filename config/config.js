module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./db.development.sqlite",
    logging: false
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    dialect: "sqlite",
    storage: "./db.production.sqlite"
  }
};