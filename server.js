
var net = require("net")

var telnetServer = net.createServer()
var ActiveUserList = []
var DisconnectedUserList = []
telnetServer.on('connection',function(client){
	client.name = client.remoteAddress+":"+client.remotePort;
	ActiveUserList.push(client)
	broadcast(client.name+" has joined the conversation\r\n")
	client.on('data',function(data){
		broadcast(message,client)
	})
})

function broadcast(message,client){
	var i; 
	for(var i=0;i<ActiveUserList.length;i++){
		if (client !== ActiveUserList[i]){
			if (ActiveUserList[i].writeable){
				ActiveUserList[i].write(client.name+":"+message);
			}
			else{
				DisconnectedUserList.push(ActiveUserList[i]);
				ActiveUserList[i].destroy();
				broadcast(ActiveUserList[i].name+" has left the conversation\r\n")
			}
		}
	}

	for (var j=0;j<DisconnectedUserList.length;j++){
		ActiveUserList.splice(ActiveUserList.indexOf(DisconnectedUserList[j]), 1);
	}
}

telnetServer.listen(23);