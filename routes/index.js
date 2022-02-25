const router = require("express").Router();
const projectRouter = require('./project.routes');
const taskRouter = require('./task.routes');
const authRouter = require('./auth.routes');
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/project", projectRouter);
router.use("/task", taskRouter);
router.use('/auth', authRouter);

module.exports = router;