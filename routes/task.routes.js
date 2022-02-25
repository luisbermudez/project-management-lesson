const router = require('express').Router();
const {
  createTask,
  readTaskById,
  updateTaskById,
  deleteTask
} = require("../controllers/task.controller");

// Create new task
router.post("/create", createTask);

// Read task by id
router.get("/:taskId", readTaskById);

// Update task by id
router.put("/update/:taskId", updateTaskById);

// Remove task by id
router.delete("/delete/:taskId", deleteTask);

module.exports = router;