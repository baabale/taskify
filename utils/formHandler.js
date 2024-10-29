const formidable = require('formidable');

exports.handleFormParsing = (req, res, callback) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ message: 'Form parsing error', error: err.message }));
            return;
        }

        const image = files.image ? files.image : null;

        if (!fields.title) {
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ message: 'Title is required' }));
            return;
        }

        callback(fields, image);
    });
};
