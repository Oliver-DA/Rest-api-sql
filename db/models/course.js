const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {

    class Course extends Model {}

    Course.init({

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,

            validate: {
                notEmpty: {
                    msg: "Title is required"
                },
                notNull: {
                    msg: "title can not be null"
                }
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,

            validate: {
                notEmpty: {
                    msg: "description is required"
                },
                notNull: {
                    msg: "desctiption can not be null"
                }
            }
        },

        estimatedTime: {
            type: DataTypes.STRING,
            allowNull: true
        },

        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: true
        }

    }, { sequelize })

    Course.associate = (models) => {

        Course.belongsTo(models.User, {
            foreignKey: "userId"
        })
    }

    return Course
}