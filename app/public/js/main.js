const socket = io({
	transports:['websocket', 'polling']
});

const canvas = {
    width: 800,
    height: 600
}

const colors = {
	BLACK: '#000',
}

let playerSelf;
const characterImg = new Image();
const characterSelf = new Image();
const medkitImg = new Image();
characterImg.src = 'img/character.png';
characterSelf.src = 'img/character_self.png';
medkitImg.src = 'img/medkit.png';

window.onload = function () {
	let cctx = createCanvas('canvas-consumables');
	let ctx = createCanvas('canvas');
	let ctxui = createCanvas('canvas-ui');

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

	socket.on('consumable', data => {
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
        ctxui.clearRect(0, 0, canvas.width, canvas.height); //Clear the UI canvas

        players.forEach( player => {
			if (playerSelf && Object.is(player.id, playerSelf.id)) playerSelf = player;
            let bullets = player.weapon.bullets;

			drawPlayer(player);

            // Call the function that draws the bullets the player fired
            bullets.forEach( bullet => {
                drawBullet(bullet);
            });
        });

		drawUI();
    });

    function drawPlayer (player) {
		const characterUrl = playerSelf && Object.is(player.id, playerSelf.id) ? characterSelf : characterImg;

        if(Object.is(player.direction, 'right')){
            ctx.drawImage(characterUrl, 292, 0, 292, 322, player.xPos, player.yPos, player.width, player.height);
        } else {
            ctx.drawImage(characterUrl, 0, 0, 292, 322, player.xPos, player.yPos, player.width, player.height);
        }

		// Draw a healthbar above character
		ctx.fillStyle = '#b70e17';
		ctx.fillRect(player.xPos, player.yPos - 10, player.health / 2, 5);
		ctx.strokeStyle = colors.BLACK;
		ctx.strokeRect(player.xPos, player.yPos - 10, 50, 5);
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

		// Healthbar
		ctxui.fillStyle = colors.BLACK;
        ctxui.fillRect(canvas.width / 2 - 100, canvas.height - 47, 200, 30);
        ctxui.fillStyle = '#b70e17';
        ctxui.fillRect(canvas.width / 2 - 100, canvas.height - 47, playerSelf.health * 2, 30);
        ctxui.strokeStyle = colors.BLACK;
        ctxui.strokeRect(canvas.width / 2 - 100, canvas.height - 47, 200, 30);

		ctxui.font = "20px Arial";
		ctxui.fillStyle = "#fff";
        ctxui.fillText(playerSelf.health + 'hp', canvas.width / 2 - 28, canvas.height - 26); // Health
    }

    function playAudio(position){
        let audio = new Audio(`audio/${position.fileName}`);
        let distance = Math.abs(position.xPos - playerSelf.xPos) + Math.abs(position.yPos - playerSelf.yPos);
        let volume = (1000 - distance) / 1000;

        audio.volume = Math.round(volume * 10) / 10;
        audio.play();
    }

    document.onkeydown = (event) => handleKeyPress(event, true);
    document.onkeyup = (event) => handleKeyPress(event, false);
};

function createCanvas (id) {
	const c = document.getElementById(id);
    c.width = canvas.width;
    c.height = canvas.height;
    return c.getContext('2d');
}

function handleKeyPress (event, state) {
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
			socket.emit('keyPress', { inputId: event.key, state });
			break;
	}
}
