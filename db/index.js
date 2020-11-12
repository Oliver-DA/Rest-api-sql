const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "fsjstd-restapi.db",
})


const db = {
    Sequelize,
    sequelize,
    models: {}
}

db.models.User = require("./models/user")(sequelize);
db.models.Course = require("./models/course")(sequelize);

Object.keys(db.models).forEach((modelName) => {
    if (db.models[modelName].associate) {
      db.models[modelName].associate(db.models);
    }
});

module.exports = db;