const request = require('supertest');
const http = require('http');
const taskRoutes = require('../routes/taskRoutes');
const { writeTasksToFile } = require('../utils/fileHandler');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    taskRoutes(req, res);
});

describe('Task Routes', () => {
    beforeEach(() => {
        writeTasksToFile([]);
    });

    it('should return 200 and tasks for GET /tasks', async () => {
        const response = await request(server).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should return 200 and create a task for POST /tasks', async () => {
        const newTask = {
            title: 'New Task',
            description: 'Task description',
            status: 'pending'
        };

        const response = await request(server)
            .post('/tasks')
            .field('title', newTask.title)
            .field('description', newTask.description)
            .field('status', newTask.status)
            .attach('image', path.join(__dirname, 'test_image.png'));

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(newTask.title);
        expect(response.body.description).toBe(newTask.description);
        expect(response.body.status).toBe(newTask.status);

        if (response.body.image) {
            expect(fs.existsSync(path.join(__dirname, '../uploads', path.basename(response.body.image)))).toBe(true);
        }
    });

    it('should return 200 and update a task for PATCH /tasks/:id', async () => {
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
            .field('status', updatedTask.status)
            .attach('image', path.join(__dirname, 'test_image.png'));

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
        expect(response.body.description).toBe(updatedTask.description);
        expect(response.body.status).toBe(updatedTask.status);

        if (response.body.image) {
            expect(fs.existsSync(path.join(__dirname, '../uploads', path.basename(response.body.image)))).toBe(true);
        }
    });

    it('should return 200 and delete a task for DELETE /tasks/:id', async () => {
        const tasks = [
            { id: 1, title: 'Task 1', description: 'Description 1', status: 'pending', image: null }
        ];
        writeTasksToFile(tasks);

        const response = await request(server).delete('/tasks/1');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task successfully deleted');
    });

    it('should return 404 for unknown methods', async () => {
        const response = await request(server).put('/tasks');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Unknown Method required.');
    });
});
