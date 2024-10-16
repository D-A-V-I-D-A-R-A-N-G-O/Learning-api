const express = require('express')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/Users.js')
const tasksRoutes = require('./routes/Tasks.js')
const subjectRoutes = require('./routes/Subjects.js')

const myApp = express()
const myPort = 8080

myApp.use(bodyParser.json())
//ruta para usuarios
myApp.use('/API/users', userRoutes)
myApp.use('/API/tasks', tasksRoutes)
myApp.use('/API/subjects', subjectRoutes)
//manejo de error si no existe la ruta
myApp.use((req, res)=>{
    res.status(404).json({message: "Ruta no encontrada ❌"})
})
//informar el puerto de ejecucion de app
myApp.listen(myPort, ()=>{
    console.log("App ejecutando en el puerto 8080")
})