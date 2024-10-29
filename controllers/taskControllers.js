const { readTasksFromFile, writeTasksToFile } = require("../utils/fileHandler");
const { copyFileSync } = require('fs');
const path = require('path');
const { authenticateUser, authorizeUser } = require('../middlewares/authMiddleware');
const { logError, logEvent } = require('../utils/logger');
const { handleFormParsing } = require('../utils/formHandler');

exports.getTasks = (req, res) => {
    authenticateUser(req, res, () => {
        const tasks = readTasksFromFile();
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(tasks));
    });
};

exports.createTask = (req, res) => {
    authenticateUser(req, res, () => {
        handleFormParsing(req, res, (fields, image) => {
            const tasks = readTasksFromFile();

            const newTask = {
                id: Date.now(),
                title: fields.title,
                description: fields?.description || '',
                status: fields?.status || 'pending',
                priority: fields?.priority || 'normal',
                dueDate: fields?.dueDate || null,
                image: image ? `/uploads/${image.originalFilename}` : null,
            };

            tasks.push(newTask);

            writeTasksToFile(tasks);

            if (image) {
                copyFileSync(image.filepath, path.join(__dirname, '../uploads', image.originalFilename));
            }

            logEvent('Task created', newTask);

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(newTask));
        });
    });
};

exports.updateTask = (req, res) => {
    authenticateUser(req, res, () => {
        handleFormParsing(req, res, (fields, image) => {
            const tasks = readTasksFromFile();

            const taskId = parseInt(req.url.split('/').pop());
            const taskIndex = tasks.findIndex(task => task.id === taskId);

            if (taskIndex === -1) {
                res.writeHead(404, { 'content-type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Task not found'
                }));
                return;
            }

            const updatedTask = {
                ...tasks[taskIndex],
                title: fields.title || tasks[taskIndex].title,
                description: fields.description || tasks[taskIndex].description,
                status: fields.status || tasks[taskIndex].status,
                priority: fields.priority || tasks[taskIndex].priority,
                dueDate: fields.dueDate || tasks[taskIndex].dueDate,
                image: image ? `/uploads/${image.originalFilename}` : tasks[taskIndex].image,
            };

            tasks[taskIndex] = updatedTask;

            writeTasksToFile(tasks);

            if (image) {
                copyFileSync(image.filepath, path.join(__dirname, '../uploads', image.originalFilename));
            }

            logEvent('Task updated', updatedTask);

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(updatedTask));
        });
    });
};

exports.deleteTask = (req, res) => {
    authenticateUser(req, res, () => {
        const tasks = readTasksFromFile();
        const taskId = parseInt(req.url.split('/').pop());
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            res.writeHead(404, { 'content-type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Task not found'
            }));
            return;
        }

        const updatedTasks = tasks.filter(task => task.id !== taskId);
        writeTasksToFile(updatedTasks);

        logEvent('Task deleted', { id: taskId });

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Task successfully deleted'
        }));
    });
};
