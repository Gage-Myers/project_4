var gameWidth = 400;
var gameHeight = 500;
var gameScale = 1;
var DIM = 16;

var gameport = document.getElementById('gameport');
var renderer =  PIXI.autoDetectRenderer(gameWidth, gameHeight, {backgroundColor: 0x0});

var ship = new PIXI.Sprite(PIXI.Texture.fromImage('../assets/ship.png'));
var hitArr;

// Text for in game
var headline = new PIXI.Text('Alien Invasion', {font: '24px Arial', fill: 0x0, align: 'center'});
var instructions = new PIXI.Text('Click anywhere to continue', {font: '16px Arial', fill: 0x0, align: 'center'});
var win = new PIXI.Text('You escaped the invasion', {font: '30px Arial', fill: 0x0, align: 'center'});
var lose = new PIXI.Text('Sorry you lost', {font: '24px Arial', fill: 0x0, align: 'center'});

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

var stage =  new PIXI.Container();
stage.scale.set(gameScale,gameScale);

var world;
var tu =  new TileUtilities(PIXI);;

gameport.appendChild(renderer.view);

PIXI.loader
    .add('map_json','../assets/map.json')
    .add('tileset', '../assets/textures.png')
    .load(ready);

function ready() {
    world = tu.makeTiledWorld("map_json", "../assets/textures.png");
    world.position.y = -260*16;
    hitArr =  world.getObject("Hit").data;
    
    stage.addChild(world);

    ship.gx = 11;
    ship.gy = 285;
    ship.x = ship.gx*DIM;
    ship.y = ship.gy*DIM;
    ship.anchor.x = 0.0;
    ship.anchor.y = 1.0;

    var entity = world.getObject("Player");
    entity.addChild(ship);

    animate();
}

function mouseHandler(e) {
    
}

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

function isAlive() {
    return ship.visible;
}

function shipHit() {
    var index = tu.getIndex(ship.x + 16,ship.y - 16,16,16,25);
    console.log(index);
    return hitArr[index] == 0;
}


document.addEventListener('keydown', keyDownEventHandler);
document.addEventListener('mousedown', mouseHandler);

function animate() {
    requestAnimationFrame(animate);
    if (shipHit()) {
        update_camera();
    }
    else {
        ship.visible = false;
    }
    if (ship.position.y == 0) {
        ship.visible = false;
    }
    renderer.render(stage);
}

function update_camera() {
  if(world.position.y < 0) {
    world.position.y += 1;
    ship.position.y -= 1;
  }
  else {
    ship.position.y -= 2;
    console.log(ship.position.y);
  }
}