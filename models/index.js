const { Sequelize } = require("sequelize");
const url = process.env.DATABASE_URL;
const dialect = process.env.DB_DIALECT || "postgres";

const sequelize = new Sequelize(url, { dialect, logging: false });

const User = require("./user")(sequelize);
const Post = require("./post")(sequelize);
const Comment = require("./comment")(sequelize);

// relations
User.hasMany(Post, { foreignKey: "authorId", onDelete: "CASCADE" });
Post.belongsTo(User, { as: "author", foreignKey: "authorId" });

Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId" });

User.hasMany(Comment, { foreignKey: "authorId", onDelete: "CASCADE" });
Comment.belongsTo(User, { as: "author", foreignKey: "authorId" });

module.exports = { sequelize, Sequelize, User, Post, Comment };
