const express = require('express');
const Projects = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an internal server error.', err })
        })
})

router.get('/:id', (req, res) => {
    const {id} = req.params;
    Projects.get(id)
        .then(project => {
            if(!project) {
                res.status(404).json({message: `The project with id#${id} could not be found.`})
            } else {
                res.status(200).json(project);
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an internal server error.', err })
        })
})

router.post('/', (req, res) => {
    const newProject = req.body;
    if(!newProject.name || !newProject.description) {
        res.status(400).json({message: 'You must specify a name and a description.'})
    }
    newProject.completed ? newProject.completed : false;
    console.log(newProject);
    Projects.insert(newProject)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            res.status(500).json({ message: 'We were unable to create your post.', err })
        })
})

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    Projects.remove(id)
        .then(deleted => {
            res.status(204).json(deleted);
        })
        .catch(err => {
            res.status(500).json({ message: 'We were unable to delete your post.', err })
        })
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    const {id} = req.params;
    if(!changes.name && !changes.description && !changes.completed) {
        res.status(400).json({message: 'You must specify a name, a description, or mark this project completed.'})
    } else {
        Projects.update(id, changes)
            .then(updated => {
                if(updated === null) {
                    res.status(404).json({message: `A project with the id#${id} was not found.`})
                } else {
                    res.status(200).json(updated);
                }
            })
            .catch(err => {
                res.status(500).json({ message: 'We were unable to update the post.', err })
            })
    }
})

module.exports = router;