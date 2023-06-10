const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const server = app.listen(8080, () => console.log('Testing on PORT 8080'));
const Todo = require('../models/todos');
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  mongoServer.stop();
  server.close();
});

afterAll((done) => done());

describe('Test the Todo endpoints', () => {
  test('It should create a new todo item', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ title: 'Go to the grocery store', description: 'Buy cheese, popcorn, and bread' });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toEqual('Go to the grocery store');
    expect(response.body.description).toEqual('Buy cheese, popcorn, and bread');
    expect(response.body.completed).toBeFalsy();
    expect(response.body.created_at).toBeDefined();
  });

  test('It should get all todo items', async () => {
    await Todo.create({ title: 'Task 1', description: 'Task 1 description' });
    await Todo.create({ title: 'Task 2', description: 'Task 2 description' });

    const response = await request(app)
      .get('/todos');

      console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
  });

  test('It should get a specific todo item', async () => {
    const todo = await Todo.create({ title: 'Task', description: 'Task description' });

    const response = await request(app)
      .get(`/todos/${todo._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toEqual('Task');
    expect(response.body.description).toEqual('Task description');
  });

  test('It should update a specific todo item', async () => {
    const todo = await Todo.create({ title: 'Task', description: 'Task description' });

    const response = await request(app)
      .put(`/todos/${todo._id}`)
      .send({ title: 'Updated Task', description: 'Updated task description' });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toEqual('Updated Task');
    expect(response.body.description).toEqual('Updated task description');
  });

  test('It should delete a specific todo item', async () => {
    const todo = await Todo.create({ title: 'Task', description: 'Task description' });

    const response = await request(app)
      .delete(`/todos/${todo._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Todo deleted');
  });
});