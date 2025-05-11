
const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json());

//Cenexion to the database
const config = {
    user: 'sa',
    password: 'Robe2004',
    server: 'ROBERTYTOCERVAL\\SQLEXPRESS',
    database: 'cxtDB',
    options: {
        trustServerCertificate: true ,// Change to true for local dev / self-signed certs
    }

    

};

app.post('/buscarNino', async (req, res) => {
    const { correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('SELECT * FROM nino WHERE correo_electronico = @correo_electronico');

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Niño no encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar niño');
    }
});
app.post('/buscarNinoId', async (req, res) => {
    const { correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('SELECT id_nino FROM nino WHERE correo_electronico = @correo_electronico');

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // responde con { id_nino: ... }
        } else {
            res.status(404).send('Niño no encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar niño');
    }
});

app.put('/actualizarNino', async (req, res) => {
    const { nombre, apellido, edad, correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('edad', sql.Int, edad)
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('UPDATE nino SET nombre = @nombre, apellido = @apellido, edad = @edad WHERE correo_electronico = @correo_electronico');

        res.send('Niño actualizado correctamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar niño');
    }
});
app.post('/buscarTutor', async (req, res) => {
    const { correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('SELECT * FROM tutor WHERE correo_electronico = @correo_electronico');

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Tutor no encontrado');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al buscar tutor');
    }
});
app.put('/actualizarTutor', async (req, res) => {
    const { nombre, apellido, telefono, correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('telefono', sql.VarChar, telefono)
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('UPDATE tutor SET nombre = @nombre, apellido = @apellido, telefono = @telefono WHERE correo_electronico = @correo_electronico');

        res.send('Tutor actualizado correctamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar tutor');
    }
});

app.get('/consulta', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM tutor');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la consulta');
    }
});

// Ruta para agregar datos
app.post('/agregarTutor', async (req, res) => {
    const { correo_electronico, nombre, apellido, telefono, contrasena } = req.body;
    try {
        const pool = await sql.connect(config); 
        await pool.request()                    
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('telefono', sql.VarChar, telefono)
            .input('contrasena', sql.VarChar, contrasena)
            .query('INSERT INTO tutor (correo_electronico, nombre, apellido, telefono, contrasena) VALUES (@correo_electronico, @nombre, @apellido, @telefono, @contrasena)');

        res.send('Datos agregados correctamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar datos');
    }
});
app.post('/agregarNino', async (req, res) => {
    const {nombre, apellido, edad,id_discapacidad,correo_electronico} = req.body;
    try {
        const pool = await sql.connect(config); 
        await pool.request()                    
            .input('nombre', sql.VarChar, nombre)
            .input('apellido', sql.VarChar, apellido)
            .input('edad', sql.Int, edad)
            .input('id_discapacidad', sql.Int, id_discapacidad)
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('INSERT INTO nino (nombre, apellido, edad,id_discapacidad,correo_electronico) VALUES (@nombre, @apellido, @edad,@id_discapacidad,@correo_electronico)');

        res.send('Datos agregados correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar datos');
        
    }
});

app.post('/login', async (req, res) => {
    const { correo_electronico, contrasena } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .input('contrasena', sql.VarChar, contrasena)
            .query('SELECT * FROM tutor WHERE correo_electronico = @correo_electronico AND contrasena = @contrasena');

        if (result.recordset.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});
app.get('/frase', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM vista_frase_aleatoria');

        if (result.recordset.length > 0) {
            const frase = result.recordset[0];
            res.json({
                frase: frase.frase,
                autor: frase.autor
            });
        } else {
            res.status(404).send('No se encontró ninguna frase');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener la frase');
    }
});

