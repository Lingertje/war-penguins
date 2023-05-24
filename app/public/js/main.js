const socket = io();

const canvas = {
    width: 800,
    height: 600
}

let playerSelf;
const characterImg = new Image();
const characterSelf = new Image();
const medkitImg = new Image();
characterImg.src = 'img/character.png';
characterSelf.src = 'img/character_self.png';
medkitImg.src = 'img/medkit.png';

window.onload = function () {
	var cc = document.getElementById('canvas-consumables');
	cc.width = canvas.width;
	cc.height = canvas.height;
	var cctx = cc.getContext('2d');
    var c = document.getElementById('canvas')
    c.width = canvas.width;
    c.height = canvas.height;
    var ctx = c.getContext('2d');
    var cui = document.getElementById('canvas-ui');
    cui.width = canvas.width;
    cui.height = canvas.height;
    var ctxui = cui.getContext('2d');

    socket.on('world', data => {
        document.querySelector('.js-world-id').href = `${window.location.href}?world=${data}`;
    })

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

	socket.on('medkit', data => {
		cctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas
		data.map(item => {
			drawMedkit(item);
		})
	});

	socket.on('medkitPickup', data => {
		playAudio(data);
	})

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
                drawBullet(bullet);
            });
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

	function drawMedkit (medkit) {
		cctx.drawImage(medkitImg, medkit.xPos, medkit.yPos, medkit.width, medkit.height);
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

    function playAudio(position){
        let audio = new Audio(`audio/${position.fileName}`);
        let distance = Math.abs(position.xPos - playerSelf.xPos) + Math.abs(position.yPos - playerSelf.yPos);
        let volume = (1000 - distance) / 1000;

        audio.volume = Math.round(volume * 10) / 10;
        audio.play();
    }

    document.onkeydown = function (event) {
        switch (event.key) {
            case 'Shift':
            case 'a':
            case 'ArrowLeft':
            case 'd':
            case 'ArrowRight':
            case 'w':
            case 'ArrowUp':
            case 's':
            case 'ArrowDown':
            case ' ':
            case 'r':
			case 'e':
                socket.emit('keyPress', { inputId: event.key, state: true });
                break;
        }
    };

    document.onkeyup = function (event) {
        switch (event.key) {
            case 'Shift':
            case 'a':
            case 'ArrowLeft':
            case 'd':
            case 'ArrowRight':
            case 'w':
            case 'ArrowUp':
            case 's':
            case 'ArrowDown':
            case ' ':
            case 'r':
			case 'e':
                socket.emit('keyPress', { inputId: event.key, state: false });
                break;
        }
    }
};
