var path = require('path');

//cargar el Modelo ORM
var Sequelize = require('sequelize');

//usar la BBDD SQLite
var sequelize = new Sequelize(null, null, null, {
	dialect:"sqlite",
	storage:"quiz.sqlite"
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
				pregunta:'¿Capital de Itaia?',
				respuesta:'Roma'
			}).success(function(){console.log('Base de datos inicializada')});
		};
	});
});