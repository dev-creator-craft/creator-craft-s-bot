const Discord = require('discord.js');
const Bot = new Discord.Client();
var fs=require("fs");

var prefix = "*";
const ytdl = require('ytdl-core');
const queue = new Map();
var server;

Bot.on('ready', function(){
    console.log("is ready in "+Bot.guilds.size+" servers");
    Bot.user.setGame("@creator-craft");
});

function play(connection, message) {
  server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
  server.dispatcher.on("end",function(){connection.disconnect();});
}

Bot.on('message', Message => {
    
    if(Message.content==="quit")
            Bot.user.setStatus("invisible");
    else if(Message.content==="join")
        Bot.user.setStatus("online")
    /*else if(Message.content===".quit" & Message.member.voiceChannel)
        Message.member.voiceChannel.get("Général").leave();*/
    
    if(Message.author.id!="473531759909142531"){

        var args = Message.content.substring(prefix.length).split(" ");
  switch (args[0].toLowerCase()) {
    case "play":

      if (!args[1]) {
        Message.channel.sendMessage("Tu dois m’indiquer un lien YouTube"); 
        return;
      }

      if(!Message.member.voiceChannel) {
        Message.channel.sendMessage(":x: Tu dois être dans un salon vocal"); 
        return;
      }

    server={queue: []};

    server.queue.push(args[1]);
    if(!Message.guild.voiceConnection) Message.member.voiceChannel.join().then(function(connection) {
    play(connection, Message)
    });

  break;

  case "stop":
    if(!Message.member.voiceChannel) 
    return Message.channel.send(":x: Tu dois être dans un salon vocal");
    Message.member.voiceChannel.leave();
  break;
  
  }


        reponse=getAnswerFor(Message)
        if(reponse.length>0)
            Message.channel.send(reponse);
        

        /*if(Message.content==="salut" | Message.content==="bonjour")
            Message.channel.send("salut "+Message.author+" dans "+Message.channel.name);*/
        
        let message=Message.content.split(` `)
        if(message[0]=="émojis"){
            if(message.length==1){
                Message.delete();
                Message.channel.send(":"+getElement("./emojis.src",Math.round(Math.random()*67))+":");
            }else{
                Message.delete();
                Message.channel.send(":"+getElement("./emojis.src",message[1])+":");
            }
        }
    }

});

function getElement(File,v){
    let s = fs.readFileSync(File,"utf8");
    actuelO=0;
    objects={};
    objects[0]="";

    for(i=0;i<s.length;i++)
        if(s[i]==":")
            if(s[i]==":"){
                actuelO++;
                 i++;
                objects[actuelO]="";
            }else
                objects[actuelO]=objects[actuelO]+s[i];
        else
            objects[actuelO]=objects[actuelO]+s[i];
    
    if(objects[v]==undefined)
        return "ERROR 0 Element "+v+" doen't exist in "+File;
    else
        return objects[v];
}

function normalize(reponse,message){
    let rep=reponse.split(" ");
    r="";
    for(i=0;i<rep.length;i++){
        if(rep[i]=="author")
            rep[i]=message.author;
        r=r+rep[i]+" ";
    }
    return r;
}

function getAnswerFor(message){
    let s = fs.readFileSync("./questions.src","utf8").split("::");
    for(i=0;i<s.length;i++)
        if(s[i]==message)
            return normalize(s[i+1],message);
    return "";
}



let questions = require('questions.json')
Bot.on('message',message => {
    
    if (questions[message.content.toLowerCase()])
        message.channel.send(questions[message.content.toLowerCase()]);
});


Bot.login(process.env.BOT_TOKEN);
