'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(Recipe_ingredient) {
      Ingredients.belongsToMany(Recipe_ingredient,{
        foreignKey:"ingredient_id"
      })
    }
  }
  Ingredients.init({
    ingredient_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    } ,
    name:{
      type:DataTypes.STRING,
      allowNull:false
    } 
  }, {
    sequelize,
    modelName: 'Ingredients',
  });
  return Ingredients;
};