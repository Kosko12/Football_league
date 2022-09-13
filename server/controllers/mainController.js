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
exports.getTeams = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `
    MATCH (t:Team)-[:PLAYS_AT]->(s:Stadium)
    return distinct(t.name) as team,
    SIZE((t)-[:PLAY_IN]->(:FootballMatch)) as matches,
    s.name as stadium
    `;
    // const readQuery = `MATCH (s:Sponsor) 
    // return distinct(s.name) as sponsorName,
    // SIZE((s)-[:SPONSORS]->(:Team)) as sponsoredClubs
    // ORDER BY sponsorName
    // `;
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
exports.deleteTeam = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `MATCH (s : Team {name: '${req.body.name}'})
    detach delete s;
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};
exports.getGuestForMatch = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (t:Team) 
    WHERE NOT t.name = '${req.params.name}'
    return t.name as teamName`;
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
    MATCH (t1)-[:PLAYS_AT]->(st:Stadium)
    MERGE (m: FootballMatch {dateAt: datetime('${req.body.date}')})
    CREATE (t1)-[rel1: PLAY_IN {role: 'host'}]->(m)
    CREATE (t2)-[rel2: PLAY_IN {role: 'guest'}]->(m)
    CREATE (m)-[rel3: HOSTED_IN]->(st)
    return m, t1, t2, rel1, rel2, rel3`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      console.log(`New sth: ${t}`);
      arrayToReturn.push(record.toObject());

    });
    console.log(arrayToReturn);
    return;
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
exports.getMatch = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `
    MATCH (m: FootballMatch)
    MATCH (t1: Team)-[rel1: PLAY_IN {role: 'host'}]->(m)
    MATCH (t2: Team)-[rel2: PLAY_IN {role: 'guest'}]->(m)
    MATCH (m)-[rel3: HOSTED_IN]->(st: Stadium)
    return ID(m) as id, t1.name as host, 
    t2.name as guest, m.dateAt as endsAt, st.name as stadium
    `;
  
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
exports.deleteMatch = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `
    MATCH (s : FootballMatch)
    where ID(s) = ${req.body.id}
    detach delete s;
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};
//STADIUM
exports.postStadium = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MATCH (c: City {name: '${req.body.cityName}'})
    MERGE (s: Stadium {name:'${req.body.name}'})
    MERGE (s)-[:LOCATED_IN]->(c)
    MERGE (sec1: Sector {name: 'host', capacity: ${req.body.hostCapacity}})
    MERGE (sec2: Sector {name: 'guest', capacity: ${req.body.guestCapacity}})
    MERGE (sec1)-[:PART_OF]->(s)
    MERGE (sec2)-[:PART_OF]->(s)
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
exports.patchStadium = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MATCH (s: Stadium)
    where ID(s) = ${req.body.id}
    Match (sectorsd)-[reld1:PART_OF]->(s)
    match (s)-[reld2:LOCATED_IN]->()
    MATCH (c: City {name: 'Kraków'})
    delete reld1, reld2, sectorsd
    MERGE (s)-[:LOCATED_IN]->(c)
    MERGE (sec1: Sector {name: 'host', capacity: ${req.body.hostCapacity}})
    MERGE (sec2: Sector {name: 'guest', capacity: ${req.body.guestCapacity}})
    MERGE (sec1)-[:PART_OF]->(s)
    MERGE (sec2)-[:PART_OF]->(s)
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
    const readQuery = `MATCH (t:Stadium) 
    MATCH (s1:Sector {name: 'host'})-[:PART_OF]->(t)
    MATCH (s2:Sector {name: 'guest'})-[:PART_OF]->(t)
    MATCH (t)-[:LOCATED_IN]->(c:City)
    return distinct(t.name) as stadiumName,
    ID(t) as id,
    s1.capacity as hostCapacity,
    s2.capacity as guestCapacity,
    c.name as cityName
    `;
  
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
exports.deleteStadium = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `MATCH (s : Stadium {name: '${req.body.name}'})
    detach delete s;
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};

//City
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
exports.deleteCity = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `MATCH (s : City {name: '${req.body.name}'})
    detach delete s;
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};

