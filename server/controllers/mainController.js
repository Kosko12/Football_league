const neo4j = require("neo4j-driver");

const driver = neo4j.driver(process.env.DB_URI, neo4j.auth.basic(process.env.DB_LOGIN, process.env.DB_PASS));
const session = driver.session({ database: "neo4j" });

exports.postTeam = async (req, res, next) => {
  try {
    const writeQuery = `MERGE (t:Team {name: '${req.body.name}'})
        RETURN t`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.get("t");
      console.log(`Created team: ${t.properties.name}`);
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    res.status(200).json({
      message: "created!",
    });
  }
};
exports.getTeam = async (req, res, next) => {
  try {
    const readQuery = `MATCH (t:Team) return t`;
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    readResult.records.forEach((record) => {
      console.log(`Found person: ${record.get('t')}`);
    });
    res.status(201).json({
        'data': readResult.records
    })
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
  }
};
//DISH
exports.postDishes = (req, res, next) => {
  Dish.insertMany(req.body.dishes, (err, createdDoc) => {
    if (err) {
      return res.status(401).json({
        message: err.body.message,
      });
    }
  })
    .then((response) => {
      res.status(201).json({
        message: "Created!",
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: err.body.message,
      });
    });
};
exports.postDish = (req, res, next) => {
  const newDish = new Dish({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    dishImgUrl: req.body.dishImgUrl,
    ingredientsType: req.body.ingredientsType,
    weight: req.body.weight,
    price: req.body.price,
  });
  newDish
    .save()
    .then((response) => {
      res.status(201).json({
        message: "Dish created",
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: err.body.message,
      });
    });
};
