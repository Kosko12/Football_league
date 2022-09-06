const neo4j = require("neo4j-driver");

const driver = neo4j.driver(process.env.DB_URI, neo4j.auth.basic(process.env.DB_LOGIN, process.env.DB_PASS), { disableLosslessIntegers: true });

exports.getIndex = async (req, res, next) => {
    let teams = {

        teams:[{name: "Fc Barcelona"},
        {name: "Real Madryt"}]
    }
    const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (t:Team) return t.name as clubName`;
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    let pos = 1;
    readResult.records.forEach((record) => {
      console.log(`Found person: ${record.get('clubName')}`);
      arrayToReturn.push(Object.assign({pos: pos},record.toObject()));
      pos += 1;
    });
    res.render('teams/index', {teams: arrayToReturn});
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    session.close();
  }
    

    res.render('teams/index', teams);
}