var sdk = apigClientFactory.newClient({});

function record(){
    console.log("record")
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new window.SpeechRecognition();
    console.log(recognition)
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        console.log("here");
        console.log(speechToText);
        document.getElementById('search-text').value = speechToText;
        search(); 
        }

    recognition.stop();

    console.log("here2");
    recognition.start();
}

function search(){
    document.getElementById("results").innerHTML = ""
    console.log("search")
    text = document.getElementById("search-text").value
    console.log(text)
    // sdk.searchGet({"q": text, "x-api-key": "6WdwZmOhdx9cFJh7LVdoY7PhyxI6qAjz39DbGfae"},{},{}).then(function(response) {
    sdk.searchGet({"q": text, "x-api-key": "6WdwZmOhdx9cFJh7LVdoY7PhyxI6qAjz39DbGfae"},{},{}).then(function(response) {
        
        images = response.data.body
        console.log(images)
        
        console.log(images["images"])

        if (images["images"].length == 0){
            var h3 = document.createElement('h3');
            h3.value = "No search results"
            document.getElementById("results").append(h3)
        }

        else {
            for (var i=0; i<images["images"].length; i++){
            	try{
	        		var img = document.createElement("img")
	                img.src = images["images"][i]
	                document.getElementById("results").append(img)
	                console.log("Inside try")
            	}
                catch{
                	console.log("caught")
                }
            }
        }
    }).catch(e => {console.log(e)});
}

// function binEncode(data) {
//     var binArray = []
//     var datEncode = "";

//     for (i=0; i < data.length; i++) {
//         binArray.push(data[i].charCodeAt(0).toString(2)); 
//     } 
//     for (j=0; j < binArray.length; j++) {
//         var pad = padding_left(binArray[j], '0', 8);
//         datEncode += pad + ' '; 
//     }
//     function padding_left(s, c, n) { if (! s || ! c || s.length >= n) {
//         return s;
//     }
//     var max = (n - s.length)/c.length;
//     for (var i = 0; i < max; i++) {
//         s = c + s; } return s;
//     }
//     console.log(binArray);
// }

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // reader.onload = () => resolve(reader.result)
      reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }

// function imgToBase64(img) {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     canvas.width = img.width;
//     canvas.height = img.height;
  
//     // I think this won't work inside the function from the console
//     //img.crossOrigin = 'anonymous';
  
//     ctx.drawImage(img, 0, 0);
  
//     return canvas.toDataURL();
//   }

function upload(){
    console.log("upload")
    var img = document.getElementsByName("img")[0].files[0]
    console.log(img)
    var tags = document.getElementById("tags").value
    var additionalParams = {}
    if (tags){
        tags = tags.split(" ").join(", ")
    }
    else{
        tags = ""
    }
    additionalParams = {'x-amz-meta-customLabels': tags}

    console.log(tags)
    console.log(additionalParams)
    console.log(img.name)
    console.log(img.type)
    console.log(typeof(img))
    
    // var reader = new FileReader();
    // // image = reader.readAsDataURL(img)
    // //image = getDataUrl(img)
    // // console.log(image.type)

    // // var i = new Image();
    // // i.src = img.name;

    // // image = imgToBase64(i)

    // image = reader.readAsBinaryString(img)

    // console.log(image)
    // type=img.type + ";base64"
    // console.log(type)

    // var params = {"file" : "binary.png", "Content-Type": type};
    // sdk.uploadPut(params, img, {}).then((response)=>{
    //     console.log(response);
    // });
    // var params = {"file" : "text.txt"};
    // sdk.uploadPut(params, "asbdhbs", {}).then((response)=>{
    //     console.log(response);
    // });
    //    var params = {"filename" : image.name, "bucket" : "bucket2photos", "content-type" : image.type};
    // sdk.uploadPut(params, image, {}).then((response)=>{
    //     console.log(response);
    // });

    var encoded_image = getBase64(img).then(
        data => {
        console.log(data)
   
        // var data = document.getElementById('file_path').value;
        // var x = data.split("\\")
        // var filename = x[x.length-1]
        var file_type = img.type + ";base64"
   
        var body = data;
        // var params = {"file" : img.name, "Content-Type" : img.type};
        // var additionalParams = {};
        // sdk.uploadPut(params, body, {}).then(function(res){
            var params = {"file" : img.name, "Content-Type" : "application/json", 'x-amz-meta-customLabels': tags};
            console.log(params)
            var additionalParams = {};
            sdk.uploadPut(params, body, {}).then(function(res){
        //   if (res.status == 200)
        //   {
        //     //document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
        //     //document.getElementById("uploadText").style.display = "block";
        //   }
        })
      });
}

document.getElementById("record").onclick = record;
document.getElementById("search-button").onclick = search;
document.getElementById("upload-button").onclick = upload;
