const { writeTasksToFile, readTasksFromFile } = require('../utils/fileHandler');
const fs = require('fs');

jest.mock('fs');

describe('fileHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('writeTasksToFile', () => {
    it('should write tasks to file', () => {
      const tasks = [{ id: 1, title: 'Task 1' }];
      writeTasksToFile(tasks);
      expect(fs.writeFileSync).toHaveBeenCalledWith('./data/tasks.json', JSON.stringify(tasks, null, 2));
    });

    it('should write an empty array to file when given an empty array', () => {
      const tasks = [];
      writeTasksToFile(tasks);
      expect(fs.writeFileSync).toHaveBeenCalledWith('./data/tasks.json', '[]');
    });
  });

  describe('readTasksFromFile', () => {
    it('should read tasks from file', () => {
      const tasks = [{ id: 1, title: 'Task 1' }];
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(tasks));
      const result = readTasksFromFile();
      expect(result).toEqual(tasks);
    });

    it('should create file if it does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      fs.readFileSync.mockReturnValue('[]');
      const result = readTasksFromFile();
      expect(fs.writeFileSync).toHaveBeenCalledWith('./data/tasks.json', '[]');
      expect(result).toEqual([]);
    });

    it('should return an empty array when the file is empty', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('[]');
      const result = readTasksFromFile();
      expect(result).toEqual([]);
    });
  });
});
