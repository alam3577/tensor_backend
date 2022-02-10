const axios = require("axios");
const fileSystem = require("fs");
const fastcsv = require("fast-csv");
const User = require("../model/user");
const userFromAnotherServerUrl = "https://gorest.co.in/public-api/users";

exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      const { data } = await axios.get(userFromAnotherServerUrl);
      const user = data?.data;
      for (const elem of user) {
        await new User(elem).save();
      }
      const users = await User.find({});
      res.status(200).send(users);
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(404).json({ message: "Data not found" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let userId = req.params.id;
    let user = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    res.status(200).send(user);
  } catch (err) {
    res.status(404).json({ message: "User can't be updated" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    let userId = req.params.id;
    let user = await User.findById({ _id: userId });
    res.status(200).send(user);
  } catch (err) {
    res.status(404).json({ message: "User not found" });
  }
};

exports.getCsvFile = async (req, res) => {
  try {
    let data = await User.find({});
    let c_data = data.map((elem) => ({
      id: elem.id,
      name: elem.name,
      gender: elem.gender,
      status: elem.status,
      createdAt: elem.createdAt,
      updatedAt: elem.updatedAt,
    }));
    const ws = fileSystem.createWriteStream("public/data.csv");
    fastcsv
      .write(c_data, { headers: true })
      .on("finish", function () {
        res.send(
          "<a href='/public/data.csv' download='data.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>"
        );
      })
      .pipe(ws);
  } catch (err) {
    res.status(404).json({ message: "Csv can't be downloaded" });
  }
};
