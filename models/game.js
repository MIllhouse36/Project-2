module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define("Game", {
    // The email cannot be null, and must be a proper email before creation
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Game;
};
