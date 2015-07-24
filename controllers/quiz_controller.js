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
	res.render('quizes/show',{quiz: req.quiz, errors: []});
};

//get /quizes/:id/answer
exports.answer = function (req, res){
	var resultado='Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado, errors: []});
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
			res.render('quizes/index.ejs',{quizes: quizes, errors: []});
		})
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes: quizes, errors: []});
		})
	}
};

//get /quizes/new
exports.new = function(req, res){
							//crea el objeto quiz
	var quiz = models.Quiz.build({pregunta:"",respuesta:""});
	res.render('quizes/new', {quiz:quiz, errors: []});
};

//post /quiz/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/new', {quiz:quiz, errors: err.errors});
			}else{
				//guarda en la BD los campos respuesta y pregunta de quiz
				quiz
				.save({fields:["pregunta", "respuesta"]})
				.then(function(){res.redirect('/quizes');})//redirección HTTP (URL relativo) a lista de preguntas
			}
		}
	);	
};

//get  /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz; //autoload de instancia de quiz

	res.render('quizes/edit', {quiz:quiz, errors: []});
};

//put /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else{
				//guarda en la BD los campos respuesta y pregunta de quiz
				req.quiz
				.save({fields:["pregunta", "respuesta"]})
				.then(function(){res.redirect('/quizes');})//redirección HTTP (URL relativo) a lista de preguntas
			}
		}
	);
};