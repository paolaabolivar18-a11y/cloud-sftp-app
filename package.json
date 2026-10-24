const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Crear carpeta uploads si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento local (Simulación SFTP)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Servir archivos estáticos del cliente y la carpeta de descargas
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para subir archivo
app.post('/api/files/upload', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se subió ningún archivo.' });
    }
    res.json({ 
        message: '¡Archivo subido exitosamente al servidor (SFTP)!',
        file: req.file 
    });
});

// API para listar archivos guardados
app.get('/api/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer archivos.' });
        }
        const fileList = files.map(file => ({
            name: file,
            url: `/uploads/${file}`
        }));
        res.json(fileList);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Cloud SFTP activo en el puerto ${PORT}`);
});
