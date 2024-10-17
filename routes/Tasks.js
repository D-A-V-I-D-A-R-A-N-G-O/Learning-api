const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirdescription, '../data/tasks.json');

// Método para leer los usuarios del archivo Tasks.json
const getTasks = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Método para guardar usuarios en el Tasks.json
const saveTasks = (Tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(Tasks, null, 2));
};

// Ruta para consultar los usuarios
router.get('/', (req, res) => {
    const Tasks = getTasks();
    res.json(Tasks);
});

// Obtener usuario por su id
router.get('/:id', (req, res) => {
    const Tasks = getTasks();
    const task = Tasks.find(u => u.id === parseInt(req.params.id));
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: "pri, ese man no existe" });
    }
});

// Crear nuevos usuarios
router.post('/', (req, res) => {
    const Tasks = getTasks();
    const newTask = {
        id: Tasks.length ? Tasks[Tasks.length - 1].id + 1 : 1,
        taskTypeId: req.body.taskTypeId,
        taskLimit: req.body.taskLimit,
        description: req.body.description,
        taskSubject:  req.body.taskSubject,
        myDifficulty:  req.body.myDifficulty,
        totalDifficulty:   req.body.totalDifficulty
        
    }
    Tasks.push(newTask);
    saveTasks(Tasks);
    res.status(201).json(newTask);
});

//Actualizando o editando usuarios
router.put('/:id', (req, res)=>{
    const Tasks = getTasks()
    const TAnewTaskIndex = Tasks.findIndex(u => u.id === parseInt(req.params.id))

    if (TAnewTaskIndex !== -1) {
        Tasks[TAnewTaskIndex]={
            ...Tasks[TAnewTaskIndex],
        description: req.body.description || Tasks[TAnewTaskIndex].description,
        taskLimit: req.body.taskLimit || Tasks[TAnewTaskIndex].taskLimit,
        taskTypeId: req.body.taskTypeId || Tasks[TAnewTaskIndex].taskTypeId,
        taskSubject: req.body.taskSubject || Tasks[TAnewTaskIndex].taskSubject,
        myDifficulty: req.body.myDifficulty || Tasks[TAnewTaskIndex].myDifficulty,
        totalDifficulty: req.body.totalDifficulty || Tasks[TAnewTaskIndex].totalDifficulty
        }
        saveTasks(Tasks)
        res.json(Tasks[TAnewTaskIndex])
    } else {
        res.status(404).json({message: "hay chamo, esa tarea no existe"})
    }
})

//Eliminar o borrar una tarea por id
router.delete('/:id', (req, res)=>{
    const Tasks = getTasks()
    const newTasks = Tasks.filter(u => u.id !== parseInt(req.params.id))

    if (newTasks.length !== Tasks.length) {
        saveTasks(newTasks)
        res.json({message: "tarea eliminada exitosamente 👌 "})
    } else {
        res.status(404).json({message: "no chamo, no se púede eliminar"})
    }

})







// Exportamos el módulo
module.exports = router;