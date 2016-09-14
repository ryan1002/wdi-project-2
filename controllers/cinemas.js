module.exports = {
  index: cinemasIndex
};

const Cinema = require("../models/cinema");

function cinemasIndex(req, res) {
  Cinema.find({}, (err, cinemas) => {
    if (err) return res.status(500).json({ message: "Something went wrong", error: err });
    return res.status(200).json({ cinemas });
  });
}
