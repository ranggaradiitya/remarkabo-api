const { ObjectId } = require("mongodb");
const passport = require("passport");
const { getDb } = require("./utils/dbConnection");
const jwt = require("jsonwebtoken");

exports.addNote = async (req, res, next) => {
  const db = getDb();
  const { title } = req.body;

  try {
    if (!title) {
      throw new Error("title is missing");
    }

    const data = {
      ...req.body,
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      username: req.user.username,
    };

    // insert data to collection
    const result = await db.collection("notes").insertOne(data);
    // const objResult = JSON.parse(result);
    console.log(result);
    res
      .status(200)
      .json({ message: "Data successfully saved", _id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

exports.getAllNotes = async (req, res, next) => {
  const db = getDb();

  try {
    // find All Notes
    const result = await db
      .collection("notes")
      .find({ username: req.user.username })
      .sort({ _id: -1 })
      .toArray();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  const db = getDb();
  const { id } = req.params;

  try {
    // find Notes based on id
    const result = await db.collection("notes").findOne({ _id: ObjectId(id) });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  const db = getDb();
  const { id } = req.params;
  const { title, note } = req.body;

  try {
    if (!title) {
      throw new Error("title is missing");
    }
    // update data collection
    const result = await db
      .collection("notes")
      .updateOne(
        { _id: ObjectId(id) },
        { $set: { title, note, updatedAt: new Date(Date.now()).toISOString() } }
      );
    console.log(result);
    res.status(200).json("Data successfully updated");
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  const db = getDb();
  const { id } = req.params;

  try {
    // delete data collection
    const result = await db
      .collection("notes")
      .deleteOne({ _id: ObjectId(id) });
    console.log(result);
    res.status(200).json("Data successfully deleted");
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  passport.authenticate(
    "register",
    { session: false },
    async (err, user, info) => {
      if (user) {
        res.status(200).json({
          message: "Register Successful",
          user: user,
        });
      } else {
        res.status(200).json({
          message: "Email already registered",
        });
      }
    }
  )(req, res, next);
};

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };
        const token = jwt.sign(body, "mys3cret");

        return res.json({ user: body, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
