var visitedLinks = new Map(); // 4 div


const banSoruce = '' // link to BAN IMAGE

function ReplaceSource_from_VK(href,predict){
	// replace image if predicted class != 1
	if (predict[0] != 1 ){
	let tag = visitedLinks.get(href) // get tag
	tag.style = 'background-image: url()' // paste BAN url
	}
} 

function ReplaceSource_from_site(source,predict){
	// replace image if predicted class != 1
	if (predict[0] != 1 ){
	let tag = visitedLinks.get(href) // get tag
	tag.src = 'background-image: url()' // paste BAN url
	}
} 
  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { // Listen from background.js
	if (message && message.action === 'image_proceed'){
		if(message.payload.origin  === 'VK'){ // if image fom VK
		ReplaceSource_from_VK(message.payload.href, message.payload.predict)
		}else if (message.payload.origin  === "Other_site"){
			ReplaceSource_from_site(message.payload.href, message.payload.predict) // if image from other site
		}
	}
	
}

// message listener from background.js





window.addEventListener('load', () =>{
	if(window.locDomain === 'vk.com'){ // 4 VK
		let divs = Array.from(document.getElementsByClassName("page_post_sized_thumbs")); // find all div tags with posts
		let links = divs.map(div => div.firstElementChild)
		//links = divs.map(div => div.firstElementChild.onclick.toString().match(/https.+?\.jpg.+?=album/)).filter((link)=>{return link != null}) // find all links to post image
		links.forEach(async (link) =>{
			let match = link.onclick.toString().match(/https.+?\.jpg.+?=album/); // scrap the href
			if(match){
				if (!visitedLinks.has(match[0])){ // if this link didn't proceed ever	
					const message = {
					  action: "link_found",
					  payload: {
						data: match[0],
						origin: "VK"
					  }
					}
					chrome.runtime.sendMessage(message); // send to background.js
					visitedLinks.set(match[0], link); // add this link to visited, 4 we don't pass this again
					}
				}
			}			
		}else{ // other sites
		imgs = Array.from(document.getElementsByTagName("img"));
		imgs.forEach(async (img)=>{
			if(!visitedLinks.has(img.src){
				const message = {
						action: "link_found",
						payload: {
							data: img.src,
							origin: "Other_site"
						}
					}
				chrome.runtime.sendMessage(message);	// send to background.js	
				visitedLinks.set(img.src, img); // add this link to visited, 4 we don't pass this again
				}
			}
		}
});
