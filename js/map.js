var map ;
var roomList = [];



const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const accestoken = urlParams.get('access_token')

if(accestoken == null) {
    document.querySelector("#mapid").remove();

    let main = document.querySelector("main")
    main.innerHTML="please add accestoken";
}

var client = matrix_js.createClient({
    baseUrl: "https://dev.medienhaus.udk-berlin.de",
    accessToken:  accestoken,
    userId: "@robert:dev.medienhaus.udk-berlin.de"
});



client.getSpaceSummary("!LqfYILLVtBjTxqkRKm:dev.medienhaus.udk-berlin.de").then(function(result) { 


    if(result!= null) {
        if(result.rooms != null) {
            result.rooms.forEach(room => {
                if(room.room_type != null) {
                    if(room.room_type == "m.space" ) {
                        return;
                    } 
                } 
                let data = JSON.parse(room.topic);
              
   

                if(data.type == "image") {
                    roomList.push(new ImageDevice(room.room_id,room.name,data.lat,data.lng,data.type));
                } else if (data.type == "data") {
                    roomList.push(new PlotDevice(room.room_id,room.name,data.lat,data.lng,data.type));
                }
                
                
            });
        }
    }
    drawDevices();
});



function drawDevices() {
    console.log(roomList)


    roomList.forEach(device => {
       var customPopup = "";

        let circle = L.circle([device.lat, device.lng], {
            stroke: false,
            fillColor: 'white',
            fillOpacity: 1,
            radius: 5
        }).addTo(map);

        circle.bindPopup(customPopup,{
            "maxWidth": "400px",
            "maxHeight": "800px",
            "className": "custom"
            })

        device.popup = circle;
        
    })

    console.log("----")
    console.log(roomList)
    console.log("----")


    
}


class Device {
    constructor(roomId,name,lat, long, type) {
      this.roomId = roomId;
      this.name = name;
      this.lat = lat;
      this.lng = long;
      this.type = type;
    }

    set popup(popup) {
        this._popup = popup;
    }
    get popup() {
        return this._popup;
    };

  

    outputHtml() {
        return  "<div><h3>"+ this.name +"</h3>hello Image|" + this.type + "-" + this.roomId + "</div>";
    }

    applyPopupContent() {
        this._popup.setPopupContent(this.outputHtml());
    }
  }

class ImageDevice extends Device {
    constructor(roomId,name,lat, long, type) {
        super(roomId,name,lat, long, type);
        getInitialImageFromRoom("!KFqZIIxWodNXrdjMEO:dev.medienhaus.udk-berlin.de",5);
      }
    outputHtml() {
        return "<div>hello Image|" + this.type + "-" + this.roomId + "<img src='" +  this.imgUrl +  "'>" + "</div>"
    }

    set imgUrl(imgUrl) {
        this._imgUrl = imgUrl;
    }
    get imgUrl() {
        return this._imgUrl;
    };
    
}

class PlotDevice extends Device {
    outputHtml() {
        return "<div>hello Plot|" + this.type + "-" + this.roomId  + "</div>"
    }
    
}


function updateIt() {
    roomList.forEach (device => {
        //if(device)
        device.applyPopupContent();
    })
}



/*
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicmZ3cyIsImEiOiJja296dzhlN3EwZTBhMnBsZ2RhdjRnZDQ3In0.yezNIhffQMNKMKYrunML-g'
}).addTo(mymap);
*/








function ini() {

    let mapDiv = document.querySelector("#mapid");

    console.log(window.innerHeight)
    console.log(document.querySelector("nav").offsetHeight)

    let mapHeight = document.querySelector("nav").style.margin;
    console.log(mapHeight)

    mapDiv.style.height = (window.innerHeight-document.querySelector("nav").offsetHeight)+"px";
    mapDiv.style.height = "925px";


    map = L.map('mapid', {
        center: [52.564105, 13.234909],
        zoom: 17
    });
  

    var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    }).addTo(map);





}



 function getInitialImageFromRoom(roomId,limit) {
    console.log("big")

    let url = "https://dev.medienhaus.udk-berlin.de/_matrix/client/r0/rooms/";
    url += roomId;
    url += "/messages?dir=b&limit=";
    url += limit;

   return axios.get(url, 
        {headers: 
            {"Authorization": "Bearer "+accestoken}
        }
        ).then((res) => {
        if(res.status == 200) {
            //console.log(res.data);
            res.data.chunk.forEach(message => {
                if(message.type == "m.room.message") {
                    if(message.content.msgtype == "m.image") {
                        //console.log("bing")
                       // console.log(message.content.info.thumbnail_url)
                        //console.log(message.sender.split(':')[1])
                        let mxcSplit = message.content.info.thumbnail_url.split('/');
                       // console.log(mxcSplit[mxcSplit.length-1])
                        let imgUrl = mxcToPath(mxcSplit[mxcSplit.length-1],message.sender.split(':')[1]);
                        console.log(imgUrl);
                        doSomething(roomId, imgUrl)
                        return( "hello");
                        if(imgUrl != null) {
                            
                        }
                    }
                    
                }
            })
        }
    });
    
}


function doSomething (roomId,imgUrl) {
    console.log("ää");
    console.log(roomId + " " + imgUrl);
    console.log("ää");


    roomList.find((o, i) => {
        
        if (o.roomId == roomId) {
            o.imgUrl = imgUrl;
          
            //arr[i] = { name: 'new string', value: 'this', other: 'that' };
            return true; // stop searching
        }
    })
}


function mxcToPath(mxc, server) {

    ///_matrix/media/r0/download/{serverName}/{mediaId}
    //https://dev.medienhaus.udk-berlin.de/_matrix/media/r0/download/dev.medienhaus.udk-berlin.de/ciZYexkapqDGYuRMaCUbtJID

    return "https://dev.medienhaus.udk-berlin.de/" + "_matrix/media/r0/download/" + server + "/" + mxc;

}



function getLatestImageFromRoom(roomId) {


}



ini();

