const brain = require("brain.js");
const net = new brain.NeuralNetwork();
const dataJson = require('./matches.json')

const nsort = (a, b) => a - b
function calc(title, vals) {
  const train_list = dataJson.map(data => {
    const radiant_win = data.radiant_win ? 1 : 0
    const rpick = data.radiant_team.split(",").map(n => +n).map(n => n / 1000)
    const dpick = data.dire_team.split(",").map(n => +n).map(n => n / 1000)
    const duration = data.duration
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
        d5: dpick[4],
        du: duration / 10000
      },
      output: {
        radiant_win
      }
    };
  });
  const inters = 1000
  net.train(train_list, {
    errorThresh: 0.005,  // error threshold to reach
    iterations: inters,   // maximum training iterations
    log: true,           // console.log() progress periodically
    logPeriod: 1000       // number of iterations between logging
  });
  vals.forEach((val, index) => {
    const rval = val.r.map(n => n / 1000)
    const dval = val.d.map(n => n / 1000)
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
      d5: dval[4],
      du: val.duration / 10000
    });
    console.log(title + ` game ${index + 1} winrate ${(output.radiant_win * 100).toFixed(2)}%`);
  })
  console.log(`Used ${dataJson.length} matches with all heroes, ${inters} iterations with selected heroes`)
}

// og lgd 1
calc('OG vs PSG.LGD', [
  {
    r: [7, 67, 112, 114, 83], //shaker, spectre, ww, mk, treant
    d: [58, 17, 5, 103, 4], //ench, storm, cm, titan, seeker
    duration: 34*60 + 38
  },
  {
    r: [91, 72, 74, 108, 87], // io, gyro, invoker, underlord, disruptor
    d: [58, 7, 3, 12, 23], // ench, shaker, bane, pl, kunkka
    duration: 38*60 + 05
  },
  {
    r: [66, 12, 112, 25, 10], // chen, pl, ww, lina, morf
    d: [63, 20, 110, 73, 78], // weaver, venge, phoenix, alch, brew
    duration: 34*60 + 26
  },
  {
    r: [91, 12, 66, 74, 2], // io, pl, chen, invoker, axe
    d: [58, 10, 100, 78, 4], // ench, morf, tusk, brew, seeker
    duration: 65*60 + 21
  },
  {
    r: [53, 86, 97, 106, 22], // np, rubick, magnus, ember, zeus
    d: [7, 109, 75, 23, 65], // shaker, tb, silencer, kunkka, batrider
    duration: 36*60 + 29
  }
])
