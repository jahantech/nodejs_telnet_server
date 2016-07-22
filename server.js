
var net = require("net")


var util = require('util');


var telnetServer = net.createServer()
var ActiveUserList = []
var DisconnectedUserList = []

telnetServer.on('connection',function(client){
	client.name = client.remoteAddress+":"+client.remotePort;
	ActiveUserList.push(client)
	broadcast(client.name+" has joined the conversation\r\n",client)
	client.on('data',function(data){
		broadcast(data,client);
	})
})

function broadcast(message,client){
	var i; 
	for(var i=0;i<ActiveUserList.length;i++){
		console.log(ActiveUserList[i].name);
		if (client !== ActiveUserList[i]){
			console.log(util.inspect(ActiveUserList[i], false, null));
			if (ActiveUserList[i].writable === true){
				console.log("I am here");
				ActiveUserList[i].write(client.name+":"+message);
			}
			else{
				console.log("Can't write to socket");
				DisconnectedUserList.push(ActiveUserList[i]);
				ActiveUserList[i].destroy();
			}
		}
	}

	for (var j=0;j<DisconnectedUserList.length;j++){
		ActiveUserList.splice(ActiveUserList.indexOf(DisconnectedUserList[j]), 1);
	}
}

telnetServer.listen(9000);
