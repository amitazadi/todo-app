const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 4000;

app.use(cors({origin: true, credentials: true}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://amit:amit123@cluster0.odjunit.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Define Todo model
const todoSchema = new mongoose.Schema({
  title: String,
});

const Todo = mongoose.model("Todo", todoSchema);

// API routes
app.get("/todos", (req, res) => {
  Todo.find()
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/addtodos", async (req, res) => {
  const title = req.body.title;
  const _id = req.body.todoid;

  console.log(req.body)

  const doc = await Todo.findOne({ _id });
  // console.log(title);
  // console.log(_id);
  // console.log(doc);

  if (_id !== undefined && doc) {
    doc.title = title;
    await doc.save();
    res.json("todo updated");
  } else {
    const todo = new Todo({
      title: title,
    });

    await todo
      .save()
      .then(() => {
        res.json("Todo added");
      })
      .catch((err) => {
        // console.log(err);
      });
    console.log("new todo added")
  }
});

app.post("/deletetodos", (req, res) => {
  const id = req.body.id;

  console.log(id);

  Todo.findByIdAndRemove(id)
    .then((todos) => {
      // console.log(todos)
      res.json("todo deleted");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
