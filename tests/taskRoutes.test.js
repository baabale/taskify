const request = require('supertest');
const http = require('http');
const taskRoutes = require('../routes/taskRoutes');

const server = http.createServer((req, res) => {
    taskRoutes(req, res);
});

describe('Task Routes', () => {
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
            .field('status', newTask.status);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(newTask.title);
        expect(response.body.description).toBe(newTask.description);
        expect(response.body.status).toBe(newTask.status);
    });

    it('should return 200 and update a task for PATCH /tasks', async () => {
        const response = await request(server).patch('/tasks');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Not yet implemented');
    });

    it('should return 200 and delete a task for DELETE /tasks', async () => {
        const response = await request(server).delete('/tasks');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Not yet implemented');
    });
});