app.post('/ultima-sesion', async (req, res) => {
    const { correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('SELECT * FROM vista_ultima WHERE correo_electronico = @correo_electronico');

        if (result.recordset.length > 0) {
            const sesion = result.recordset[0];
            res.json({
                nombre_juego: sesion.nombre_juego,
                fecha_de_sesion: sesion.fecha_de_sesion,
                puntos_por_juego: sesion.puntos_por_juego
            });
        } else {
            res.status(404).send('No se encontró sesión para ese correo');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener sesión');
    }
});
app.post('/progreso-home', async (req, res) => {
    const { correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('SELECT * FROM vista_progreso WHERE correo_electronico = @correo_electronico');

        if (result.recordset.length > 0) {
            const progreso = result.recordset[0];
            res.json({
                niveles_de_progreso: progreso.niveles_de_progreso,
            });
        } else {
            res.status(404).send('No se encontró progreso para ese correo');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener progreso');
    }
    
});
app.get('/juegos', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM juego');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la consulta de juegos');
    }
});
app.post('/nombre-nino', async (req, res) => {
    const { correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('SELECT * FROM nino WHERE correo_electronico = @correo_electronico');

        if (result.recordset.length > 0) {
            const nino = result.recordset[0];
            res.json({
                nombre: nino.nombre,
            });
        } else {
            res.status(404).send('No se encontró niño para ese correo');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener niño');
    }
});

app.post('/discapacidad', async (req, res) => {
    const { correo_electronico } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('SELECT * FROM nino WHERE correo_electronico = @correo_electronico');

        if (result.recordset.length > 0) {
            const nino = result.recordset[0];
            res.json({
                id_discapacidad: nino.id_discapacidad,
            });
        } else {
            res.status(404).send('NO se encontro el niño y su discapacidad');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener niño');
    }
});

app.post('/mejor-sesion', async (req, res) => {
    const { correo_electronico } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query(`
                SELECT TOP 1 id_nino, nivel_actual, puntos_por_juego, nombre_juego
                FROM vista_mejores_sesiones
                WHERE correo_electronico = @correo_electronico
                AND rank_puntos = 1
            `);

        if (result.recordset.length > 0) {
            const mejor = result.recordset[0];
            res.json({
                id_nino: mejor.id_nino,
                nivel_actual: mejor.nivel_actual,
                puntos_por_juego: mejor.puntos_por_juego,
                nombre_juego: mejor.nombre_juego
            });
        } else {
            res.status(404).send('No se encontró mejor sesión para ese correo');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener mejor sesión');
    }
});

app.post('/progreso-nino', async (req, res) => {
    const { id_nino } = req.body;
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id_nino', sql.Int, id_nino)
            .query(`
                SELECT niveles_de_progreso, fecha, puntos_totales 
                FROM progreso 
                WHERE id_nino = @id_nino
            `);

        if (result.recordset.length > 0) {
            const progreso = result.recordset[0];
            res.json({
                niveles_de_progreso: progreso.niveles_de_progreso,
                fecha: progreso.fecha,
                puntos_totales: progreso.puntos_totales
            });
        } else {
            res.status(404).send('No se encontró progreso para ese niño');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener progreso');
    }
});



//Juegos 

app.post('/insertarSesion', async (req, res) => {
    const { id_nino, id_juego, tiempo_en_actividad, nivel_actual, puntos_por_juego } = req.body;

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id_nino', sql.Int, id_nino)
            .input('id_juego', sql.Int, id_juego)
            .input('tiempo_en_actividad', sql.VarChar, tiempo_en_actividad)
            .input('nivel_actual', sql.VarChar, nivel_actual)
            .input('puntos_por_juego', sql.Int, puntos_por_juego)
            .query(`
                INSERT INTO sesion_de_juego (
                    id_nino,
                    id_juego,
                    fecha_de_sesion,
                    tiempo_en_actividad,
                    nivel_actual,
                    puntos_por_juego
                ) VALUES (
                    @id_nino,
                    @id_juego,
                    CAST(GETDATE() AS DATE),
                    @tiempo_en_actividad,
                    @nivel_actual,
                    @puntos_por_juego
                )
            `);

        res.send('Sesión registrada');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar sesión');
    }
});

app.post('/actualizarProgreso', async (req, res) => {
    const { id_nino, niveles_de_progreso, puntos_totales } = req.body;

    try {
        const pool = await sql.connect(config);

        // Verifica si ya existe un progreso para el niño
        const check = await pool.request()
            .input('id_nino', sql.Int, id_nino)
            .query('SELECT * FROM progreso WHERE id_nino = @id_nino');

        if (check.recordset.length > 0) {
            // Ya existe, haz UPDATE sumando
            await pool.request()
                .input('id_nino', sql.Int, id_nino)
                .input('niveles_de_progreso', sql.Int, niveles_de_progreso)
                .input('puntos_totales', sql.Int, puntos_totales)
                .query(`
                    UPDATE progreso
                    SET 
                        niveles_de_progreso = niveles_de_progreso + @niveles_de_progreso,
                        puntos_totales = puntos_totales + @puntos_totales,
                        fecha = CAST(GETDATE() AS DATE)
                    WHERE id_nino = @id_nino
                `);
            res.send('Progreso actualizado.');
        } else {
            // No existe, haz INSERT
            await pool.request()
                .input('id_nino', sql.Int, id_nino)
                .input('niveles_de_progreso', sql.Int, niveles_de_progreso)
                .input('puntos_totales', sql.Int, puntos_totales)
                .query(`
                    INSERT INTO progreso (id_nino, niveles_de_progreso, puntos_totales, fecha)
                    VALUES (@id_nino, @niveles_de_progreso, @puntos_totales, CAST(GETDATE() AS DATE))
                `);
            res.send('Progreso insertado.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar o insertar progreso');
    }
});


// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});