var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(function(quiz){
		if(quiz){
			req.quiz=quiz;
			next();
		}else{
			next(new Error('No existe quizId='+quizId));
		}
	}).catch(function(error){next(error);});
};

//get /quizes/:id
exports.show = function (req, res){
	res.render('quizes/show',{quiz: req.quiz});
};

//get /quizes/:id/answer
exports.answer = function (req, res){
	var resultado='Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado});
};

//get /quiz
exports.index = function(req, res){
	var aux = req.query.search;
	if(aux){
		aux = aux.replace(/^/,'%');
		aux = aux.replace(/$/,'%');
		aux = aux.replace(/\s/g,'%');
		console.log('se envio: '+aux);
		models.Quiz.findAll({where:["pregunta like ?",aux]}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes});
		})
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes});
		})
	}
};