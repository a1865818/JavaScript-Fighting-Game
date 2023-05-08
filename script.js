const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.6;

const background = new Sprite ({
    position : {
        x:0,
        y:0
    },
    imageSrc: './IMG/Hills Free.png'

})

const shop = new Sprite ({
    position : {
        x:651,
        y:220
    },
    imageSrc: './IMG/shop_anim.png',
    scale:2.5,
    frameMax :6

})

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    offset: {
        x:0,
        y:0,
    },
    imageSrc: './IMG/Sprites2/Idle.png',
    frameMax : 8,
    scale:2,
    offset : {x:70,y:90},
    sprites : {
        idle: {
            imageSrc:'./IMG/Sprites2/Idle.png',
            frameMax: 8,
        },
        run: {
            imageSrc:'./IMG/Sprites2/Run.png',
            frameMax: 8,
            image: new Image()
        },
        jump: {
            imageSrc:'./IMG/Sprites2/Jump.png',
            frameMax: 2,
        },
        fall: {
            imageSrc:'./IMG/Sprites2/Fall.png',
            frameMax: 2,
        },
        attack1: {
            imageSrc:'./IMG/Sprites2/Attack1.png',
            frameMax: 6,
        },
    },
    attackBox : {
        offset: {
            x:200 ,
            y:50,
        },
        width:160 ,
        height:50,
    }
});
// player.draw()
const enemy = new Fighter({
    position: {
        x: 700,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    color: "blue",
    offset: {
        x:-50,
        y:0,
    },
    imageSrc: './IMG/Sprites/Idle.png',
    frameMax : 4,
    scale:2,
    offset : {x:215,y:101},
    sprites : {
        idle: {
            imageSrc:'./IMG/Sprites/Idle.png',
            frameMax: 4,
        },
        run: {
            imageSrc:'./IMG/Sprites/Run.png',
            frameMax: 8,
            
        },
        jump: {
            imageSrc:'./IMG/Sprites/Jump.png',
            frameMax: 2,
        },
        fall: {
            imageSrc:'./IMG/Sprites/Fall.png',
            frameMax: 2,
        },
        attack1: {
            imageSrc:'./IMG/Sprites/Attack1.png',
            frameMax: 4,
        },
       
    },
    attackBox : {
        offset: {
            x:-250 ,
            y:50
        },
        width:170,
        height:50,
    }
});
//enemy.draw
console.log(player);

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
};


decrease_timer()

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update()
    shop.update()
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    //Player movement
    
    if (keys.a.pressed && player.lastkey === "a") {
        player.velocity.x = -7;
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastkey === "d") {
        player.velocity.x = 7;
        
        player.switchSprite('run')
    }else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite ('jump')
    }else if (player.velocity.y > 0) {
        player.switchSprite ('fall')
    }

    //Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
        enemy.velocity.x = -7;
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
        enemy.velocity.x = 7;
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite ('jump')
    }else if (enemy.velocity.y > 0) {
        enemy.switchSprite ('fall')
    }

    //detect for collision
    if (
       rectangularCollision({
            rectangle1:player,
            rectangle2:enemy
       }) && player.isAttacking && player.frameCurrent == 4
    ) {
        player.isAttacking = false;
        enemy.health -= 5
        document.querySelector('#Enemy_Health').style.width=enemy.health + "%"
    }


    if (player.isAttacking && player.frameCurrent ===4) {
        player.isAttacking = false
    }

    if (
        rectangularCollision({
             rectangle1:enemy,
             rectangle2:player
        }) && enemy.isAttacking && enemy.frameCurrent == 2
     ) {
         enemy.isAttacking = false;
         player.health -= 5
         document.querySelector('#Player_Health').style.width=player.health + "%"
         
     }

     if (enemy.isAttacking && enemy.frameCurrent ===2) {
        enemy.isAttacking = false
    }
     //end the game based on health
if (player.health <= 0 || enemy.health <= 0  ) {
    determinewinner({player,enemy,timerId})
}
}



animate();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = true;
            player.lastkey = "d";
            break;
        case "a":
            keys.a.pressed = true;
            player.lastkey = "a";
            break;
        case "w":
            player.velocity.y = -15;
            break;
        case ' ':
            player.attack();
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastkey = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.velocity.y = -15;
            break;
            case "ArrowDown":
            enemy.attack()
            break;
        // case 's':
        //     keys.s.pressed = true
        //     lastkey = 's'
        // break
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            break;
    }
    //enemy keys
    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false;

            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;

            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = false;
            break;
    }
});
