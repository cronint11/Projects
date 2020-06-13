const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

var notes = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', function (request, response) {
    // fs.readFile('./public/notes.html','utf8',(err, data)=>{
    //     if (err)
    //         throw err;
    //     response.writeHead(200, { "Content-Type": "text/html" });
    //     data = loadNotes(data);
    //     response.end(data);
    // });

    response.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', function (request, response) {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            notes = JSON.parse(data);
            response.json(notes);
        }
    });
});

app.post('/api/notes', function (request, response) {
    if(!request.body.title) {
        return response.status(400).json({ msg: 'Title required.' });
    }
    if(!request.body.text){
        return response.status(400).json({ msg: 'Note required.' });
    }

    const newNote = {
        id: Date.now(),
        title: request.body.title,
        text: request.body.text
    };

    notes.push(newNote);
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
        if (err) {
            response.json(err);
        } else {
            response.json(newNote);
        }

    });
});

app.delete('/api/notes/:id', function (request, response) {
    notes.splice(notes.findIndex(note => note.id === request.params.id), 1);
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
        if (err) {
            response.json(err);
        } else {
            response.json(notes);
        }
    })
});

app.get('/*', function (request, response) {
    // fs.readFile('./public/index.html','utf8',(err, data)=>{
    //     if (err)
    //         response.end(err);
    //     response.writeHead(200, { "Content-Type": "text/html" });
    //     response.end(data);
    // });

    response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, function () {
    console.log(`listening to port ${port}`);
});