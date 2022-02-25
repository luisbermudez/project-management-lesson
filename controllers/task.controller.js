const Task = require('../models/Task.model');
const Project = require('../models/Project.model');
const mongoose = require('mongoose');

exports.createTask = async (req, res, next) => {
    try {
        const { title, description, projectId } = req.body;
        const newTask = await Task.create({ title, description, project: projectId });
        const updatedProject = await Project.findByIdAndUpdate(projectId, {
          $push: { tasks: newTask._id },
        });
        res.status(201).json({ newTask });
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
};

exports.readTaskById = async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    try {
        const task = await Task.findById(taskId);
        res.status(200).json({ task });
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
}

exports.updateTaskById = async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
        res.status(200).json({ updatedTask });
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
};

exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    try {
        const task = await Task.findByIdAndRemove(taskId);
        const project = await Project.findByIdAndUpdate(task.project, {
            $pull: { tasks: taskId },
        });
        res
          .status(200)
          .json({ message: `Task with id: ${taskId} has been removed.` });
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
}