'use strict';

const socket = io();
let player = {};

socket.on('connect', () => {
    console.log(socket.id);  

function gameStart(){
    socket.emit('game-start', { nickname: $("#nickname").val() });
    $("#start-screen").hide();
    $("#lobby-screen").show();
    $("#scoreBoard").hide();
}
$("#start-button").on('click', gameStart);


function fireToEnemy(){
    const player = {"socketId": socket.id};
    console.log("player",player);  
    socket.emit('shoot', player);
}
$("#fire-button").on('click', fireToEnemy);


function makeUL(players,type) {
    var list;
    list = document.getElementById('lobby-players');
    if(!list){
        list = document.createElement('ul');
        list.setAttribute("id", "lobby-players");
    }

    if(type == "lobby"){
        for(var i = 0; i < Object.keys(players).length; i++) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(Object.values(players)[i].nickname));
            list.appendChild(item);
        }
    }else{
        for(var i = 0; i < Object.keys(players).length; i++) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(Object.values(players)[i].nickname+" Fired "));
            if(Object.values(players)[i].fire){
                item.appendChild(document.createTextNode(Object.values(players)[i].fire+" Times"));
            }
            list.appendChild(item);
        }
    }
    return list;
}


socket.on('timer',function(timerData) {
    $('#seconds').html("Game will start in "+timerData.secondLeft+" Seconds");
});


socket.on('gameTime',function(timerData) {
    $('#game-time').html("Game will end in "+timerData.secondLeft+" Seconds");
});

socket.on('playzoneStart',function(timerData) {
    console.log("######## let's play the match ############",timerData);
    $("#start-screen").hide();
    $("#lobby-screen").hide();
    $("#play-zone").show();
    $("#scoreBoard").hide();
});

socket.on('connectToRoom',function(players) {
    var myList = document.getElementById('lobby-players');
    if(myList){
        myList.innerHTML = '';
    }
    document.getElementById('lobby-screen').appendChild(makeUL(
        players,"lobby"
    ));
 });

 socket.on('scoreBoard',function(players) {
    $("#start-screen").hide();
    $("#lobby-screen").hide();
    $("#score-board").show();
    $("#play-zone").hide();
    var myList = document.getElementById('lobby-players');
    if(myList){
        myList.innerHTML = '';
    }
    document.getElementById('score-board').appendChild(makeUL(
        players,"score"
    ));
 });


// io.to(this.socketId).emit('dead');
socket.on('dead', () => {
    $("#start-screen").show();
});

});