var dog, database, foodS, foodStock;
var dogImage, happyDogImage,sadDogImage;
var addFood,feed;
var fedTime,lastFed;
var food;
var currentTime;
var readingGameState,changingGameState;
var bedroom,garden,washroom;
var readState;
var gameState;

function preload()
{  
  dogImage = loadImage("dogImg.png");
  happyDogImage = loadImage("dogImg1.png");
  sadDogImage = loadImage("deadDog.png")
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
}

function setup() {
  database = firebase.database();

  createCanvas(500,500);
  
  dog = createSprite(250,290);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    fedTime = data.val();
  });

  food = new Food(200,200,10,10);

  feed = createButton("Feed the dog");
  feed.position(500,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    food.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    food.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    food.washroom();
  }
  else{
    update("Hungry");
    food.display();
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDogImage);
  }

  background(46,139,87);  

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  drawSprites();
  textSize(20);
  fill("white");
  text("Food Remaining: " + foodS,170,100);

  fill(255,255,254);
  textSize(15);
  if(fedTime >= 12){
    text("Last Feed: " + fedTime % 12 + " PM",350,30);
  }
  else if(fedTime == 0){
    text("Last Feed: 12 AM",350,30);
  }
  else{
    text("Last Feed: " + fedTime + " AM",350,30)
  }
}

function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImage);
  foodS--;
  if(foodS<=0){
    foodS = 0;
  }
  database.ref('/').update({
    Food:foodS,
  })
  fedTime=hour()
}

function addFoods(){
  dog.addImage(dogImage);
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}
