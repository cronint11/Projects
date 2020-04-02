// Set up MySQL connection.
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "qbhol6k6vexd5qjs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "ju165caatpf2nlo9",
  password: "wa046fkzvelw4cpn",
  database: "im00aoekv2pgiwko"
});

// Make connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Export connection for our ORM to use.
module.exports = connection;
