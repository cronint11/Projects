const express = require('express');
const app = express();
const fs = require('fs');

const port = 8080;

var notes = [];

app.listen(port,function(){
    console.log(`listening to port ${port}`);
});

app.get('/notes', function(request,response){
    fs.readFile('./public/notes.html','utf8',(err, data)=>{
        if (err)
            throw err;
        response.writeHead(200, { "Content-Type": "text/html" });
        data = loadNotes(data);
        response.end(data);
    });
});

app.get('*', function(request,response){
    fs.readFile('./public/index.html','utf8',(err, data)=>{
        if (err)
            response.end(err);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(data);
    });
});

const loadNotes = function (html) {
    
    if(notes.length == 0)
    {
        try {
            let data = fs.readFileSync(`./db/db.json`, 'utf8');
               
            notes=JSON.parse(data);
               
        } catch (err) {
            console.log(err);
            return html.replace(`plac3ho1d3R`,``);
        }
    }

    let htmlToAdd='';
    notes.forEach(note => {
        htmlToAdd += `<b>${note.title}</b><li>${note.text}</li>`;
    });
    
    return html.replace(`plac3ho1d3R`,htmlToAdd);
};