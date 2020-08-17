const mongoose = require("mongoose");
var GeoJSON = require("mongoose-geojson-schema");

const mapSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  geometry: {
    type: {
      type: String,
      enum: ['Polygon']
    },
    coordinates: Array
  },
})


module.exports = mongoose.model("Map", mapSchema);
