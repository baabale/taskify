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
        it('should return a not yet implemented message', async () => {
            const response = await request(server).patch('/tasks/1');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Not yet implemented');
        });
    });

    describe('deleteTask', () => {
        it('should return a not yet implemented message', async () => {
            const response = await request(server).delete('/tasks/1');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Not yet implemented');
        });
    });
});
