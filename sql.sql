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
create table juego(
id_Juego varchar(10) unique not null,
  nombre varchar(150) unique not null,
  PRIMARY KEY (id_Juego)
);
create table coleccion(
id_coleccion varchar(10) unique not null,
  nombre varchar(150) unique not null,
  id_Juego varchar(10),
  fecha_Salida date,
  PRIMARY KEY (id_Juego),
  FOREIGN KEY (id_Juego) REFERENCES juego(id_Juego)
);
create table cartas(
  id_carta varchar(10) not null,
  id_coleccion varchar(10),
  id_Juego varchar(10),
  nombre varchar(100),
  nivel int,
  dp int,
  efecto varchar(1000),
  tipo varchar(20),
  img varchar(500),
  PRIMARY KEY (id_carta),
  FOREIGN KEY (id_coleccion) REFERENCES coleccion(id_coleccion),
  FOREIGN KEY (id_Juego) REFERENCES coleccion(id_Juego)
);
CREATE TABLE salas_chat (
    id_sala INT AUTO_INCREMENT,
    id_usuario1 VARCHAR(50),
    id_usuario2 VARCHAR(50),
    PRIMARY KEY (id_sala),
    FOREIGN KEY (id_usuario1) REFERENCES usuarios(usuario),
    FOREIGN KEY (id_usuario2) REFERENCES usuarios(usuario)
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
  FOREIGN KEY (id_usuarioMP) REFERENCES usuarios(usuario),
  FOREIGN KEY (id_post) REFERENCES post(id_post)
);

create table usuarioColeccion(
  id_Usuariocoleccion int AUTO_INCREMENT,
  id_carta varchar(10) not null,
  id_coleccion varchar(10),
  id_Juego varchar(10),
  cantidad int,
  id_usuario varchar(50),
  PRIMARY KEY (id_Usuariocoleccion),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(usuario),
  FOREIGN KEY (id_Juego) REFERENCES cartas(id_Juego),
  FOREIGN KEY (id_coleccion) REFERENCES cartas(id_coleccion),
  FOREIGN KEY (id_carta) REFERENCES cartas(id_carta)
);
CREATE TABLE mazos (
    id_mazo INT AUTO_INCREMENT,
    id_usuario VARCHAR(50),
    nombre_mazo VARCHAR(50),
    PRIMARY KEY (id_mazo),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(usuario)
);
CREATE TABLE mazo_cartas (
    id_mazo INT,
    id_juego VARCHAR(10),
    id_coleccion VARCHAR(10),
    id_carta VARCHAR(10),
    cantidad INT,
    PRIMARY KEY (id_mazo, id_carta),
    FOREIGN KEY (id_mazo) REFERENCES mazos(id_mazo),
    FOREIGN KEY (id_carta) REFERENCES cartas(id_carta),
    FOREIGN KEY (id_coleccion) REFERENCES cartas(id_coleccion),
    FOREIGN KEY (id_juego) REFERENCES cartas(id_juego)
);
CREATE TABLE Amistades (
    Usuario_ID_1 varchar(50),
    Usuario_ID_2 varchar(50),
    FOREIGN KEY (Usuario_ID_1) REFERENCES usuarios(usuario),
    FOREIGN KEY (Usuario_ID_2) REFERENCES usuarios(usuario),
    PRIMARY KEY (Usuario_ID_1, Usuario_ID_2)
);