//SPONSOR
exports.postSponsor = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MERGE (s: Sponsor {name: '${req.body.name}'})
    return s as sponsor`;

    // Write transactions allow the driver to handle retries and transient errors
    const writeResult = await session.writeTransaction((tx) =>
      tx.run(writeQuery)
    );
    writeResult.records.forEach((record) => {
      const t = record.toObject();
      arrayToReturn.push(record.toObject());

    });
    res.status(200).json({
      arrayToReturn
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
exports.getSponsor = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `MATCH (s:Sponsor) 
    return distinct(s.name) as sponsorName,
    SIZE((s)-[:SPONSORS]->(:Team)) as sponsoredClubs
    ORDER BY sponsorName
    `;

    // MATCH (s:Sponsor)-[r:SPONSORS]->(t:Team)
    // return s.name as sponsorName, count(r) 
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};
exports.deleteSponsor = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `MATCH (s:Sponsor {name: '${req.params.name}'}) 
    detach delete s;
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};

//REFEREE
exports.postReferee = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MERGE (r: Referee {refId:'${req.body.refId}'})
    ON MATCH set r.age = ${req.body.age}
    ON CREATE set r.age = ${req.body.age}, r.name = '${req.body.name}'
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
exports.getReferee = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (p:Referee)
    MATCH (c: FootballMatch)
    return distinct(p.name) as refereeName,
    p.refId as refId,
    p.age as age,
    SIZE((p)-[:REFEREE]->(c)) as matches`
    const readResult = await session.readTransaction((tx) =>
      tx.run(readQuery)
    );
    readResult.records.forEach((record) => {
      console.log(record);
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
exports.deleteReferee = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `MATCH (s : Referee {refId: '${req.body.id}'})
    detach delete s;
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};
// CONTRACT
exports.postContract = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];

  try {
    const writeQuery = `
    MATCH (t: Team {name: '${req.body.clubName}'})
    MATCH (s: Sponsor {name: '${req.body.sponsorName}'})
    MERGE (s)-[rel: SPONSORS]->(t)
    ON CREATE set rel.signedAt = datetime('${req.body.contractPeriod[0]}'), rel.endsAt = datetime('${req.body.contractPeriod[1]}')
    ON MATCH set rel.signedAt = datetime('${req.body.contractPeriod[0]}'), rel.endsAt = datetime('${req.body.contractPeriod[1]}')
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
      arrayToReturn
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
exports.getContract = async (req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `
    MATCH (t: Team)
    MATCH (s: Sponsor)
    MATCH (s)-[rel: SPONSORS]->(t)
    where exists(rel.endsAt)
    return distinct(s.name) as sponsorName, t.name as clubName, datetime(rel.endsAt) as endsAt
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};
exports.deleteContract = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `MATCH (s : Sponsor {name: '${req.body.sponsorName}'})-[rel: SPONSORS]->(t: Team {name: '${req.body.clubName}'}) 
    delete rel;
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};

//PLAYER
exports.postPlayer = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  console.log(req.body);
  // return;
  try {
    const writeQuery = `
    MATCH (t: Team {name: '${req.body.teamName}'})
    MERGE (p: Player {name: '${req.body.playerName}', age: ${req.body.age}})
    MERGE (p)-[rel: CONTRACTED_WITH {role: '${req.body.role}', salary: ${req.body.salary}, signedAt: datetime('${req.body.contractPeriod[0]}'), endsAt: datetime('${req.body.contractPeriod[1]}')}]->(t)
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
exports.patchPlayer = async(req,res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery =  `
    MATCH (p1: Player)
    where ID(p1) = ${req.body.id}
    MATCH (t: Team {name: '${req.body.teamName}'})
    MATCH (p1)-[r:CONTRACTED_WITH]->()
    DELETE r
    MERGE (p1)-[rel: CONTRACTED_WITH {role: '${req.body.role}', salary: ${req.body.salary}, signedAt: datetime('${req.body.contractPeriod[0]}'), endsAt: datetime('${req.body.contractPeriod[1]}')}]->(t)
    return t, p1, rel
    `;
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
exports.getPlayers = async(req,res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {
    const readQuery = `MATCH (p:Player)-[rel:CONTRACTED_WITH]->(c: Team)
    return distinct(p.name) as playerName,
    ID(p) as id,
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
exports.deletePlayer = async(req, res, next) => {
  const session = driver.session({ database: "neo4j" });
  let arrayToReturn = [];
  try {

    const readQuery = `MATCH (s : Player )
    where ID(s) = ${req.body.id}
    detach delete s;
    `;
  
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
    res.status(400).json({
      'message': 'something went wrong...'
    })
  } finally {
    session.close();

  }
};
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