'use strict';
module.exports = (sequelize, DataTypes) => {
  var Recommendation = sequelize.define('Recommendation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    custid: DataTypes.STRING,
    service: DataTypes.STRING,
    request: DataTypes.STRING,
    bandwidth: DataTypes.INTEGER,
    status: DataTypes.STRING
  })
  return Recommendation
}