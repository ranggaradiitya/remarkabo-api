const { ObjectId } = require('mongodb');

exports.addNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;
  const { title } = req.body;

  try {
    if (!title) {
      throw new Error('title is missing');
    }

    const data = {
      ...req.body,
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
    }

    // insert data to collection
    const result = await notesCollection.insertOne(data);
    // const objResult = JSON.parse(result);
    console.log(result);
    res.status(200).json({ message: 'Data successfully saved', _id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

exports.getAllNotes = async (req, res, next) => {
  const { notesCollection } = req.app.locals;

  try {
    // find All Notes
    const result = await notesCollection.find().sort({ _id: -1 }).toArray();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;
  const { id } = req.params;

  try {
    // find Notes based on id
    const result = await notesCollection.findOne({ _id: ObjectId(id) });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;
  const { id } = req.params;
  const { title, note } = req.body;

  try {
    if (!title) {
      throw new Error('title is missing');
    }
    // update data collection
    const result = await notesCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { title, note, updatedAt: new Date(Date.now()).toISOString() } }
    );
    console.log(result);
    res.status(200).json('Data successfully updated');
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  const { notesCollection } = req.app.locals;
  const { id } = req.params;

  try {
    // delete data collection
    const result = await notesCollection.deleteOne({ _id: ObjectId(id) });
    console.log(result);
    res.status(200).json('Data successfully deleted');
  } catch (error) {
    next(error);
  }
};