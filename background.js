/*chrome.tabs.onUpdated.addListener(function(tabId, tabInfo){
	chrome.tabs.get(tabId, function(tab){ alert(tab.url); });
});*/

var current_percent = 0;
var current_url = "";
var links = [{}];

function loadData(){
	/*
		загрузка данных из локального хранилища
	*/
	if (localStorage["links"] !== undefined && 
		localStorage["links"].length > 0
		){	
		links = JSON.parse(chrome.extension.getBackgroundPage().localStorage["links"]); 
	}
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if (request.command === "update"){
			
			// обновление данных о текущей странице (скролл и url)
			current_percent = request.scroll_top / request.scroll_height * 100;
			current_url     = request.url;

			//alert("top: " + request.scroll_top + "height: "+ request.scroll_height + "url:" + current_url);

			loadData();

			for (var i=0; i<links.length; ++i){
				if (current_url === links[i]["link"]){
					links[i]["percent"] = current_percent;
					localStorage["links"] = JSON.stringify(links);
					//alert("OK !!!" + " \npercent: " + current_percent);
				}
			}	
		} else if (request.command === "scroll"){

			// обновление данных о текущей странице (url)
			current_url     = request.url;

			loadData();

			for (var i=0;i<links.length; ++i){
				if (links[i]["link"] === current_url){
					current_percent = (links[i]["percent"]  === undefined ? 0 : links[i]["percent"]);
					sendResponse({message: current_percent});
					break;
				}
			}
		} else if (request.command === "save_link"){// сохранение ссыли
			
			//обновление данных (url)
			current_url = request.url;

			for (var i=0;i<links.length; ++i){
				if (links[i]["links"] === current_url){
					return;
				}
			}

			links.push({"link": current_url, "title": request.title, "percent":current_percent});
			localStorage["links"] = JSON.stringify(links);
		}
	}
);