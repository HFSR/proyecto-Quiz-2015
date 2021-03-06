var path = require('path');

//postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var BD_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//cargar el Modelo ORM
var Sequelize = require('sequelize');

//usar BBDD SQLite ó Postgres
var sequelize = new Sequelize(BD_name, user, pwd, {
	dialect: dialect,
	protocol: protocol,
	port: port,
	host: host,
	storage:storage,  // solo SQLite (.env)
	omitNull: true
});

//impportar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz=Quiz; //exportar la definicion de la tabla quiz

//sequelize.sync() crea e inicializa la tabla de preguntas en la bd
sequelize.sync().success(function(){
	//success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){
		if(count === 0){//la tabla se inicializa solo si está vacia
			Quiz.create({
				pregunta:'Estrella más cercana al sol?',
				respuesta:'Próxima Centauri',
				tema:'Ciencia'
			}).success(function(){console.log('Base de datos inicializada')});

			Quiz.create({
				pregunta:'Estrella más brillante del firmamento?',
				respuesta:'Sirio',
				tema:'Ciencia'
			}).success(function(){console.log('Base de datos inicializada')});
		};
	});
});