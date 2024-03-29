//Create array of enemy positions at y coordinate
var positions = [80, 100, 200, 300, 500, 700];
var positionsStar = [10, 50, 150, 300];

// This is a superclass Character
// Our enemy and player delegate to this class when their lookups fail

var Character = function(img, x, y) {
    this.x = x;
    this.y = y;
    this.sprite = img;
};

//Create star subclass and call the Character superclass
var Star = function() {
    Character.call(this, 'images/star.png', -100, 30);
    this.y = positionsStar[Math.floor(Math.random() * 9)];
    this.speed = Math.floor(Math.random() * 100) + 100;
};
//For safe inheritance I'll call the Obj.create and constructor function
Star.prototype = Object.create(Character.prototype);
Star.prototype.constructor = Star;

Star.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x >= 800) {
        allStars.push(new Star());
        var starsList = allStars.indexOf(this);
        allStars.splice(starsList, 1);
    }
};

//Get star onscreen
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This is our enemies subclass

var Enemy = function() {
    // Set our enemies starting position
    Character.call(this, 'images/enemy-bug.png', -100, 200);
    // Have enemies apeaar randomly at different y coorindates
    this.y = positions[Math.floor(Math.random() * 4)];
    // Have enemies randomy have different speeds
    this.speed = Math.floor(Math.random() * 200) + 100;
};

//For safe inheritance, I'll call Object.create and the constructor function

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

    //this will update the position of our enemy, based on
    //where our enemy went!
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    //Instantiate a new enemy when another enmy goes offscreen!
    if (this.x >= 800) {
        allEnemies.push(new Enemy());
        //remove enemies from array when they're gone
        var enemiesList = allEnemies.indexOf(this);
        allEnemies.splice(enemiesList, 1);
    }
};
//Put our enemy onscreen!
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Here is our player class that delegates to Character
var Player = function() {
    //here we need an x, y position of where my player is at
    Character.call(this, 'images/char-pink-girl.png', 400, 600);
};

//For safe inheritance, I'm calling Object.create and the constructor function
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
//Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    displayScoreLevel(gameLevel);
};

// Reset your player when he dies!
function playerDies() {
    player.reset();

}

function gotPoint() {
    player.sprite = 'images/char-princess-girl.png';

}

//Display my player's score and level
var displayScoreLevel = function(currentLevel) {
    var canvas = document.getElementsByTagName('canvas');
    var firstCanvasTag = canvas[0];
    scoreLevelDiv.innerHTML = 'Level: ' + currentLevel;
    document.body.insertBefore(scoreLevelDiv, firstCanvasTag[0]);
};

/*Add in an additional function to the player class
 *called checkCollisions which resets the game when a player and a bug collide
 */
Player.prototype.checkCollisions = function() {
    for (var i = 0; i < allEnemies.length; i++) {
      if (!(allEnemies[i].y + 70 < this.y ||
        allEnemies[i].y > this.y + 70 ||
        allEnemies[i].x + 70 < this.x ||
        allEnemies[i].x > this.x + 70)) {
        playerDies();
        console.log("Collided!")
        }
    }
};


Player.prototype.checkCollections = function() {
    for (var i = 0; i < allStars.length; i++) {
        if (!(allStars[i].y + 70 < this.y || 
            allStars[i].y > this.y + 70 ||
            allStars[i].x + 70 < this.x ||
            allStars[i].x > this.x + 70)) {
            gotPoint();

        }
    }
}

//Make my player move!
Player.prototype.handleInput = function(e) {
    if (e === 'left' && this.x != 0) {
        this.x -= 100;
    } else if (e === 'right' && this.x != 800) {
        this.x += 100;
    } else if (e === 'up') {
        this.y = this.y - 80;
    } else if (e === 'down' && this.y != 600) {
        this.y = this.y + 80;
    }
    e = null;
};

// When player wins, give an alert and reset player
Player.prototype.update = function() {
    if (this.y < 50) {
        //ctx.fillStyle = 'pink';
        //ctx.fillRect(0, 0, 905, 171);
        gameLevel += 1;
        console.log('current level: ' + gameLevel);
        increaseDifficulty(gameLevel);
        this.reset();
    }
}

Player.prototype.reset = function() {
    this.x = 400;
    this.y = 600;
    this.sprite = 'images/char-pink-girl.png';
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < 2; i++) {
    allEnemies.push(new Enemy());
}

var increaseDifficulty = function(numEnemies) {
    // remove all previous enemies on canvas
    allEnemies.length = 0;

    // load new set of enemies
    for (var i = 0; i <= numEnemies; i++) {
        var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 106);
        
        allEnemies.push(enemy);
    }
};

var player = new Player(202.5, 383, 50);
var gameLevel = 1;


var scoreLevelDiv = document.createElement('div');
// Create array to hold stars in
var allStars = [];
for (var i = 0; i < 2; i++) {
    allStars.push(new Star());
}

// Place the player object in a variable called player

//Create 1 instance of the player:
var player = new Player();

// 
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
