const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { createCollage } = require("image-collage-maker");

// Cached list of games as JSON from the CSV file.
const LIST = [];

// Constants
const CONSTANTS = {
  INPUT_FILE: path.join(__dirname, "..", "public", "games.csv"),
};

// Returns a list of all the games in the CSV file.
router.get('/list', (req, res) => {
  if (LIST.length > 0) {
    return res.json(LIST);
  }

  fs.createReadStream(CONSTANTS.INPUT_FILE)
  .pipe(parse({ delimiter: ",", from_line: 1 }))
  .on("data", function (row) {
    LIST.push({
      name: row[0], 
      id: row[1]
    });
  })
  .on("end", function () {
    console.log("finished");
    return res.json(LIST);
  })
  .on("error", function (error) {
    console.log(error.message);
    return res.json([]);
  });
});

// Generates a collage of the games specified in the query string.
router.get('/generate', async (req, res) => {
  imagePaths = req.query.ids.split(",").map(id => path.join(__dirname, "..", "public", "images", id + ".jpg"));
  const theDate = new Date();
  const OUTPUT_FILE = theDate.getFullYear() + "-" + (theDate.getMonth() + 1) + "-" + theDate.getDate() + " - rotation.png";
  const options = {
    collageSize: { width: 230 * imagePaths.length, height: 230 },
    imagesPerRow: imagePaths.length,
    padding: 0,
    margin: 0,
    outputFormat: "jpeg",
    outputQuality: 80,
    shape: "rectangle", // Default shape if shapesArray is not provided
    // shapesArray: ["circle", "triangle", "hexagon", "rectangle"], // Optional array of shapes
    userDefinedImageSize: { width: 230, height: 230 },
    // minImageSize: 100,
    // maxImageSize: 300,
    outputPath:  path.join(__dirname, "..", "public", "gen", OUTPUT_FILE),
    // backgroundColor: "#f0f0f0", // Background color in HEX format
    // imageMaskColors: ["#FF0000", "#00FF00"], // Example mask colors in HEX format
    useMasks: false, // Set to true to apply masks
  };

  try {
    await createCollage(imagePaths, options);
    console.log("Enhanced collage created and saved.");
    TEXT = "";
    LIST.filter(game => req.query.ids.includes(game.id)).forEach(game => {
      TEXT += '<a href="https://boardgamegeek.com/boardgame/' + game.id + '">' + game.name + '</a><br/>';
    });
    res.json({ success: true, file: OUTPUT_FILE, text: TEXT});
  } catch (error) {
    console.error("Error creating collage:", error);
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;
