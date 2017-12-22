module.exports = {
    addNewCard: (req, res, next) => {
        const dbInstance = req.app.get('db')
        console.log(req.body)


        dbInstance.addNewCard([req.body.projectID, req.body.card, 1])
            .then(response => {
                res.status(200).send(response)})

            .catch(console.log)

    },
    addNewTask: (req, res, next) => {
        const dbInstance = req.app.get('db')
        console.log(req.body)


        dbInstance.addNewTask([req.body.projectID, req.body.cardID, req.body.task])
            .then(response => {
                res.status(200).send(response)})

            .catch(console.log)

    },

    getAllCards: (req, res, next) => {
        const dbInstance = req.app.get('db')

        dbInstance.getAllCards([req.params.projectID])
            .then(response => {
                console.log(response)
                res.status(200).send(response)})
            .catch(console.log)
    },
    editTask: (req, res, next) => {
        const dbInstance = req.app.get('db')
 
 
        dbInstance.editTask([req.body.taskID, req.body.task])
            .then(response => {
                res.status(200).send(response.data)
            })
            .catch(console.log)
    },
    deleteTask: (req, res, next) => {
        const dbInstance = req.app.get('db')
 
 
        dbInstance.deleteTask([req.body.taskID])
            .then(response => {
                res.status(200).send(response.data)
            })
            .catch(console.log)
    },
}