const router = require('express').Router();
const {
  createProject,
  readProjects,
  readProjectById,
  updateProjectById,
  deleteProject
} = require("../controllers/project.controller");

// Create new project
router.post("/create", createProject);

// Read all projects
router.get("/", readProjects);

// Read project by id
router.get("/:projectId", readProjectById);

// Update project by id
router.put("/update/:projectId", updateProjectById);

// Delete project
router.delete("/delete/:projectId", deleteProject);


module.exports = router;