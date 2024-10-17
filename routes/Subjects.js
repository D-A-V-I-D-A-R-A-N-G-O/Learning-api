const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '../data/Subjects.json');

// Método para leer los usuarios del archivo Subjects.json
const getSubjects = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Método para guardar usuarios en el Subjects.json
const saveSubjects = (Subjects) => {
    fs.writeFileSync(filePath, JSON.stringify(Subjects, null, 2));
};

 // Ruta para consultar los usuarios
 router.get('/', (req, res) => {
     const Subjects = getSubjects();
     res.json(Subjects);
});

// Obtener usuario por su id
router.get('/:id', (req, res) => {
    const Subjects = getSubjects();
    const subject = Subjects.find(u => u.id === parseInt(req.params.id));
    if (subject) {
        res.json(subject);
    } else {
        res.status(404).json({ message: "Ese usuario no existe parcero, pailas" });
    }
});

// Crear nuevos usuarios
router.post('/', (req, res) => {
    const Subjects = getSubjects();
    const newsubject = {
        id: Subjects.length ? Subjects[Subjects.length - 1].id + 1 : 1,
        name: req.body.name,
        difficulty: req.body.difficulty,
    };
    Subjects.push(newsubject);
    saveSubjects(Subjects);
    res.status(201).json(newsubject);
});

//Actualizando o editando usuarios
router.put('/:id', (req, res)=>{
    const Subjects = getSubjects()
    const subjectIndex = Subjects.findIndex(u => u.id === parseInt(req.params.id))

    if (subjectIndex !== -1) {
        Subjects[subjectIndex]={
            ...Subjects[subjectIndex],
        name: req.body.name || Subjects[subjectIndex].name,
        difficulty: req.body.difficulty || Subjects[subjectIndex].difficulty
        }
        saveSubjects(Subjects)
        res.json(Subjects[subjectIndex])
    } else {
        res.status(404).json({message: "Huy, manito ese usuario no existe pa"})
    }
})

//Eliminar o borrar un usuario por id
router.delete('/:id', (req, res)=>{
    const Subjects = getSubjects()
    const newSubjects = Subjects.filter(u => u.id !== parseInt(req.params.id))

    if (newSubjects.length !== Subjects.length) {
        saveSubjects(newSubjects)
        res.json({message: "usuario eliminado satisfactoriamente "})
    } else {
        res.status(404).json({message: "Imposible eliminarlo manito ese usuario no existe pa"})
    }

})







// Exportamos el módulo
module.exports = router;