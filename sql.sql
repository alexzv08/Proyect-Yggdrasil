drop database prueba;
create database prueba;
use prueba;
create table rol(
id_rol int auto_increment,
  n_rol varchar(20),
  descripcion varchar(500),
  PRIMARY KEY (id_rol)
);
create table usuarios(
  usuario varchar(50) not null unique,
  password varchar(150) not null,
  email varchar(100) not null unique,
  fechaCreacion date,
  id_rol int,
  PRIMARY KEY (usuario),
  FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

ALTER TABLE usuarios
ADD COLUMN verificationToken VARCHAR(255),
ADD COLUMN isVerified BOOLEAN DEFAULT FALSE;

create table tienda(
  id_tienda int auto_increment,  
  id_usuario varchar(50) NOT NULL,               
  nombre_tienda VARCHAR(150) NOT NULL,  
  cif VARCHAR(50) NOT NULL UNIQUE,      
  direccion VARCHAR(550) NOT NULL,      
  telefono INT,                         
  web VARCHAR(150),                      
  PRIMARY KEY (id_tienda),                
  FOREIGN KEY (id_usuario) REFERENCES usuarios(usuario) ON DELETE CASCADE

);


CREATE TABLE juego (
    id_Juego VARCHAR(10) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    PRIMARY KEY (id_Juego)
);

CREATE TABLE coleccion (
    id_coleccion VARCHAR(10) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    id_Juego VARCHAR(10) NOT NULL,
    fecha_Salida DATE,
    PRIMARY KEY (id_coleccion),
    FOREIGN KEY (id_Juego) REFERENCES juego(id_Juego) ON DELETE CASCADE
);

CREATE TABLE cartas (
    id_carta VARCHAR(10),
    id_coleccion VARCHAR(10),
    id_juego VARCHAR(10),
    level INT,
    dp INT,
    name VARCHAR(100),
    type VARCHAR(20),
    color VARCHAR(20),
    stage VARCHAR(20),
    digi_type VARCHAR(50),
    attribute VARCHAR(20),
    play_cost INT,
    evolution_cost INT,
    cardrarity VARCHAR(20),
    artist VARCHAR(100),
    maineffect VARCHAR(1000),
    soureeffect VARCHAR(1000),
    set_name VARCHAR(100),
    image_url VARCHAR(500),
    -- Clave primaria compuesta por id_juego, id_coleccion y id_carta
    PRIMARY KEY (id_juego, id_coleccion, id_carta),
    -- Claves foráneas
    FOREIGN KEY (id_coleccion) REFERENCES coleccion(id_coleccion) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES coleccion(id_juego) ON DELETE CASCADE
);
ALTER TABLE cartas
ADD UNIQUE INDEX idx_cartas (id_carta, id_coleccion, id_Juego);


CREATE TABLE salas_chat (
    id_sala INT AUTO_INCREMENT,
    id_usuario1 VARCHAR(50),
    id_usuario2 VARCHAR(50),
    PRIMARY KEY (id_sala),
    FOREIGN KEY (id_usuario1) REFERENCES usuarios(usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario2) REFERENCES usuarios(usuario) ON DELETE CASCADE
);
CREATE TABLE mensajes (
    id_mensaje INT AUTO_INCREMENT,
    id_usuarioEnvia VARCHAR(50),
    -- id_usuarioRecibe VARCHAR(50),
    contenido TEXT,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    visto BOOLEAN DEFAULT FALSE,
    id_sala INT,
    PRIMARY KEY (id_mensaje),
    FOREIGN KEY (id_usuarioEnvia) REFERENCES usuarios(usuario),
    -- FOREIGN KEY (id_usuarioRecibe) REFERENCES usuarios(usuario),
    FOREIGN KEY (id_sala) REFERENCES salas_chat(id_sala)
);
create table post(
id_post int AUTO_INCREMENT,
  n_post varchar(50),
  id_usuarioCrea varchar(50),
  contenid text,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  categoria int,
  PRIMARY KEY (id_post),
  FOREIGN KEY (id_usuarioCrea) REFERENCES usuarios(usuario)
);
create table mensajePost(
id_mensajeP int AUTO_INCREMENT,
  id_usuarioMP varchar(50),
  id_post int,
  contenid text,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_mensajeP),
  FOREIGN KEY (id_usuarioMP) REFERENCES usuarios(usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_post) REFERENCES post(id_post) ON DELETE CASCADE
);

