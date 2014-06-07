var scrollTop = 0;

chrome.runtime.sendMessage({command: "scroll", url: document.URL}, 
	function(response) {
		document.body.scrollTop = document.body.scrollHeight /100 * response.message;
		alert("autosave [" + response.message+"%]");
	}
);	

document.onscroll = function(){ 
	scrollTop=document.body.scrollTop;

	chrome.runtime.sendMessage({command: "update", url: document.URL, scroll_top: scrollTop, scroll_height: document.body.scrollHeight}, 
		function(response) {
		
		}
	);
}

document.onclose  = function(){ 
	scrollTop=document.body.scrollTop;

	chrome.runtime.sendMessage({command: "update", url: document.URL, scroll_top: scrollTop, scroll_height: document.body.scrollHeight}, 
		function(response) {
		
		}
	);
}

//document.body.addEventListener("scroll", function(e){ alert(); }, false);