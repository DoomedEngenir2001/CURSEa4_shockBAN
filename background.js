// post ti server
import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';


const modelURL = ""; // link to modelURL
const shape = [224,224,3];

function loadImg(url){ // loading the image
	img = document.createElement('img');
	img.src = url;
	return loadImg;
}


class Classfier{
	constructor(){
		this.model = await tf.loadGraphModel(modelURL);
	}
	
	async predict(img){ // argument - <img>
		const img = tf.fromPixels(img);
		const resized  = tf.image.resizeBilinear(img, shape); 
		const reshaped = resized.reshape([1, 224, 224, 3]);
		return this.model.predict(input).argMax(1).array();
		
	}
	
	
}

model = new Classfier();


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { // listener on nessage ImageFound
	if (message && message.action === "link_found" ){
		let img = loadImg(message.data); // convert to <img>
		let predict = await model.predict();
		predict = predict[0];
		let tab_id = sender.tab.id; // from which tab
		let href = message.payload.data; // hash to itendifier proceed action
		let origin = message.payload.origin;
		let predict = model.predict(payload.data); // prediction
		chrome.tabs.sendMessage(tab_id, { // сообщение сontent с предиктом и хэшкодом
          action: 'image_proceed',
          payload: {
            predict: predict,
            href: href,
			origin: origin
          },
        });
	}
	
	
}