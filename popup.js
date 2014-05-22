var clicker = document.getElementById("id_add");
var container = document.getElementById("id_container");
var refersher = document.getElementById("id_refresh")
var links = [{}];

var clearContainer = function(){
	/*
	очистка контейнера
	*/
	if (typeof container !== "undefined"){
		while (container.firstChild){
			container.removeChild(container.firstChild);
		}
	}
}

function clearLinks(){
	links = [{}];
	localStorage["links"] = JSON.stringify(links);
}

function refreshId(){
	/*
		обновить id
	*/
	for (var i=0;i<container.childElementCount; ++i){
		container.children[i].id = "elemid_"+i;
	}
}

function push_one(i){
	/*
		вывести один элемент
	*/
	var href = links[i]["link"];
	var title= links[i]["title"];
	var percent = links[i]["percent"]
	if (percent === undefined)
		percent = 0;
	if (href !== undefined && 
		title!== undefined){
			
		var newdiv = document.createElement("div");
		var newa = document.createElement("a");
		var newbtn = document.createElement("img");
		var newa_container = document.createElement("div");

		newa.href = href;
		newa.innerText = title;
		newa.onclick = function(){window.open(newa.href);}
		
		newa_container.className = "a_container";

		newbtn.src = "images/delete_button.png";
		newbtn.className = "delete_button";
		newbtn.onclick = function(){
			/*
				удаление из списка по нажатию кнопки
			*/
			var parent = this.parentElement;
			//var pos = Number.parseInt(parent.id.split("_")[1]);
			var pos = parseInt(parent.id.split("_")[1]);
			
			links.splice(pos, 1);
			localStorage["links"] = JSON.stringify(links);			
		
			parent.parentElement.removeChild(parent);
			refreshId();
		};

		newa_container.appendChild(newa);
		newdiv.appendChild(newbtn);
		newdiv.appendChild(newa_container);
		newdiv.id = "elemid_"+i;
		newdiv.className = "row";
		container.appendChild(newdiv);
	}else{
		links.splice(i,1);
		localStorage["links"] = JSON.stringify(links);			
				
		refreshId();			
	}
}

var push_all = function (){
	/*
		Отрисовка всех элементов в контейнере
	*/
	if (typeof container !== "undefined" &&
		typeof localStorage["links"] !== "undefined"){
	
		clearContainer();

		for (var i=0;i<links.length; ++i){
			push_one(i);
		}
	}
}

function loadData(){
	/*
		загрузка данных из локального хранилища
	*/
	if (localStorage["links"] !== undefined && 
		localStorage["links"].length > 0
		){	
		links = JSON.parse(localStorage["links"]); 
	}
}

function init(){
	/*
		Вызывается при инициализации приложения. 
		1) загрузка данных
		2) Отрисовка данных
	*/
	loadData();
	push_all();
}

clicker.onclick = function(){
	chrome.tabs.getSelected(null, function(tab){
		var tabId = tab.id;
		var tabUrl= tab.url;
		var tabTitle = tab.title;

		links.push({"link": tabUrl, "title": tabTitle});
		localStorage["links"] = JSON.stringify(links);
	
		push_one(links.length-1);
	});
}

refersher.onclick = function(){
	clearContainer();
	clearLinks();
	push_all();
}

init();