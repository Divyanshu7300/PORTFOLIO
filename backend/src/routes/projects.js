import express from "express";
import Project from "../models/Project.js";
import fallbackProjects from "../data/fallbackProjects.js";
import { getDbStatus } from "../lib/db.js";

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    if (!getDbStatus()) {
      return res.status(200).json(fallbackProjects);
    }

    const projects = await Project.find();
    res.status(200).json(projects.length ? projects : fallbackProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(200).json(fallbackProjects);
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

    if (!getDbStatus()) {
      return res.status(202).json({
        msg: "Database unavailable right now. Fallback mode active, project not persisted.",
      });
    }

    const newProject = new Project({
      title,
      description,
      imageUrl,
      projectUrl,
      technologies,
    });

    await newProject.save();
    res.status(201).json({ msg: "Project saved successfully", project: newProject });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

export default router;
