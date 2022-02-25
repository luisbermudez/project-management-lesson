const Project = require('../models/Project.model');
const mongoose = require('mongoose');

exports.createProject = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const newProject = await Project.create({ title, description, tasks: [] });
        res.status(201).json({ newProject });
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
}

exports.readProjects = async (req, res, next) => {
    try {
        const projects = await Project.find().populate('tasks');
        res.status(200).json({ projects });
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
}

exports.readProjectById = async (req, res, next) => {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ errorMessage: "Specified id is not valid" });
      return;
    }

    try {
        const project = await Project.findById(projectId).populate('tasks');
        res.status(200).json({ project });
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
}

exports.updateProjectById = async (req, res, next) => {
    const { projectId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ errorMessage: "Specified id is not valid" });
      return;
    }

    try {
        const project = await Project.findByIdAndUpdate(projectId, updates, {
          new: true,
        });
        res.status(200).json({ project });
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
}

exports.deleteProject = async (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ errorMessage: "Specified id is not valid" });
      return;
    }

    try {
        await Project.findByIdAndRemove(projectId);
        res.status(200).json({ message: `Project with id: ${projectId} has been removed.`})
    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
}