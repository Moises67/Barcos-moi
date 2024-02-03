disparo = false;
const velocidadInicial = 50;
const gravedad = 1.8;
var barcosDestruidos = 0;
var volumen = 0.1;
var game = false;
function preload() {
  fondo=loadImage("./recursos/background.gif");
  torreIMG=loadImage("./recursos/torre.png");
  baseIMG=loadImage("./recursos/cañon_base.png");
  canonIMG=loadImage("./recursos/canon.png");
  balaANI=loadAnimation("./recursos/disparo.png");
  barcoANI=loadAnimation("./recursos/barco_0.png","./recursos/barco_1.png","./recursos/barco_2.png","./recursos/barco_3.png");
  barcobyebyeANI=loadAnimation("./recursos/hundir_barco_00.png","./recursos/hundir_barco_01.png","./recursos/hundir_barco_02.png","./recursos/hundir_barco_03.png","./recursos/hundir_barco_04.png","./recursos/hundir_barco_05.png","./recursos/hundir_barco_06.png","./recursos/hundir_barco_07.png","./recursos/hundir_barco_08.png","./recursos/hundir_barco_09.png","./recursos/hundir_barco_10.png");
  balaAguaANI=loadAnimation("./recursos/sprite_0.png","./recursos/sprite_1.png","./recursos/sprite_2.png","./recursos/sprite_3.png");
  pirataRiendo=loadSound("./recursos/sonido_burla.mp3");
  explosion=loadSound("./recursos/sonido_explosion.mp3");
  chapoteo=loadSound("./recursos/sonido_agua.mp3");
  musicaFondo=loadSound("./recursos/background_music.mp3");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canon=createSprite(height*0.3,height-(height*0.84));
  canon.addImage(canonIMG);
  canon.scale=height*0.1/600;
  canon.rotation=0;
  balasGRP=createGroup();
  base=createSprite(height*0.2,height-(height*0.77));
  base.addImage(baseIMG);
  base.scale=height*0.1/600;
  torre=createSprite(base.x,height-(height*0.45),100,300);
  torre.addImage(torreIMG);
  torre.scale=height*0.5/600;
  barcosGRP=createGroup();
  UP=createImg("./recursos/icons8-up-50.png");
  DOWN=createImg("./recursos/icons8-down-50.png");
  SHOT=createImg("./recursos/icons8-next-page-50.png");
  UP.mouseClicked(upper);
  DOWN.mouseClicked(downner);
  SHOT.mouseClicked(shotter);
  UP.position(width-(width*0.1),height*0.2);
  UP.style.width="100px";
  DOWN.position(width-(width*0.1),height*0.4);
  SHOT.position(width-(width*0.9),height*0.6);
}

function draw() {
  if(game == true){
    image(fondo,0,0,windowWidth,height);
    drawSprites();
    apuntarCanon();
    dispararBala();
    crearBarco();
    balasGRP.overlap(barcosGRP, destruirBarco);
    torre.overlap(barcosGRP, gameOver);
    fill("black");
    textSize(20);
    text("Barcos destruidos: "+barcosDestruidos,1000,40);
    barcosGRP.forEach(barco => {
      if(barco.getAnimationLabel()=="barcobyebyeANI" && barco.animation.getFrame()==barco.animation.getLastFrame()){
        barco.destroy();
        barcosDestruidos++;
      }
    });
    if(!musicaFondo.isPlaying()){
      musicaFondo.play();
      musicaFondo.setVolume(volumen);
  }
  else{
    musicaFondo.setVolume(volumen);
  }
}

function apuntarCanon(){
  if(keyDown(39) && canon.rotation <=85){
    canon.rotation+=1;
  }
  if(keyDown(37) && canon.rotation >=-85){
    canon.rotation-=1;
  }
  }
}

function shotter(){
  bala=createSprite(canon.x-40, canon.y);
  bala.addAnimation("balaANI",balaANI);
  bala.scale=height*0.2/600;
  bala.depth=0;
  bala.tiempo=0;
  bala.angulo=-canon.rotation;
  bala.lifetime=50;
  balasGRP.add(bala);
  bala.setCollider("circle",0,0,130);
  bala.addAnimation("balaAguaANI",balaAguaANI);
  bala.cayo=false;
  if(!explosion.isPlaying()){
    explosion.play();
    explosion.setVolume(volumen);
  }
}

function downner(){
  if( canon.rotation <=85){
    canon.rotation+=1;
  }
}

function upper(){
  if(canon.rotation >=-85){
    canon.rotation-=1;
  }
}

function dispararBala(){
  if((keyDown(70) || keyWentDown(32))){
    bala=createSprite(canon.x-40, canon.y);
    bala.addAnimation("balaANI",balaANI);
    bala.scale=height*0.2/600;
    bala.depth=0;
    bala.tiempo=0;
    bala.angulo=-canon.rotation;
    bala.lifetime=50;
    balasGRP.add(bala);
    bala.setCollider("circle",0,0,130);
    bala.addAnimation("balaAguaANI",balaAguaANI);
    bala.cayo=false;
    if(!explosion.isPlaying()){
      explosion.play();
      explosion.setVolume(volumen);
    }
  }
  for(i = 0; i < balasGRP.length; i++){
    BALA=balasGRP[i];
    x= velocidadInicial*cos(BALA.angulo)*BALA.tiempo;
    y= velocidadInicial*sin(BALA.angulo)*BALA.tiempo-0.5*gravedad*pow(BALA.tiempo,2);
    BALA.x=canon.x+40 + x;
    BALA.y=canon.y - y;
    BALA.tiempo+=1;
    if(BALA.y>=height-(height*0.15)){
      BALA.cayo=true;
      BALA.changeAnimation("balaAguaANI",balaAguaANI);
      BALA.scale=0.4;
      BALA.animation.looping = false;
      if(!chapoteo.isPlaying()){
        chapoteo.play();
        chapoteo.setVolume(volumen);
      }
    }
  if(BALA.cayo==true && BALA.getAnimationLabel() == "balaAguaANI" && BALA.animation.getFrame()==BALA.animation.getLastFrame()){
    BALA.destroy();
    BALA.lifetime=0;
  }
  }

}

function crearBarco(){
  if( frameCount % 180 == 0){
    barcoPirata=createSprite(random(width, width*1.5),height-0.25*height);
    barcoPirata.addAnimation("barcoANI",barcoANI);
    barcoPirata.addAnimation("barcobyebyeANI",barcobyebyeANI);
    barcoPirata.velocityX=-random(2,5);
    barcoPirata.scale=height*0.7/600;
    barcosGRP.add(barcoPirata);
    barcoPirata.setCollider("rectangle",30,100,250,90);
  }
}

function destruirBarco(bala, barcoPirata){
  barcoPirata.changeAnimation("barcobyebyeANI");
  barcoPirata.animation.looping=false;
}

function gameOver(torre, barco){
  barco.destroy();
  swal({
    title: "GAME OVER",
    text: "PERDISTE",
    imageUrl: "./recursos/barco_0.png",
    imageSize: "300x300",
    confirmButtonText: "Jugar de Nuevo"
  }, 
  function (confirmacion){
    location.reload();
  });
  if(!pirataRiendo.isPlaying()){
    pirataRiendo.play();
    pirataRiendo.setVolume(volumen);
  }
}

function start(){
  game=true;
  document.getElementById("starT").style.display="none";
}

function cambiarVolumen(){
  volumen=document.getElementById("volumE").value/100;
  piratasRiendo.setVolume(volumen);
  musicaFondo.setVolume(volumen);
  chapoteo.setVolume(volumen);
  explosion.setVolume(volumen);
}