exports.commands = [
	"create",
	"voice",
	"delete",
	"servers",
	"topic",
    //"purge" //WIP
];

exports.create = {
	usage: "<channel name>",
	description: "creates a new text channel with the given name.",
	process: function(bot,msg,suffix) {
		msg.channel.guild.createChannel(suffix,"text").then(function(channel) {
			msg.channel.sendMessage("created " + channel);
		}).catch(function(error){
			msg.channel.sendMessage("failed to create channel: " + error);
		});
	}
}

exports.purge = {
    usage: "<empty, #, @user, or @user #>",
    description: "purge messages, can be left blank for all messages, or can specify a number, @user, or both @user number",
    process: function(bot,msg,arg){
        var args = arg.split(" ");
        var user;
        try{
            user = msg.mentions.users.first().toString().replace(/<|@|>/g,'');
            //console.log("User: "+user);
            //user = user.replace(/<|@|>/g,'');
            //console.log('typeof: '+typeof user);
            
        }catch(err){
            //console.log(err);
        }
        //console.log('***USER: '+user+' ***');
        //console.log('Args: '+args[0]+' '+args[1]+' '+args[2]);
        var amnt;
        if(typeof user == 'undefined' || typeof user != 'string'){
            amnt = args[0];
        }else{
            amnt = args[1];
        }
        //var dayLimit = 1210000000; //14 days in milliseconds
        if(typeof amnt == 'undefined'){
        msg.channel.fetchMessages()
        .then((message) => {
              if(typeof user != 'undefined'){
              const filterby = user ? user.id : bot.user.id; messages = message.filter(m => m.author.id == filterby).array(); }
              console.log('Messages after Filter: '+messages.length);
              if(messages.length >= 50){
              for(var i = 50; i < messages.length > 2; i = messages.length-50){
              msg.channel.bulkDelete(messages).catch((err) => { console.error(err); });
              messages.splice(0,i);
              }
              }
              for(let obj of messages){ obj.delete().catch(err =>console.error(err)); } }).catch(console.error);
        }else{
            msg.channel.fetchMessages({limit: amnt})
            .then((message) => {
                  if(typeof user != 'undefined'){
                  const filterby = user ? user.id : bot.user.id; messages = message.filter(m => m.author.id == filterby).array(); }
                  if(messages.length >= 50){
                  for(var i = 50; i < messages.length > 2; i = messages.length-50){
                  msg.channel.bulkDelete(messages).catch((err) => { console.error(err); });
                  messages.splice(0,i);
                  }
                  }
                  for(let obj of messages){
                  obj.delete().catch(err => console.log(err));
                  }
                  }).catch(console.error);
        }
    }
}

exports.servers = {
description: "Tells you what servers the bot is in",
process: function(bot,msg) {
	msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`, {split: true});
}
},



exports.voice = {
	usage: "<channel name>",
	description: "creates a new voice channel with the give name.",
	process: function(bot,msg,suffix) {
		msg.channel.guild.createChannel(suffix,"voice").then(function(channel) {
			msg.channel.sendMessage("created " + channel.id);
			console.log("created " + channel);
		}).catch(function(error){
			msg.channel.sendMessage("failed to create channel: " + error);
		});
	}
},
exports["delete"] = {
	usage: "<channel name>",
	description: "deletes the specified channel",
	process: function(bot,msg,suffix) {
		var channel = bot.channels.get(suffix);
		if(suffix.startsWith('<#')){
			channel = bot.channels.get(suffix.substr(2,suffix.length-3));
		}
		if(!channel){
			var channels = msg.channel.guild.channels.findAll("name",suffix);
			if(channels.length > 1){
				var response = "Multiple channels match, please use id:";
				for(var i=0;i<channels.length;i++){
					response += channels[i] + ": " + channels[i].id;
				}
				msg.channel.sendMessage(response);
				return;
			}else if(channels.length == 1){
				channel = channels[0];
			} else {
				msg.channel.sendMessage( "Couldn't find channel " + suffix + " to delete!");
				return;
			}
		}
		msg.channel.guild.defaultChannel.sendMessage("deleting channel " + suffix + " at " +msg.author + "'s request");
		if(msg.channel.guild.defaultChannel != msg.channel){
			msg.channel.sendMessage("deleting " + channel);
		}
		channel.delete().then(function(channel){
			console.log("deleted " + suffix + " at " + msg.author + "'s request");
		}).catch(function(error){
			msg.channel.sendMessage("couldn't delete channel: " + error);
		});
	}
}

exports.topic = {
	usage: "[topic]",
	description: 'Sets the topic for the channel. No topic removes the topic.',
	process: function(bot,msg,suffix) {
		msg.channel.setTopic(suffix);
	}
}
