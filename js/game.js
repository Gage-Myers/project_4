
// Set gloabal variables for game
var gameWidth = 400;
var gameHeight = 500;
var gameScale = 1;
var DIM = 16;

var gameport = document.getElementById('gameport');
var renderer =  PIXI.autoDetectRenderer(gameWidth, gameHeight, {backgroundColor: 0x0});

var ship = new PIXI.Sprite(PIXI.Texture.fromImage('../assets/ship.png'));
var hitArr;
var loss = false;

// Text for in game
var headline = new PIXI.Text('Alien Invasion', {font: '24px Arial', fill: 0x0, align: 'center'});
var instructions = new PIXI.Text('Click anywhere to restart', {font: '16px Arial', fill: 0xffffff, align: 'center'});
var win = new PIXI.Text('You escaped the invasion', {font: '30px Arial', fill: 0x0, align: 'center'});
var lose = new PIXI.Text('Sorry you lost', {font: '24px Arial', fill: 0xffffff, align: 'center'});
lose.position.set(125,150);
instructions.position.set(100, 200);
lose.visible = false;
instructions.visible = false;

// State Machine for Display
var display = StateMachine.create({
    initial: {state: 'begin', event: 'init'},
    error: function() {},
    events: [
        {name: "start" , from: "begin", to: "play"},
        {name: "select", from: "begin", to: "end"},
        {name: "win"   , from: "play", to: "end"},
        {name: "replay", from: "end", to: "begin"}],
    callbacks: {
        onbegin: function() {},
        onplay : function() {},
        onend  : function() {}
    }
})

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// Initialize stage as a container
var stage =  new PIXI.Container();
stage.scale.set(gameScale,gameScale);

var world;
var tu =  new TileUtilities(PIXI);;

gameport.appendChild(renderer.view);

PIXI.loader
    .add('../assets/explosion.wav')
    .add('../assets/theme.wav')
    .add('map_json','../assets/map.json')
    .add('tileset', '../assets/textures.png')
    .load(ready);

var explosion;
var theme;

/*
  In the ready function we create the world
  from the tile map using the pixiTileUtilities
  library. Add it to the stage and add the ship
  sprite as an object layer
*/

function ready() {
    world = tu.makeTiledWorld("map_json", "../assets/textures.png");
    world.position.y = -260*16;
    hitArr =  world.getObject("Hit").data;

    explosion = PIXI.audioManager.getAudio("../assets/explosion.wav");
    theme = PIXI.audioManager.getAudio("../assets/theme.wav");

    stage.addChild(world);

    ship.gx = 11;
    ship.gy = 285;
    ship.x = ship.gx*DIM;
    ship.y = ship.gy*DIM;
    ship.anchor.x = 0.0;
    ship.anchor.y = 1.0;

    var entity = world.getObject("Player");
    entity.addChild(ship);

    stage.addChild(lose);
    stage.addChild(instructions);

    animate();
}

/*
  Handles swaps between states lose and
  play by allowing the player to restart
*/

function mouseHandler(e) {
    if(loss) {
        ship.gx = 11;
        ship.gy = 285;
        ship.x = ship.gx*DIM;
        ship.y = ship.gy*DIM;
        world.position.y = -260*16;
        ship.visible = true;
        lose.visible = false;
        instructions.visible = false;
    }
}

// Simple key handle if the ship is alive

function keyDownEventHandler(e) {
    e.preventDefault();

    // A: Move Left
    if (e.keyCode == 65 && ship.position.x > 20 && shipHit()) {
       createjs.Tween.get(ship).to({x: ship.position.x - 32, y: ship.position.y - 28}, 500);
    }

    // D: Move Right
    if (e.keyCode == 68 && ship.position.x < 340 && shipHit()) {
      createjs.Tween.get(ship).to({x: ship.position.x + 32, y: ship.position.y - 28}, 500);       
    }

    if (e.keyCode == 32) {
        
    }
}


// Creates index based on our sprite then
// passing our index into the array for our
// terrain layer in the tiled map to check for collision

function shipHit() {
    var index = tu.getIndex(ship.x + 16,ship.y - 16,16,16,25);
    console.log(index);
    return hitArr[index] == 0;
}

// Plays the explosion sound once upon losing

function explode() {
    if (ship.visible) {
        explosion.play();
    }
}


document.addEventListener('keydown', keyDownEventHandler);
document.addEventListener('mousedown', mouseHandler);

function animate() {
    requestAnimationFrame(animate);
    if (shipHit()) {
        update_camera();
        theme.play();
    }
    else {
        explode();
        ship.visible = false;
        lose.visible = true;
        instructions.visible = true;
        loss = true;
    }
    if (ship.position.y == 0) {
        ship.visible = false;


    }
    renderer.render(stage);
}

// Simply moves the player upward toward the end of the screen
// then only moves the player once the map reaches the end

function update_camera() {
  if(world.position.y < 0) {
    world.position.y += 1;
    ship.position.y -= 1;
  }
  else {
    ship.position.y -= 2;
  }
}