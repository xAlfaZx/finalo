//առաջին 10 տողը նույնությամբ գրիր, որպեսզի լոկալհոստ ունենաս
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var fs = require("fs");

app.use(express.static("."));

app.get("/", function (req, res) {
  res.redirect("Indexp2.html");
});
server.listen(3025);

grassArr = [];
eaterArr = [];
toxicGrassArr = [];
WolfArr = [];
WaterArr = [];

Grass = require("./Grass_Class");
Eater = require("./Eater");
ToxicGrass = require("./ToxicGrass");
Water = require("./Water");
Wolf = require("./Wolf");

var n = 25;
matrix = [];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < n; i++) {
  matrix[i] = [];
  for (let j = 0; j < n; j++) {
    matrix[i][j] = Math.floor(rand(0, 7));
  }
}

io.sockets.emit("send matrix", matrix);

function createObject() {
  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] == 1) {
        grassArr.push(new Grass(x, y));
      } else if (matrix[y][x] == 2) {
        eaterArr.push(new Eater(x, y));
      } else if (matrix[y][x] == 3) {
        toxicGrassArr.push(new ToxicGrass(x, y));
      } else if (matrix[y][x] == 4) {
        WolfArr.push(new Wolf(x, y));
      } else if (matrix[y][x] == 5) {
        let randomJur = Math.floor(rand(0, 100));
        if (randomJur == 5) {
          WaterArr.push(new Water(x, y));
        } else matrix[y][x] == 1;
        grassArr.push(new Grass(x, y));
      }
    }
  }
  io.sockets.emit("send matrix", matrix);
}

function game() {
  for (var i in grassArr) {
    grassArr[i].mul();
  }
  for (var i in eaterArr) {
    eaterArr[i].eat();
  }
  for (var i in WolfArr) {
    WolfArr[i].eat();
  }
  io.sockets.emit("send matrix", matrix);
}

setInterval(game, 1000);

function kill() {
  grassArr = [];
  eaterArr = [];
  toxicGrassArr = [];
  WolfArr = [];
  WaterArr = [];
  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
      matrix[y][x] = 0;
    }
  }
  io.sockets.emit("send matrix", matrix);
}

function addGrass() {
  for (var i = 0; i < 7; i++) {
    var x = Math.floor(Math.random() * matrix[0].length);
    var y = Math.floor(Math.random() * matrix.length);
    if (matrix[y][x] == 0) {
      matrix[y][x] = 1;
      // var gr = new Grass(x, y);
      grassArr.push(new Grass(x, y));
    }
  }
  io.sockets.emit("send matrix", matrix);
}

function addEater() {
  for (var i = 0; i < 7; i++) {
    var x = Math.floor(Math.random() * matrix[0].length);
    var y = Math.floor(Math.random() * matrix.length);
    if (matrix[y][x] == 0) {
      matrix[y][x] = 2;
      eaterArr.push(new Eater(x, y));
    }
  }
  io.sockets.emit("send matrix", matrix);
}

function addWater() {
  for (var i = 0; i < 7; i++) {
    var x = Math.floor(Math.random() * matrix[0].length);
    var y = Math.floor(Math.random() * matrix.length);
    if (matrix[y][x] == 0) {
      matrix[y][x] = 5;
      WaterArr.push(new Water(x, y));
    }
  }
  io.sockets.emit("send matrix", matrix);
}

function addWolf() {
  for (var i = 0; i < 7; i++) {
    var x = Math.floor(Math.random() * matrix[0].length);
    var y = Math.floor(Math.random() * matrix.length);
    if (matrix[y][x] == 0) {
      matrix[y][x] = 4;
      WolfArr.push(new Wolf(x, y));
    }
  }
  io.sockets.emit("send matrix", matrix);
}

function addToxicGrass() {
  for (var i = 0; i < 7; i++) {
    var x = Math.floor(Math.random() * matrix[0].length);
    var y = Math.floor(Math.random() * matrix.length);
    if (matrix[y][x] == 0) {
      matrix[y][x] = 3;
      toxicGrassArr.push(new ToxicGrass(x, y));
    }
  }
  io.sockets.emit("send matrix", matrix);
}

io.on("connection", function (socket) {
  createObject();
  socket.on("kill", kill);
  socket.on("add grass", addGrass);
  socket.on("add Eater", addEater);
  socket.on("add wolf", addWolf);
  socket.on("add water", addWater);
  socket.on("add ToxicGrass", addToxicGrass);
});

var statistics = {};

setInterval(function () {
  statistics.Grass_CLass = grassArr.length;
  statistics.Eater = eaterArr.length;
  statistics.ToxicGrass = ToxicGrass.length;
  statistics.Water = Water.length;
  statistics.Wolf = Wolf.length;

  fs.writeFile("statistics.json", JSON.stringify(statistics), function () {
    console.log("send");
  });
}, 1000);
//դե ինչ այսօր այսքանը:

//ինձ համար շատ կարևոր է , որ հենց դու շատ լավ հասկանաս էս
//ամենը ու լինես լավագույնը քո ընտրած ոլորտում:

//Գիտեմ, որ լիիիիիքը սխալ կա մեջը: Դուք ճիշտը գրեք :PPPPP
