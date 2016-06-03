var gameWidth = 400;
var gameHeight = 500;
var gameScale = 1;

var gameport = document.getElementById('gameport');
var renderer =  PIXI.autoDetectRenderer(gameWidth, gameHeight, {backgroundColor: 0x0});

var ship = new PIXI.Sprite(PIXI.Texture.fromImage('../assets/ship.png'));
var hitArr;

// Text for in game
var headline = new PIXI.Text('Alien Invasion', {font: '24px Arial', fill: 0x0, align: 'center'});
var instructions = new PIXI.Text('Click anywhere to continue', {font: '16px Arial', fill: 0x0, align: 'center'});
var win = new PIXI.Text('You escaped the invasion', {font: '30px Arial', fill: 0x0, align: 'center'});
var lose = new PIXI.Text('Sorry you lost', {font: '24px Arial', fill: 0x0, align: 'center'});



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
    ship.position.set(180, 435);
    hitArr =  world.getObject("Hit").data;
    
    stage.addChild(world);
    stage.addChild(ship);
}

function mouseHandler(e) {
    
}

function keyDownEventHandler(e) {
    e.preventDefault();

    // A: Move Left
    if (e.keyCode == 65) {

    }

    // D: Move Right
    if (e.keyCode == 68) {
        
    }

    if (e.keyCode == 32) {
        
    }
}

function isAlive() {
    return ship.visible;
}

function contains(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == runner.position.x) {
            return true;
        }
    }
    return false;
}

function shipHit() {
    var collisionArea = {x: ship.position.x + 16, y: ship.position.y - 16, width: 32, height: 32};
    var index = tu.getPoints(collisionArea);
    return tu.hitTestTile(ship, index, hitArr, world, "every").collision;
}


document.addEventListener('keydown', keyDownEventHandler);
document.addEventListener('mousedown', mouseHandler);

function animate() {
    requestAnimationFrame(animate);
    if (!shipHit()) {
        update_camera();
    }
    renderer.render(stage);
}

function update_camera() {
  if(world.position.y < 0) {
    world.position.y += 1;
  }
}

animate();