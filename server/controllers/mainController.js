const neo4j = require("neo4j-driver");

const driver = neo4j.driver(process.env.DB_URI, neo4j.auth.basic(process.env.DB_LOGIN, process.env.DB_PASS), { disableLosslessIntegers: true });
// const session = driver.session({ database: "neo4j" });

exports.postTeam = async (req, res, next) => {

  const session = driver.session({ database: "neo4j" });

  try {
    const writeQuery = 
      `MERGE (t:Team {name: '${req.body.name}'})
      MERGE (c: City {name: '${req.body.city}'})
      MERGE (s: Stadium {name: '${req.body.stadium}'})
      MERGE (t)-[:FROM]->(c)
      MERGE (t)-[:PLAYS_AT]->(s)
      MERGE (s)-[:LOCATED_IN]->(c)
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
    return res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
  return res.status(200).json({
      message: "created!",
    });
};
exports.getTeam = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (t:Team) return t.name as teamName`;
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    readResult.records.forEach((record) => {
      console.log(`Found person: ${record.get('teamName')}`);
      arrayToReturn.push(record.toObject());
    });
    res.status(201).json({
        arrayToReturn
    })
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    session.close();

  }
};

exports.postMatch = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MATCH (t1: Team {name: '${req.body.hostName}'})
    MATCH (t2: Team {name: '${req.body.guestName}'})
    CREATE (m: FootballMatch {dateAt: datetime('${req.body.date}')})
    CREATE (t1)-[rel1: PLAY_IN {role: 'host'}]->(m)
    CREATE (t2)-[rel2: PLAY_IN {role: 'guest'}]->(m)
    return m, t1, t2, rel1, rel2`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};

exports.postStadium = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MERGE (s: Stadium {name:'${req.body.name}'})
    MERGE (c: City {name: '${req.body.cityName}'})
    MERGE (s)-[:LOCATED_IN]->(c)
    return s`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};

exports.getStadium = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (t:Stadium) return t.name as clubName`;
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    readResult.records.forEach((record) => {
      console.log(`Found person: ${record.get('clubName')}`);
      arrayToReturn.push(record.toObject());
    });
    res.status(201).json({
        'data': arrayToReturn
    })
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    session.close();

  }
};
exports.getStadiumByName = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (s:Stadium)
        MATCH(c: City {name: '${req.params.name}'})
        WHERE (s)-[:LOCATED_IN]->(c)
        return s.name as stadiumName`;
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    readResult.records.forEach((record) => {
      console.log(`Found person: ${record.get('stadiumName')}`);
      arrayToReturn.push(record.toObject());
    });
    res.status(201).json({
      arrayToReturn
    })
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    session.close();

  }
};

exports.postCity = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    CREATE (c: City {name: '${req.body.name}', country: '${req.body.country}'})
    return c as city`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};
exports.getCity = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (t:City) return t.name as clubName`;
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    readResult.records.forEach((record) => {
      console.log(`Found person: ${record.get('clubName')}`);
      arrayToReturn.push(record.toObject());
    });
    res.status(201).json({
      arrayToReturn
    })
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    session.close();

  }
};
exports.getCitiesWithAdditionalInfo = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (c:City)
    return distinct(c.name) as cityName,
    SIZE((:Team)-[:FROM]->(c)) as teams,
    SIZE((:Stadium)-[:LOCATED_IN]->(c)) as stadiums`;
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    readResult.records.forEach((record) => {
      arrayToReturn.push(record.toObject());
    });
    res.status(201).json({
      arrayToReturn
    })
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    session.close();

  }
};

exports.postSponsor = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    CREATE (s: Sponsor {name: '${req.body.name}'})
    return s as sponsor`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};

exports.postReferee = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    CREATE (r: Referee {name: '${req.body.name}'})
    return r as Referee`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};

exports.postContract = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MATCH (t: Team {name: '${req.body.clubName}'})
    MATCH (s: Sponsor {name: '${req.body.sponsorName}'})
    CREATE (s)-[rel: SPONSORS {signedAt: datetime('${req.body.startDate}'), endsAt: datetime('${req.body.endDate}'), monthlyValue: ${req.body.value}}]->(t)
    return s, t, rel`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};

exports.postPlayer = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  console.log(req.body);
  // return;
  try {
    const writeQuery = `
    MATCH (t: Team {name: '${req.body.teamName}'})
    CREATE (p: Player {name: '${req.body.playerName}', age: ${req.body.age}})
    CREATE (p)-[rel: CONTRACTED_WITH {role: '${req.body.role}', salary: ${req.body.salary}, signedAt: datetime('${req.body.contractPeriod[0]}'), endsAt: datetime('${req.body.contractPeriod[1]}')}]->(t)
    return t, p, rel`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};

exports.getPlayers = async(req,res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (p:Player)-[rel:CONTRACTED_WITH]->(c: Team)
    return distinct(p.name) as playerName,
    p.age as age,
    rel.salary as salary,
    rel.signedAt as playSince,
    rel.endsAt as endsAt,
    c.name as teamName`;
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    readResult.records.forEach((record) => {
      arrayToReturn.push(record.toObject());
    });
    res.status(201).json({
      arrayToReturn
    })
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    session.close();

  }
}
//TODO: still
exports.postPlayerContract = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MATCH (t1: Team {name: '${req.body.hostName}'})
    MATCH (t2: Team {name: '${req.body.guestName}'})
    CREATE (m: FootballMatch {dateAt: datetime('${req.body.date}')})
    CREATE (t1)-[rel1: PLAY_IN {role: 'host'}]->(m)
    CREATE (t2)-[rel2: PLAY_IN {role: 'guest'}]->(m)
    return m, t1, t2, rel1, rel2`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};

exports.postTicket = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MATCH (sec: Sector {nr: ${req.body.sectorNr}})
    MATCH (m: FootballMatch {id: ${req.body.id}})
    CREATE (t: Ticket)
    CREATE (t)-[rel1: SEAT_IN]->(sec)
    CREATE (t)-[rel2: FOR]->(m)
    return m, sec, t, rel1, rel2`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};

exports.postSector = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MATCH (st: Stadium {name: '${req.body.stadiumName}'})
    CREATE (sec: Sector {nr: ${req.body.sectorNr}, capacity: ${req.body.capacity}}})
    CREATE (sec)-[rel: PART_OF]->(st)
    return st, sec, rel`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      'data': arrayToReturn
  })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.close();
  }
};