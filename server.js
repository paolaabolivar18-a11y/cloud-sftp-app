const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de almacenamiento local de archivos
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Servir archivos estáticos desde la misma raíz (__dirname)
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));
app.use(express.json());

// API Endpoints
app.post('/api/files/upload', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha seleccionado ningún archivo.' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
        message: 'Archivo subido y almacenado de forma segura via SFTP.',
        file: {
            name: req.file.originalname,
            filename: req.file.filename,
            url: fileUrl
        }
    });
});

app.get('/api/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Error al listar archivos.' });
        const fileList = files.map(file => ({
            name: file,
            url: `${req.protocol}://${req.get('host')}/uploads/${file}`
        }));
        res.json(fileList);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Cloud SFTP activo en el puerto ${PORT}`);
});