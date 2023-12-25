const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

const upload = multer({ dest: 'static/' });
class CsvConverter {
    static decimalToBcd(number) {
        const base = 26;
        let result = '';

        do {
            const remainder = (number - 1) % base;
            result = String.fromCharCode(65 + remainder) + result;
            number = Math.floor((number - 1) / base);
        } while (number > 0);

        return result || 'A';
    }
}


app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
});

app.post('/result', upload.single('source_code'), (req, res) => {
    const sourceCodeFilePath = `static/${req.file.filename}`;
    const dbname = sourceCodeFilePath;
    const conn = new sqlite3.Database(dbname);

    conn.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
        const visualVoid = [];

        // Your existing logic for fetching data

        conn.close(() => {
            res.render('f', { tab: visualVoid, name: dbname }); // Render f.ejs
        });
    });
});

app.post('/csvresult', upload.single('source_code'), (req, res) => {
    const sourceCodeFilePath = `static/${req.file.filename}`;
        const zip = new AdmZip(sourceCodeFilePath);
    const zipEntries = zip.getEntries();
    var content = "";
    var format = "";
    zipEntries.forEach(entry => {
        if (entry.entryName == "table.csv") {
            content = entry.getData().toString("utf8")
            console.log(content);
        }
        if (entry.entryName == "format.jcss") {
            format = entry.getData().toString("utf8")
            console.log(format);
        }
    });

    const table = content.split('\n').map((row) => row.split(','));

    res.render('c', { table, file: { name: req.file.filename }, content : format, looper: CsvConverter.decimalToBcd, len: (x) => { return x.length } }); // Render c.ejs
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
