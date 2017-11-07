const request = require("request-promise-native");
const brain = require("brain.js");
const net = new brain.NeuralNetwork();
let DATA = [];
const dataJson = require('./matches.json')

const nsort = (a, b) => a - b

function calc(val) {
  const train_list = dataJson.map(data => {
    const radiant_win = data.radiant_win ? 1 : 0
    const rpick = data.radiant_team.split(",").map(n => +n).map(n => n / 1000).sort(nsort);
    const dpick = data.dire_team.split(",").map(n => +n).map(n => n / 1000).sort(nsort);
    const mmr = data.avg_mmr;
    // const duration = data.duration
    // const lobby_type = data.lobby_type
    // const game_mode = data.game_mode

    return {
      input: {
        r1 : rpick[0],
        r2 : rpick[1],
        r3 : rpick[2],
        r4 : rpick[3],
        r5 : rpick[4],
        d1: dpick[0],
        d2: dpick[1],
        d3: dpick[2],
        d4: dpick[3],
        d5: dpick[4]
      },
      // input: {
      //   rpick,
      //   dpick
      //   // mmr
      //   // duration,
      //   // lobby_type,
      //   // game_mode
      // },
      output: {
        radiant_win
      }
    };
  });
  net.train(train_list, {
    errorThresh: 0.005,  // error threshold to reach
    iterations: 20000,   // maximum training iterations
    log: true,           // console.log() progress periodically
    logPeriod: 1000       // number of iterations between logging
  });
  const rval = val.r.map(n => n / 1000).sort(nsort)
  const dval = val.d.map(n => n / 1000).sort(nsort)
  const output = net.run({
    r1 : rval[0],
    r2 : rval[1],
    r3 : rval[2],
    r4 : rval[3],
    r5 : rval[4],
    d1: dval[0],
    d2: dval[1],
    d3: dval[2],
    d4: dval[3],
    d5: dval[4]
  });
  console.log('output', output);
}


calc({
  r: [1, 5, 11, 96, 23], //am, cm, sf, cent, kunkka
  d: [22, 25, 26, 31, 50] //zeus, lina, lion, lich, dazzle
})

