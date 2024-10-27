const request = require('supertest');
const http = require('http');
const taskRoutes = require('../routes/taskRoutes');
const { readTasksFromFile, writeTasksToFile } = require('../utils/fileHandler');

const server = http.createServer((req, res) => {
    taskRoutes(req, res);
});

describe('Task Controllers', () => {
    beforeEach(() => {
        writeTasksToFile([]);
    });

    describe('getTasks', () => {
        it('should return an empty array when there are no tasks', async () => {
            const response = await request(server).get('/tasks');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return tasks when they exist', async () => {
            const tasks = [
                { id: 1, title: 'Task 1', description: 'Description 1', status: 'pending', image: null },
                { id: 2, title: 'Task 2', description: 'Description 2', status: 'completed', image: null }
            ];
            writeTasksToFile(tasks);

            const response = await request(server).get('/tasks');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(tasks);
        });
    });

    describe('createTask', () => {
        it('should create a new task', async () => {
            const newTask = {
                title: 'New Task',
                description: 'New Description',
                status: 'pending'
            };

            const response = await request(server)
                .post('/tasks')
                .field('title', newTask.title)
                .field('description', newTask.description)
                .field('status', newTask.status);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(newTask.title);
            expect(response.body.description).toBe(newTask.description);
            expect(response.body.status).toBe(newTask.status);
        });
    });

    describe('updateTask', () => {
        it('should update an existing task', async () => {
            const tasks = [
                { id: 1, title: 'Task 1', description: 'Description 1', status: 'pending', image: null }
            ];
            writeTasksToFile(tasks);

            const updatedTask = {
                title: 'Updated Task',
                description: 'Updated Description',
                status: 'completed'
            };

            const response = await request(server)
                .patch('/tasks/1')
                .field('title', updatedTask.title)
                .field('description', updatedTask.description)
                .field('status', updatedTask.status);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedTask.title);
            expect(response.body.description).toBe(updatedTask.description);
            expect(response.body.status).toBe(updatedTask.status);
        });

        it('should return 404 if task is not found', async () => {
            const response = await request(server).patch('/tasks/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Task not found');
        });
    });

    describe('deleteTask', () => {
        it('should delete an existing task', async () => {
            const tasks = [
                { id: 1, title: 'Task 1', description: 'Description 1', status: 'pending', image: null }
            ];
            writeTasksToFile(tasks);

            const response = await request(server).delete('/tasks/1');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Task successfully deleted');
        });

        it('should return 404 if task is not found', async () => {
            const response = await request(server).delete('/tasks/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Task not found');
        });
    });
});
