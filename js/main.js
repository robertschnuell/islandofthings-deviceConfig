var token;
var serverAddress;
var devicesData = [];



// ini
fetch('../config.json')
    .then(response => response.json())
        .then(data => {
            token = data.token;
            serverAddress = data.serverUrl;


            axios.get(serverAddress+"/devices", {
                headers: {
                'Authorization': `Bearer `+token
                }
            })
            .then((res) => {
                devicesData = res.data;
                generateDeviceList(devicesData)
                
                
                
            })
            .catch((error) => {
                console.error(error)
            })
        })
    .catch(error => console.log(error));








function generateDeviceList(data) {
    let devices = document.querySelector("#devices")
    devices.innerHTML = ""


    let caption = document.createElement("article");
    caption.classList.add("caption")
  
      let devadd = document.createElement("div")
      devadd.innerHTML = "DEV_ADD"
      caption.appendChild(devadd)
  
      let devname = document.createElement("div")
      devname.innerHTML = "NAME"
      caption.appendChild(devname)
  
      let devPayloadSize = document.createElement("div")
      devPayloadSize.innerHTML = "PAYLOADS"
      caption.appendChild(devPayloadSize)

      let devActive = document.createElement("div")
      devActive.innerHTML = "Activated"
      caption.appendChild(devActive)

      devices.appendChild(caption)


    data.forEach( ele => {
      let device = document.createElement("article");
      device.id = ele.DEV_ADD
  
      let devadd = document.createElement("div")
      devadd.innerHTML = ele.DEV_ADD
      device.appendChild(devadd)
  
      let devname = document.createElement("div")
      devname.innerHTML = ele.name
      device.appendChild(devname)
  
      let devPayloadSize = document.createElement("div")
      devPayloadSize.innerHTML = ele.payloadSize
      device.appendChild(devPayloadSize)

      let btnActive = document.createElement("input");
      btnActive.setAttribute("type", "checkbox");
      btnActive.checked = ele.active;
      btnActive.addEventListener('click', (event) => ((arg) => {
        activateDevice(arg)
    })({"DEV_ADD":ele.DEV_ADD,"active":ele.active}) );
      device.appendChild(btnActive)
  
      let btnEdit = document.createElement("BUTTON");
      btnEdit.innerHTML = "⚙️";
      device.appendChild(btnEdit)
  
      let btnDel = document.createElement("BUTTON");
      btnDel.innerHTML = "🗑️";
  
      btnDel.addEventListener('click', (event) => ((arg) => {
          deleteDevice(arg)
      })(ele.DEV_ADD));
  
      device.appendChild(btnDel)
  
      devices.appendChild(device)
    });
}

function activateDevice(deviceAddress) {
    console.log(deviceAddress)

    let statusPath ="";
    if(deviceAddress.active) {
        statusPath = "deactivate";
    } else {
        statusPath = "activate";
    }

    axios.patch(serverAddress+"/devices/"+deviceAddress.DEV_ADD+"/"+statusPath,{}, {
        headers: {
        'Authorization': `Bearer `+token
        }
    })
    .then((res) => {
        console.log("activated")
        //devicesData

        devicesData[(devicesData.findIndex( (device) => device.DEV_ADD === deviceAddress.DEV_ADD.toString()))].active = !deviceAddress.active;
        generateDeviceList(devicesData)
    })
    .catch((error) => {
        console.error(error)
      })

}

function deleteDevice(deviceAddress) {
    axios.delete(serverAddress+"/devices/"+deviceAddress+"/delete", {
        headers: {
        'Authorization': `Bearer `+token
        }
    })
    .then((res) => {
        devicesData.splice((devicesData.findIndex( (device) => device.DEV_ADD === deviceAddress.toString())), 1);
        generateDeviceList(devicesData)
    })
    .catch((error) => {
        console.error(error)
      })
}


function payloadInputHandler(event) {
    console.log(event.target.value)


    let new_payloads = document.querySelector("#new_payloads");

    const diff =  event.target.value - (new_payloads.childNodes.length-1);
    if(event.target.value >  (new_payloads.childNodes.length -1)) {
        for(let i = 0; i < diff; i++) {
            new_payloads.appendChild(generatePayloadEntry((new_payloads.childNodes.length -1)+i))
        }
    } else if (event.target.value <  (new_payloads.childNodes.length -1)) {
        for( let i = 0; i < diff*-1; i++) {
            new_payloads.removeChild(new_payloads.lastChild);
        }
    }

}

