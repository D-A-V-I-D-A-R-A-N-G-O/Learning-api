const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '../data/tasks.json');

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
        name: req.body.name,
        email: req.body.email,
        tasks: req.body.tasks
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
        name: req.body.name || Tasks[TAnewTaskIndex].name,
        email: req.body.email || Tasks[TAnewTaskIndex].email
        }
        saveTasks(Tasks)
        res.json(Tasks[TAnewTaskIndex])
    } else {
        res.status(404).json({message: "hay chamo, ese man no existe"})
    }
})

//Eliminar o borrar un usuario por id
router.delete('/:id', (req, res)=>{
    const Tasks = getTasks()
    const newTasks = Tasks.filter(u => u.id !== parseInt(req.params.id))

    if (newTasks.length !== Tasks.length) {
        saveTasks(newTasks)
        res.json({message: "sujeto eliminado exitosamente 👌 "})
    } else {
        res.status(404).json({message: "no chamo, no lo puede eliminar"})
    }

})







// Exportamos el módulo
module.exports = router;