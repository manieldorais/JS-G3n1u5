const url_save = "https://us-central1-prova-front-letras.cloudfunctions.net/save";
const url_get= "https://us-central1-prova-front-letras.cloudfunctions.net/ranking";
var quantidade = 1;
var randos = [];
var atual =0;
var clique_atual=0;
var meu_score=0;
function startGame(){
	//randos = [];
	atual=0;
	clique_atual=0;
	$('#td-score').html(meu_score);
	localStorage.setItem('gen_score', meu_score);
	for (var iq = randos.length; iq < quantidade; iq++) {
		randos.push(Math.floor((Math.random() * 9) + 1));
	}
	mostraEles();
}
function mostraEles(){
	var temp_num = randos[atual];
	var numeros = document.getElementsByName('row-number');
	for (var i = 0; i < numeros.length; i++) {
		var num = numeros[i];
		num.className='';
	}
	setTimeout(function(){
		for (var i = 0; i < numeros.length; i++) {
			var num = numeros[i];
			if(Number(num.innerText)==temp_num){
				num.className="ativo";
			}
		}
		if(atual<randos.length){
			atual++;
			setTimeout(function(){
				mostraEles();
			},300);
		}
	},80);
}
function clique(elemento){
	var valor = Number(elemento.innerText);
	if(valor==randos[clique_atual]){
		if(clique_atual==randos.length-1){
			meu_score++;
			$('#td-score').html(meu_score);
			setTimeout(function(){
				quantidade++;
				startGame();
			},700);
		}
		else{
			clique_atual++;
		}
	}
	else{
		location.href="fim_do_jogo.html";
	}
}
function SalvarRanking(){
	var nome = $('#input-name').val();
	if(!nome){
		location.href="ranking.html";
	}
	else{
		var formData = new FormData();
		formData.append('name',nome);
		formData.append('score',localStorage.getItem('gen_score'));
		$.ajax({
			type: 'POST',
			url: url_save,
			data: formData,
			processData: false,
			contentType: false
		}).done(function (data) {
			location.href="ranking.html";
		})
		.fail(function(){
			location.href="ranking.html";
		});
	}
}
function getRanking(){
	$.ajax({
		type: 'POST',
		url: url_get,
		processData: true,
		contentType: false
	}).done(function (retorno) {
		retorno.sort(sortArray("score"));
		var table_ranking='';
		for (var i = 0; i < retorno.length; i++) {
			var dados = retorno[i];
			table_ranking+='<tr class="'+((i<3)?'top-3':'')+'">'+
			'<td>'+(i+1)+'</td>'+
			'<td>'+dados.name+'</td>'+
			'<td class="to-right">'+dados.score+'</td>'+
			+'</tr>';
		}
		$("#body-ranking").html(table_ranking);
	})
	.fail(function(){

	});
}
function sortArray(property) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
		return result * sortOrder;
	}
}