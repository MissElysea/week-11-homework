const Todo = require('../models/todos')

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos)
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

exports.createTodos = async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSpecificTodos = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      res.json(todo);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTodos = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      todo.title = req.body.title;
      todo.description = req.body.description;
      todo.completed = req.body.completed;
      await todo.save();
      res.json(todo);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTodos = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      await todo.deleteOne();
      res.json({ message: 'Todo deleted' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};