CREATE TABLE usuarioColeccion (
  id_Usuariocoleccion INT AUTO_INCREMENT,
  id_carta VARCHAR(10) NOT NULL,
  id_coleccion VARCHAR(10),
  id_Juego VARCHAR(10),
  cantidad INT,
  id_usuario VARCHAR(50),
  PRIMARY KEY (id_Usuariocoleccion),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_Juego) REFERENCES cartas(id_Juego) ON DELETE CASCADE,
  FOREIGN KEY (id_coleccion) REFERENCES cartas(id_coleccion) ON DELETE CASCADE,
  FOREIGN KEY (id_carta) REFERENCES cartas(id_carta)  ON DELETE CASCADE
);
ALTER TABLE usuarioColeccion
DROP FOREIGN KEY usuarioColeccion_ibfk_3; -- Elimina la restricción de clave foránea existente

ALTER TABLE usuarioColeccion
MODIFY COLUMN id_coleccion VARCHAR(10); -- Modifica el tipo de datos de la columna id_coleccion si es necesario

ALTER TABLE usuarioColeccion
ADD CONSTRAINT fk_id_coleccion
FOREIGN KEY (id_coleccion) REFERENCES coleccion(id_coleccion); -- Agrega una nueva restricción de clave foránea

CREATE TABLE mazos (
    id_mazo INT AUTO_INCREMENT,
    id_usuario VARCHAR(50),
    nombre_mazo VARCHAR(50),
    fecha DATETIME  DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_mazo),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(usuario) ON DELETE CASCADE
);

-- Crear la tabla `mazo_cartas` con las claves externas y `ON DELETE CASCADE`
CREATE TABLE mazo_cartas (
    id_mazo INT,
    id_juego VARCHAR(10),
    id_coleccion VARCHAR(10),
    id_carta VARCHAR(10),
    cantidad INT,
    PRIMARY KEY (id_mazo, id_carta),
    FOREIGN KEY (id_mazo) REFERENCES mazos(id_mazo) ON DELETE CASCADE,
    FOREIGN KEY (id_carta) REFERENCES cartas(id_carta) ON DELETE CASCADE,
    FOREIGN KEY (id_coleccion) REFERENCES cartas(id_coleccion) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES cartas(id_juego) ON DELETE CASCADE
);

-- Agregar una restricción única en la tabla `mazo_cartas`
ALTER TABLE mazo_cartas
ADD CONSTRAINT unique_mazo_carta UNIQUE (id_mazo, id_carta);


CREATE TABLE amistades (
    Usuario_ID_1 varchar(50),
    Usuario_ID_2 varchar(50),
    FOREIGN KEY (Usuario_ID_1) REFERENCES usuarios(usuario),
    FOREIGN KEY (Usuario_ID_2) REFERENCES usuarios(usuario),
    PRIMARY KEY (Usuario_ID_1, Usuario_ID_2)
);

CREATE TABLE eventos (
  id_evento INT AUTO_INCREMENT PRIMARY KEY,
  id_tienda INT NOT NULL,
  fecha_inicio DATETIME,
  participantes_max INT,
  participantes_actuales INT,
  FOREIGN KEY (id_tienda) REFERENCES tienda(id_tienda) ON DELETE CASCADE
);
ALTER TABLE eventos
ADD hora_inicio TIME;

CREATE TABLE eventosDetalle (
    id_evento_usuario int AUTO_INCREMENT,
    id_evento int ,
    id_usuario varchar(50),
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(usuario),
    PRIMARY KEY (id_evento_usuario)
);
-- INSERTS
insert into rol(n_rol,descripcion) values ("Usuario","Usuario");
insert into rol(n_rol,descripcion) values ("Tienda","Tienda");

insert into juego(id_Juego,nombre) values ("DG","Digimon");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT1","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT2","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT3","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT4","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT5","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT6","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT7","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT8","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT9","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT10","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT11","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT12","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT13","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT14","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT15","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT16","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT17","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("BT18","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("EX1","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("EX2","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("EX3","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("EX4","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("EX5","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("EX6","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("EX7","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("EX8","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("RB1","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("RB2","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("RB3","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("LM","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("P","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST1","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST2","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST3","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST4","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST5","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST6","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST7","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST8","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST9","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST10","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST11","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST12","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST13","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST14","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST15","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST16","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST17","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST18","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST19","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST20","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST21","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST22","","DG");
insert into coleccion(id_coleccion,nombre,id_Juego) values ("ST23","","DG");