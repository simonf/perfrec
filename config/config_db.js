module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./data/db.development.sqlite",
    logging: false
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    dialect: "sqlite",
    storage: "./data/db.production.sqlite"
  }
};