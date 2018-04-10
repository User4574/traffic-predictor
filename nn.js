"use strict";

let synaptic = require('synaptic');
let fs = require('fs');
let doc =
  JSON.parse(
    fs.readFileSync(
      process.argv[process.argv.length - 1]
    )
  );
let data = doc["data"];
let max = doc["max"];

let trainingset = [];

for(let i = 0; i < (data.length - 10) ; i++) {
  trainingset.push({
    input: [
      data[i+0]["v"], data[i+1]["v"],
      data[i+2]["v"], data[i+3]["v"],
      data[i+4]["v"], data[i+5]["v"],
      data[i+6]["v"], data[i+7]["v"],
      data[i+8]["v"], data[i+9]["v"]
    ],
    output: [data[i+10]["v"]]
  });
}

let trainingoptions = {
  rate: .05,
  iterations: 20000,
  error: .001,
  shuffle: true,
};

let net = new synaptic.Architect.Perceptron(10, 7, 3, 1);
let trainer = new synaptic.Trainer(net);

console.error(trainer.train(trainingset, trainingoptions));

let predicteddata = data.slice(-10);

for(let t = data.length ; t < (2 * data.length) ; t++) {
  predicteddata.push({
    t: t,
    v: net.activate(predicteddata.slice(-10).map(x=>x.v))[0]
  });
}

predicteddata.splice(0, 10);

         data.forEach(x=>console.log(x.t + "," + (x.v * max)));
predicteddata.forEach(x=>console.log(x.t + "," + (x.v * max)));
