const express = require('express');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an internal server error.', err })
        })
})

router.get('/:id', (req, res) => {
    const {id} = req.params;
    Actions.get(id)
        .then(action => {
            if(!action) {
                res.status(404).json({message: `The action with id#${id} could not be found.`})
            } else {
                res.status(200).json(action);
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an internal server error.', err })
        })
})

router.post('/', (req, res) => {
    const newAction = req.body;
    if(!newAction.description || !newAction.project_id || !newAction.notes) {
        res.status(400).json({message: 'You must specify a description, project_id, and notes.'})
    }
    newAction.completed ? newAction.completed : false;
    Actions.insert(newAction)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(err => {
            res.status(500).json({ message: 'We were unable to create your action.', err })
        })
})

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    Actions.remove(id)
        .then(deleted => {
            res.status(204).json(deleted);
        })
        .catch(err => {
            res.status(500).json({ message: 'We were unable to delete your action.', err })
        })
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    const {id} = req.params;
    if(!changes.name && !changes.description && !changes.completed) {
        res.status(400).json({message: 'You must specify a name, a description, or mark this action completed.'})
    } else {
        Actions.update(id, changes)
            .then(updated => {
                if(updated === null) {
                    res.status(404).json({message: `An action with the id#${id} was not found.`})
                } else {
                    res.status(200).json(updated);
                }
            })
            .catch(err => {
                res.status(500).json({ message: 'We were unable to update the action.', err })
            })
    }
})

module.exports = router;