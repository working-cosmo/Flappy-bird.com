//Creating variables for sprites.
var topPipe,bottomPipe,gameOver,restart;
var topPipeGroup,bottomPipeGroup;
var food,foodGroup;
var back;

//Creating variables for gamestates.
var PLAY = 0;
var END = 1;
var START=2;
var gameState = START;
var pipeSpeed=-4;

//Creating variable for score.
var score=0;


function preload(){

  //Loading images in variables.
  bg=loadImage("images/back.gif");
  birdImg=loadImage("images/bird.png");
  pipeUp=loadImage("images/pipeNorth.png");
  pipeDown=loadImage("images/pipeSouth.png");
  resetImg=loadImage("images/restart.png");
  gameOverImg=loadImage("images/gameOver.png");
  startBg=loadImage("images/back2.png");


  //Loading sounds.
  wingSound=loadSound("images/wing.mp3");
  endSound=loadSound("images/hit.mp3");
  foodImg=loadImage("images/food.png");
  foodSound=loadSound("images/checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
 
  //Creating background.
  back=createSprite(0,0,displayWidth*5,displayHeight);
  back.addImage(bg);
  back.scale=7;

  //Creating bird.
  bird=createSprite(displayWidth/2-100,displayHeight/2-200);
  bird.addImage(birdImg);

  

  //Creating restart button.
  restart=createSprite(displayWidth/2,displayHeight/2+45);
  restart.addImage("restart",resetImg);
  restart.visible=false;
  restart.scale=0.4

  //Writing gameover.
  gameOver=createSprite(displayWidth/2,displayHeight/2-200);
  gameOver.addImage("gameover",gameOverImg);
  gameOver.visible=false;
 

  //Creating invisible ground.
  ground=createSprite(displayWidth/2,displayHeight-100,10000,10);
  ground.visible=false;

  //Creating groups.
 topPipeGroup=new Group();
 bottomPipeGroup=new Group();
 foodGroup=new Group();

 textSize(30);
 textFont("Algerian");
 fill("red");
 stroke("black")

}



function draw() {
  //Gamestate Play.
  if(gameState===START)
  {
    background(startBg);
    back.visible=false;
    bird.visible=false;
    var heading=createElement('h1');
    heading.html("Flappy Bird");
    heading.position(displayWidth/2-100,100);
    var ins=createElement('h2');
    ins.html("Welcome to FLAPPY BIRD game ! Tap the 'Play' button given below to start . Press space key to make the bird fly. The faster you press the space key , the higher you go . Each time you press space key , it represents a wing flap and higher flight . Once you stop , you drop towards the ground . Your task is to fly from in between the pipes and score more.Each time you cross from between the pipes , you get 1 score . (BONUS score if you eat the food also.) If you fall on ground or touch any of the pipes , you lose.....You can restart the game by pressing the restart button. ENJOY!!!!");
    ins.position(displayWidth/2-635,displayHeight/2-200);
    var tell=createElement('h2');
    tell.html("Click on play nowww!!!");
    tell.position(displayWidth/2-100,displayHeight/2+20);
    
    var button=createButton("Play");
    button.position(displayWidth/2,displayHeight/2);
    button.mousePressed(()=>{
      removeElements();
      gameState=PLAY;
    })
  }


  if(gameState===PLAY){
    back.visible=true;
    bird.visible=true;

    var top =createSprite(windowWidth/2,-10,windowWidth,10);
    bird.bounceOff(top);
    
  //Moving background.
  back.velocityX=-2;

  

  //Moving bird if space key is pressed.
  if(touches.length>0||keyDown("space")){
    bird.velocityY=-10;
    wingSound.play();
    touches=[];
  }

  //Making the bird fall down if space key is not pressed for long.
  bird.velocityY=bird.velocityY+1;

  //Infinite background effect
  if(back.x<0){
   back.x=back.width/2
  }

  

  //Calling functions.
  spawnObstacles();
  scoring();

  
  //Giving extra score if bird touches the food.
  if(foodGroup.isTouching(bird)){
    for(var k=0;k<foodGroup.length;k++){
      if(foodGroup[k].isTouching(bird)){
    score=score+1;
    foodSound.play();
    

    //Destroying the food.
    foodGroup[k].destroy();
  }
}
}
  
  //Ending the game if bird falls down or touches the pipe.
  if(topPipeGroup.isTouching(bird)|| bottomPipeGroup.isTouching(bird)||bird.isTouching(ground)){
     gameState=END;
    endSound.play();
  }
  
  drawSprites();
  text("Score: 10"+score,displayWidth-200,100);
  

}

//Gamestate End.
if(gameState===END){

  

  //Stopping the things from moving.
  topPipeGroup.setVelocityXEach(0);
  bottomPipeGroup.setVelocityXEach(0);
  foodGroup.setVelocityXEach(0);
  back.velocityX=0;

  //Making gameover and restart button visible to player.
  gameOver.visible=true;
  restart.visible=true;
  
  //Setting the lifetime to infinite so they don't vanish.
  topPipeGroup.setLifetimeEach(-1);
  bottomPipeGroup.setLifetimeEach(-1);
  foodGroup.setLifetimeEach(-1);
  bird.velocityY=0;

  //Calling restart function if restart button is pressed.
  if(mousePressedOver(restart)) {
    reset();
    //touches = [];  
  }
  drawSprites();
  text("Score: "+score,displayWidth-200,100);
  
 // text("Your final score 👆",displayWidth-350,displayHeight/2-150);

  if(gameState===END){
    textFont("ArialBold");
    textSize(27);
    stroke("black");
    fill("purple");
    text("You lost!🤦‍♀️🤷‍♀️....But you played verryy well👌👍. CLick on the restart button to play again",displayWidth/2-635,displayHeight/2+100);
    text("Press it to play more and score more!!🤩😁-Flappy...",displayWidth/2-500,displayHeight/2+150);
    text("THANK YOU FOR PLAYING!!",displayWidth/2-300,displayHeight/2+200);
    textSize(30);
 textFont("Algerian");
 fill("red");
 stroke("black")
    text("Your final Score is "+score+".",displayWidth/2-100,displayHeight/2-100);
    
  }

}

//  drawSprites();

  //Displaying score.

}

//Function for obstacles(pipes).
function spawnObstacles(){
  //Creating pipes at a specific time.
  //if(frameCount%120===0){
  if((topPipeGroup.length===0)||(topPipe.x<displayWidth-420))
  {
    //Creating a variable for pipes to come at random heights.
    var randomHeight=random(80,350);

    //Creating the top pipe at random heights.
   topPipe=createSprite(displayWidth-100,randomHeight-190);
   topPipe.addImage(pipeUp);
   //console.log(topPipe.x);
  
  //Giving the top pipe its velocity.
  //topPipe.velocityX=-2;
  topPipe.velocityX = pipeSpeed;
  
  //Creating the bottom pipe at random heights.
    bottomPipe=createSprite(topPipe.x,displayHeight-180+(randomHeight-190));
  bottomPipe.addImage(pipeDown);
  //Giving the bottom pipe its velocity.
//bottomPipe.velocityX=-2;
bottomPipe.velocityX =topPipe.velocityX;

//Giving pipes lifetime.
topPipe.lifetime=displayWidth/2;
bottomPipe.lifetime=displayWidth/2;

topPipe.depth=gameOver.depth;
gameOver.depth=restart.depth;
restart.depth=restart.depth+1;

bottomPipe.depth=gameOver.depth;
gameOver.depth=restart.depth;
restart.depth=restart.depth+1;

//Creating food in between pipes at random positions.
if(Math.round(random(1,6))%2===0){
var food=createSprite(topPipe.x,randomHeight+random(20,170));
food.addImage(foodImg);
food.scale=0.2;
food.velocityX=topPipe.velocityX;

//Adding food in the food group.
foodGroup.add(food);}

//Adding pipes in their groups.
}
topPipeGroup.add(topPipe);
bottomPipeGroup.add(bottomPipe);

}
//Reset function.
function reset(){
  gameState=PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
   topPipeGroup.destroyEach();
   bottomPipeGroup.destroyEach();
   foodGroup.destroyEach();
  
   bird.x=displayWidth/2-100;
   bird.y=displayHeight/2;

   score=0;
   pipespeed=-4;
}

//Creating a scoring function.
function scoring(){
 for(var i=0;i<topPipeGroup.length;i++){
   if(bird.x-topPipeGroup[i].x<=4&&bird.x-topPipeGroup[i].x>4+pipeSpeed){

    //Increasing score by 1 if bird travels in between the pipes.
     score=score+1;
   }
   if(score%2===0)
   {
     pipeSpeed=-2;
     topPipeGroup.setVelocityXEach(pipeSpeed);
     bottomPipeGroup.setVelocityXEach(pipeSpeed);
     
   }
 }
}


