const fs = require('fs');
const path = require('path');

const filePath = './data/tasks.json';

exports.writeTasksToFile = (tasks) => {
    if (Array.isArray(tasks) && tasks.length === 0) {
        fs.writeFileSync(filePath, '[]');
    } else {
        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    }
}

exports.readTasksFromFile = () => {
    if(!fs.existsSync(filePath)) {
        this.writeTasksToFile([])
    }

    const data = fs.readFileSync(filePath);
    return JSON.parse(data)
}