function generatePayloadEntry(id) {
    let entry = document.createElement("div");
    entry.id = "new_payloadEntry_"+id

    let new_payloadTypeContainer = document.createElement("div");
        let new_payloadTypeLabel = document.createElement("label")
        new_payloadTypeLabel.innerHTML = "Type"
        new_payloadTypeLabel.setAttribute("for", "new_payloadType");
        new_payloadTypeContainer.appendChild(new_payloadTypeLabel)

        let new_payloadType = document.createElement("select")
        new_payloadType.setAttribute("name", "new_payloadType_"+id);
        new_payloadType.setAttribute("id", "new_payloadType_"+id);

        const items = ["Byte (unsigned)","Integer  (unsigned)","Boolean","Ascii"]
        items.forEach( ele => {
            let option = document.createElement("option");
            option.setAttribute("value", ele);
            let text = document.createTextNode(ele);
            option.appendChild(text);

            new_payloadType.appendChild(option)
        });
        new_payloadTypeContainer.appendChild(new_payloadType);
    entry.appendChild(new_payloadTypeContainer)



    let new_payloadLengthContainer = document.createElement("div")
        let new_payloadLengthLabel = document.createElement("label")
        new_payloadLengthLabel.innerHTML = "Length"
        new_payloadLengthLabel.setAttribute("for", "new_payloadLength");
        new_payloadLengthContainer.appendChild(new_payloadLengthLabel)

        let new_payloadLength = document.createElement("input")
        new_payloadLength.setAttribute("type", "number");
        new_payloadLength.setAttribute("name", "new_payloadLength_"+id);
        new_payloadLength.setAttribute("id", "new_payloadLength_"+id);
        new_payloadLengthContainer.appendChild(new_payloadLength)

    entry.appendChild(new_payloadLengthContainer)



    let new_payloadStartByteContainer = document.createElement("div")
        let new_payloadStartByteLabel = document.createElement("label")
        new_payloadStartByteLabel.innerHTML = "Start Byte"
        new_payloadStartByteLabel.setAttribute("for", "new_payloadStartByte");
        new_payloadStartByteContainer.appendChild(new_payloadStartByteLabel)

        let new_payloadStartByte = document.createElement("input")
        new_payloadStartByte.setAttribute("type", "number");
        new_payloadStartByte.setAttribute("name", "new_payloadStartByte_"+id);
        new_payloadStartByte.setAttribute("id", "new_payloadStartByte_"+id);
        new_payloadStartByteContainer.appendChild(new_payloadStartByte)

    entry.appendChild(new_payloadStartByteContainer)


    let new_payloadNameContainer = document.createElement("div")
        let new_payloadNameLabel = document.createElement("label")
        new_payloadNameLabel.innerHTML = "Name"
        new_payloadNameLabel.setAttribute("for", "new_payloadName");
        new_payloadNameContainer.appendChild(new_payloadNameLabel)

        let new_payloadName = document.createElement("input")
        new_payloadName.setAttribute("type", "number");
        new_payloadName.setAttribute("name", "new_payloadName_"+id);
        new_payloadName.setAttribute("id", "new_payloadName_"+id);
        new_payloadNameContainer.appendChild(new_payloadName)

    entry.appendChild(new_payloadNameContainer)


    return entry;
}


document.querySelector("#newDeviceForm").onsubmit = function(event) {
    event.preventDefault();
    let data = {};
    data.longitude = document.querySelector("#new_lon").value;
    data.latitude = document.querySelector("#new_lat").value;
    data.DEV_ADD = document.querySelector("#new_devadd").value;
    data.DEV_EUI = document.querySelector("#new_deveui").value;
    data.APPSKEY = document.querySelector("#new_appskey").value;
    data.NETSKEY = document.querySelector("#new_netskey").value;
    data.name = document.querySelector("#new_name").value;
    data.payloadSize = document.querySelector("#new_payloadAmount").value;

    if(document.querySelector("#deviceActive").value === "on") {
        data.active = true;
    } else {
        data.active = false;
    }

    data.logLevel = document.querySelector("#new_loglevel").options[document.querySelector("#new_loglevel").selectedIndex].innerHTML;

    
    data.payloads=  getPayloads();



    createNewDevice(data)


    return false;
}

function getPayloads() {
    let payloads = [];

    let payloadsContainer = document.querySelector("#new_payloads").childNodes;

    if(payloadsContainer.length > 0) {
        for( let i = 1; i < payloadsContainer.length;i++){
            let ele = payloadsContainer[i];
            let payload = {};

            
            payload.type = ele.childNodes[0].childNodes[1].options[ele.childNodes[0].childNodes[1].selectedIndex].innerHTML;
            payload.startByte = ele.childNodes[1].childNodes[1].value;
            payload.len = ele.childNodes[2].childNodes[1].value;
            payload.name = ele.childNodes[3].childNodes[1].value;
            payloads.push(payload);

        }
    }


    return payloads;
}



function createNewDevice(data) {
    axios.post(serverAddress+"/devices/add",data, {
        headers: {
        'Authorization': `Bearer `+token
        }
    })
    .then((res) => {
        console.log("response: "+ res.data)
    })
    .catch((error) => {
        console.error(error)
      })
}