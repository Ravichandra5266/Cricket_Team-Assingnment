const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB Error:${erroe}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Get Players
const dbResponseObject = (eachPlayer) => {
  return {
    playerId: eachPlayer.player_id,
    playerName: eachPlayer.player_name,
    jerseyNumber: eachPlayer.jersey_number,
    role: eachPlayer.role,
  };
};

app.get("/players/", async (request, response) => {
  const playersQuery = `SELECT * FROM cricket_team`;
  const dbResponse = await db.all(playersQuery);
  response.send(dbResponse.map((eachItem) => dbResponseObject(eachItem)));
});

//Add Player
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const createPlayerQuery = ` INSERT INTO cricket_team(player_name,jersey_number,role)
  VALUES('${playerName}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(createPlayerQuery);
  response.send("Player Added to Team");
});

//Get Player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const dbResponse = await db.get(playerQuery);
  response.send(dbResponseObject(dbResponse));
});

//Update Player
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const playerQuery = `UPDATE cricket_team SET player_name = '${playerName}',jersey_number = ${jerseyNumber},role = '${role}'
  WHERE player_id = ${playerId}`;
  const dbResponse = await db.run(playerQuery);
  response.send("Player Details Updated");
});

//Delete Player
app.delete("/players/:playerId/", async (require, response) => {
  const { playerId } = require.params;
  const playerQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  const dbResponse = await db.run(playerQuery);
  response.send("Player Removed");
});

//Explore Apis
module.exports = app;
