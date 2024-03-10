//imports
const express = require("express");
var oscars = require("./oscars.json");

//start the express app
const app = express();

//middleware to set the response header of CORS for all incoming requests
app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

//middleware to apply checks on query parameters
app.use("/", (req, res, next) => {
  //for the year parameter
  let year = req.query.year;
  if (year) {
    if (year.match(/^[0-9]+$/) == null)
      return res.send({ error: "Year can only contain numbers! Try again." });
    //since the oscar record only has the record between the years of 1960 and 2010
    if (Number(year) < 1960 || Number(year) > 2010)
      return res.send({
        error: "Year can only be between 1960 to 2010! Try again.",
      });
  }

  //for the category paramater
  let category = req.query.category;
  if (category && category.trim() == "")
    return res.send({
      error: "Category cannot contain only empty spaces! Try again.",
    });

  //for the nominee paramater
  let nominee = req.query.nominee;
  if (nominee && nominee.trim() == "")
    return res.send({
      error: "Nominee cannot contain only empty spaces! Try again.",
    });

  //for the nominee paramater
  let info = req.query.info;
  if (info && info.trim() == "")
    return res.send({
      error: "Info cannot contain only empty spaces! Try again.",
    });

  //for the nomInfo paramater
  //to check if both nomInfo and nominee or info have been submitted
  let nomInfo = req.query.nomInfo;
  if (nomInfo && (nominee || info)) {
    return res.send({
      //if so, send an error object back
      error:
        "Enter a value in either the Nominee/Info fields separately or in the nominee-or-info field. You can not do both!",
    });
  } //to also checkif the nomInfo is not empty
  if (nomInfo && nomInfo.trim() == "")
    return res.send({
      error:
        "The Nominee or Info field cannot contain only empty spaces! Try again.",
    });

  //for the times parameter
  let times = req.query.times;
  if (times && times.match(/^[0-9]+$/) == null) {
    return res.send({ error: "Times can only contain integers! Try again." });
  }

  //if all checks pass, then our request goes forward
  next();
});

//API endpoint to get the nominations
app.get("/get-nominations", (req, res) => {
  //extracting all query parameters
  const year = req.query.year;
  const category = req.query.category;
  const nominee = req.query.nominee;
  const info = req.query.info;
  const nomInfo = req.query.nomInfo;
  const won = req.query.won;

  let nominated_oscars = oscars;

  //Parameter 1: filtering the oscars data if the year parameter has been provided
  if (year != undefined)
    nominated_oscars = nominated_oscars.filter(
      (oscar) => oscar.Year.substring(0, 4) == year
    );

  //Parameter 2: filtering the oscars data if the category parameter has been provided
  if (category != undefined)
    nominated_oscars = nominated_oscars.filter((oscar) =>
      oscar.Category.toLowerCase().includes(category.toLowerCase())
    );

  //Parameter 3: filtering the oscars data if one of the two options of nomInfo and info/nominee parameter has been provided
  if (!nomInfo) {
    //first filtering for nominee
    if (nominee != undefined)
      nominated_oscars = nominated_oscars.filter((oscar) =>
        oscar.Nominee.toLowerCase().includes(nominee.toLowerCase())
      );
    //then filtering for the info
    if (info != undefined)
      nominated_oscars = nominated_oscars.filter((oscar) => {
        if (oscar.Info && oscar.Info.length != 0) {
          //since some values for info are []
          return oscar.Info.toLowerCase().includes(info.toLowerCase());
        }
      });
  } else {
    //else if only nomInfo has been provided
    nominated_oscars = nominated_oscars.filter((oscar) => {
      //a true will be returned if either the given nomInfo parameter matches the nominee field or the info field or both
      let ifNomInfo = oscar.Nominee.toLowerCase().includes(
        nomInfo.toLowerCase()
      );
      if (oscar.Info && oscar.Info.length != 0)
        ifNomInfo =
          ifNomInfo || oscar.Info.toLowerCase().includes(nomInfo.toLowerCase());
      return ifNomInfo;
    });
  }

  //Parameter 4: filtering the oscars data on the basis of the won parameter
  if (won == "yes" || won == "no") {
    nominated_oscars = nominated_oscars.filter((oscar) => oscar.Won == won);
  }

  //if after filtering, the length of the data to return is 0, an error object is sent back
  if (nominated_oscars.length == 0)
    return res.send({ error: "No nominations found for the given inputs." });

  //otherwise, sent back the oscars data
  return res.send(nominated_oscars);
});

//API endpoint to get the nominees
app.get("/get-nominees", (req, res) => {
  const nominees = [];
  let counter = {};

  //extracting the query parameters
  const won = req.query.won;
  const times = req.query.times;

  //for each item of oscar, check the won condition and then store
  //or update the count of each nominee in the counter object
  for (const item of oscars) {
    if (won == item.Won || won == undefined) {
      if (
        item.Category.includes("Actress") ||
        item.Category.includes("Actor")
      ) {
        if (counter[item.Nominee]) {
          counter[item.Nominee] += 1;
        } else {
          counter[item.Nominee] = 1;
        }
      }
    }
  }

  //turning the counter object into an array of objects (nominees) and also applying
  //the times filter in this step
  for (const [key, value] of Object.entries(counter)) {
    if (times == undefined || value >= times) {
      nominees.push({ actor: key, times: value });
    }
  }

  //sort the nominees array into descending order
  nominees.sort((a, b) => b.times - a.times);

  //if the filtered nominees array is empty, send back an error, else send back the array
  if (nominees.length == 0)
    return res.send({ error: "No nominees found for the given inputs." });
  return res.send(nominees);
});

//the server is listening on port 8080
app.listen(8080, () => console.log("server is up!"));
