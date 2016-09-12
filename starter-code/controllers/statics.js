module.exports = {
  home: staticshome
};

const path = require("path");

function staticsHome(req, res){
  return res.sendFile(path.join(__dirname, "../index.html"));
}

// This renders the home page.
