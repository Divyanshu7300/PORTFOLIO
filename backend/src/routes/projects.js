import express from "express";
import Project from "../models/Project.js"; // Make sure this path is correct

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// POST a new project
router.post("/", async (req, res) => {
  try {
    const { title, description, imageUrl, projectUrl, technologies } = req.body;

    // Validation
    if (!title || !description || !imageUrl || !projectUrl || !technologies) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    const newProject = new Project({
      title,
      description,
      imageUrl,
      projectUrl,
      technologies
    });

    await newProject.save();
    res.status(201).json({ msg: "Project saved successfully", project: newProject });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

export default router;
