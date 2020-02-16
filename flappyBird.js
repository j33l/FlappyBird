// Flappy Bird game using JavaScript

// display canvas
var canvas = document.getElementById("myCanvas");
var contex = canvas.getContext("2d");

// loading images
var bird = new Image();
var backgroundImage = new Image();
var frontground = new Image();
var topPipe = new Image();
var bottomPipe = new Image();

bird.src = "assets/images/bird.png";
backgroundImage.src = "assets/images/backgroundImage.png";
frontground.src = "assets/images/frontground.png";
topPipe.src = "assets/images/topPipe.png";
bottomPipe.src = "assets/images/bottomPipe.png";

// audio files
var birdFly = new Audio();
var scoreIncrement = new Audio();

birdFly.src = "assets/sounds/birdFly.mp3";
scoreIncrement.src = "assets/sounds/scoreIncrement.mp3";


// game physics variables
var pipesGap = 100;
var constant;

var xBird = 10;
var yBird = 150;

var gravity = 1.3;

var score = 0;

var playing = false;

// on key press
document.addEventListener("keydown", () => {
    var x = event.which || event.keyCode;
    
    if(x == 32) { // space -> fly
        yBird -= 25;
        birdFly.play();
    }

    if(x == 13) { // enter -> start playing
        playing = true;
        draw();
    }

    if(x == 27) { // escape -> stop game
        playing = false
        mainScreen()
    }
})

// pipe coordinates
var pipes = [];

pipes[0] = { // initial pipes
    x : canvas.width,
    y : 0
};

// main screen
function mainScreen() {

    contex.clearRect(0, 0, canvas.width, canvas.height)

    contex.fillStyle = "#000";
    contex.font = "50px Arial";
    contex.fillText("Flappy Bird", 15, 100);

    contex.beginPath();
    contex.arc(137, 264, 50, 0, 2 * Math.PI);
    contex.stroke();

    contex.fillStyle = "#000";
    contex.font = "20px Arial";
    contex.fillText("Score : " + score , 10, canvas.height-20);
}

mainScreen()

// draw images
function draw() {

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    
    // drawing backgroung image
    contex.drawImage(backgroundImage, 0, 0); // imageName, x position, y position, widgth, height
    
    // drawing all available poles
    for(var i = 0; i < pipes.length; i++) {
        
        constant = topPipe.height + pipesGap;
        contex.drawImage(topPipe, pipes[i].x, pipes[i].y);
        contex.drawImage(bottomPipe, pipes[i].x, pipes[i].y+constant);

        pipes[i].x--; // moving all pipes left
        
        // adding new pipeCouples to the array when oldest reachec almost middle
        if( pipes[i].x == canvas.width - 188) {
            pipes.push({
                x : canvas.width,
                y : Math.floor( Math.random() * topPipe.height ) - topPipe.height // new pole with random y position
            });

            // removing old pipes
            if( pipes.length > 3 ) {
                pipes.shift();
            }
        }

        // bird - pipe collision detection
        /**
         * if xBird > (xPipe + pipe.widgth) means bird is ahead of that pipe.
         * checking bird y position for topPipe, bottomPipe and frontground
         */
        if( xBird + bird.width >= pipes[i].x  &&  xBird <= pipes[i].x + topPipe.width && (yBird <= pipes[i].y + topPipe.height || yBird + bird.height >= pipes[i].y + constant) || yBird + bird.height >=  canvas.height - frontground.height) {
            //location.reload(); // reload the page
            yBird = 150 // 4temp
        }
        
        // incrementing score
        if(pipes[i].x == 5){
            score++;
            scoreIncrement.play();
        }
    }

    contex.drawImage(frontground, 0, canvas.height - frontground.height);
    
    contex.drawImage(bird, xBird, yBird);
    
    yBird += gravity;
    
    // displaying score
    contex.fillStyle = "#000";
    contex.font = "20px Arial";
    contex.fillText("Score : " + score , 10, canvas.height-20);
    
    playing ? requestAnimationFrame(draw) : mainScreen()
}

// draw(); // draw game animation loop
