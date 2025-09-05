const { DataTypes } = require("sequelize");
module.exports = (sequelize) =>
  sequelize.define(
    "Comment",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      content: { type: DataTypes.TEXT, allowNull: false }
    },
    { timestamps: true, tableName: "comments" }
  );
