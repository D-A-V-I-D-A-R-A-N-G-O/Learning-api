const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, "../data/tareas.json");
// Método para leer las tareas del archivo task.json
const getTasks = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Método para guardar tareas en task.json
const saveTasks = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Ruta para consultar todas las tareas
router.get('/', (req, res) => {
    const tasks = getTasks();
    res.json(tasks);
});

// Obtener tarea por su id
router.get('/:id', (req, res) => {
    const tasks = getTasks();
    const task = tasks.find(u => u.id === parseInt(req.params.id));
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: "Esa tarea no existe" });
    }
});

// Crear nueva tarea
router.post('/', (req, res) => {
    const tasks = getTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        taskTypeId: req.body.taskTypeId,
        taskLimit: req.body.taskLimit,
        description: req.body.description,
        taskSubject: req.body.taskSubject,
        myDifficulty: req.body.myDifficulty,
        totalDifficulty: req.body.totalDifficulty
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});

// Actualizar o editar una tarea
router.put('/:id', (req, res) => {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            description: req.body.description || tasks[taskIndex].description,
            taskLimit: req.body.taskLimit || tasks[taskIndex].taskLimit,
            taskTypeId: req.body.taskTypeId || tasks[taskIndex].taskTypeId,
            taskSubject: req.body.taskSubject || tasks[taskIndex].taskSubject,
            myDifficulty: req.body.myDifficulty || tasks[taskIndex].myDifficulty,
            totalDifficulty: req.body.totalDifficulty || tasks[taskIndex].totalDifficulty
        };
        saveTasks(tasks);
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: "Esa tarea no existe" });
    }
});

// Eliminar una tarea por id
router.delete('/:id', (req, res) => {
    const tasks = getTasks();
    const newTasks = tasks.filter(t => t.id !== parseInt(req.params.id));

    if (newTasks.length !== tasks.length) {
        saveTasks(newTasks);
        res.json({ message: "Tarea eliminada exitosamente 👌" });
    } else {
        res.status(404).json({ message: "No se puede eliminar, la tarea no existe" });
    }
});

// Exportamos el módulo
module.exports = router;
