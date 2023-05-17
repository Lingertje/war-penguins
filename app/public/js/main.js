const socket = io();

var characterImg = new Image();
var characterSelf = new Image();
var playerSelf;
const canvas = {
    width: 800,
    height: 600
}

window.onload = function () {
    var c = document.getElementById('canvas')
    c.width = canvas.width;
    c.height = canvas.height;
    var ctx = c.getContext('2d');
    var cui = document.getElementById('canvas-ui');
    cui.width = canvas.width;
    cui.height = canvas.height;
    var ctxui = cui.getContext('2d');

    socket.on('self', data => {
        playerSelf = data;
    });

    socket.on('gunshot', data => {
        playAudio(data);
    });

    socket.on('emptyShot', data => {
        playAudio(data);
    });

    socket.on('reload', data => {
        playAudio(data);
    });

    socket.on('updatePosition', players => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas
        ctxui.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas

        players.forEach( player => {      
            var bullets = player.weapon.bullets;

            // Draw a healthbar
            ctx.fillStyle = '#b70e17';
            ctx.fillRect(player.xPos, player.yPos - 10, player.health / 2, 5);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(player.xPos, player.yPos - 10, 50, 5);

            // Call the function that draws the players
            if (playerSelf && Object.is(player.id, playerSelf.id)) {
                playerSelf = player;
                drawSelf(playerSelf);

                // UI text
                drawUI();
            } else {
                drawPlayer(player);
            }

            // Call the function that draws the bullets the player fired
            bullets.forEach( bullet => {
                handleCollision(bullet, players);
                drawBullet(bullet);
            });

            characterImg.src = '/public/img/character.png';
            characterSelf.src = '/public/img/character_self.png';
        });
    });

    function drawPlayer (player) {
        if(Object.is(player.direction, 'right')){
            ctx.drawImage(characterImg, 292, 0, 292, 322, player.xPos, player.yPos, player.width, player.height);
        } else {
            ctx.drawImage(characterImg, 0, 0, 292, 322, player.xPos, player.yPos, player.width, player.height);
        }
    }

    function drawSelf (player) {
        if(Object.is(player.direction, 'right')){
            ctx.drawImage(characterSelf, 292, 0, 292, 322, player.xPos, player.yPos, player.width, player.height);
        } else {
            ctx.drawImage(characterSelf, 0, 0, 292, 322, player.xPos, player.yPos, player.width, player.height);
        }
    }

    function drawBullet (bullet) {
        ctx.fillRect(bullet.xPos + 20, bullet.yPos + 15, bullet.width, bullet.height);
    }

    function drawUI () {
        ctxui.font = "24px Arial";
        ctxui.fillStyle = "#fff";
        ctxui.fillText('Kill count: ' + playerSelf.kills, 20, 50); // Kill count
        ctxui.fillText(playerSelf.weapon.bulletsInMag + '/' + playerSelf.weapon.magSize, canvas.width - 100, canvas.height - 25); // Bullets
        ctxui.fillText(playerSelf.health + 'hp', canvas.width / 2 - 30, canvas.height - 25); // Health

        // Healthbar
        ctx.fillStyle = '#b70e17';
        ctx.fillRect(canvas.width / 2 - 100, canvas.height - 47, playerSelf.health * 2, 30);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(canvas.width / 2 - 100, canvas.height - 47, 200, 30);
    }

    function handleCollision (bullet, players) {
        players.forEach( player => {
            if (playerSelf && playerSelf['id'] === player.id && player.id !== bullet.playerId && player.alive) {
                if (collides(bullet, player)) {
                    socket.emit('playerHit', { player: player, bullet: bullet });
                }
            }
        });
    }

    function collides (object1, object2) {
        return object1.xPos < object2.xPos + object2.width &&
            object1.xPos + object1.width > object2.xPos &&
            object1.yPos < object2.yPos + object2.height &&
            object1.yPos + object1.height > object2.yPos;
    }

    function playAudio(position){
        let gunshot = new Audio(`public/audio/${position.fileName}`);
        let distance = Math.abs(position.xPos - playerSelf.xPos) + Math.abs(position.yPos - playerSelf.yPos);
        let volume = (1000 - distance) / 1000;

        gunshot.volume = Math.round(volume * 10) / 10;
        gunshot.play();
    }

    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 65:
            case 37:
            case 68:
            case 39:
            case 87:
            case 38:
            case 83:
            case 40:
            case 16:
            case 32:
            case 82:
                socket.emit('keyPress', { inputId: event.keyCode, state: true });
                break;
        }
    };

    document.onkeyup = function (event) {
        switch (event.keyCode) {
            case 65:
            case 37:
            case 68:
            case 39:
            case 87:
            case 38:
            case 83:
            case 40:
            case 32:
            case 16:
            case 82:
                socket.emit('keyPress', { inputId: event.keyCode, state: false });
                break;
        }
    }
};