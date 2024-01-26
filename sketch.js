disparo = false;
const velocidadInicial = 50;
const gravedad = 1.8;
function preload() {
  fondo=loadImage("./recursos/background.gif");
  torreIMG=loadImage("./recursos/torre.png");
  baseIMG=loadImage("./recursos/cañon_base.png");
  canonIMG=loadImage("./recursos/canon.png");
  balaANI=loadAnimation("./recursos/disparo.png");
  barcoANI=loadAnimation("./recursos/barco_0.png","./recursos/barco_1.png","./recursos/barco_2.png","./recursos/barco_3.png");
  barcobyebyeANI=loadAnimation("./recursos/hundir_barco_00.png","./recursos/hundir_barco_01.png","./recursos/hundir_barco_02.png","./recursos/hundir_barco_03.png","./recursos/hundir_barco_04.png","./recursos/hundir_barco_05.png","./recursos/hundir_barco_06.png","./recursos/hundir_barco_07.png","./recursos/hundir_barco_08.png","./recursos/hundir_barco_09.png","./recursos/hundir_barco_10.png");
  balaAguaANI=loadAnimation("./recursos/sprite_0.png","./recursos/sprite_1.png","./recursos/sprite_2.png","./recursos/sprite_3.png");
}

function setup() {
  canvas = createCanvas(1200, 600);
  canon=createSprite(190,100);
  canon.addImage(canonIMG);
  canon.scale=0.1;
  canon.rotation=0;
  balasGRP=createGroup();
  base=createSprite(120,140);
  base.addImage(baseIMG);
  base.scale=0.1;
  torre=createSprite(120,330,100,300);
  torre.addImage(torreIMG);
  torre.scale=0.5;
  barcosGRP=createGroup();
}

function draw() {
  image(fondo,0,0,1200,600);
  drawSprites();
  apuntarCanon();
  dispararBala();
  crearBarco();
  balasGRP.overlap(barcosGRP, destruirBarco);
  torre.overlap(barcosGRP, gameOver);
  
  barcosGRP.forEach(barco => {
    if(barco.getAnimationLabel()=="barcobyebyeANI" && barco.animation.getFrame()==barco.animation.getLastFrame()){
      barco.destroy();
      console.log("Hello World");
    }
  });
}

function apuntarCanon(){
  if(keyDown(39) && canon.rotation <=85){
    canon.rotation+=1;
  }
  if(keyDown(37) && canon.rotation >=-85){
    canon.rotation-=1;
  }
}

function dispararBala(){
  if((keyDown(70) || keyWentDown(32))){
    bala=createSprite(canon.x, canon.y);
    bala.addAnimation("balaANI",balaANI);
    bala.scale=0.2;
    bala.depth=0;
    bala.tiempo=0;
    bala.angulo=-canon.rotation;
    bala.lifetime=50;
    balasGRP.add(bala);
    bala.setCollider("circle",0,0,130);
    bala.addAnimation("balaAguaANI",balaAguaANI);
    bala.cayo=false;
  }
  for(i = 0; i < balasGRP.length; i++){
    BALA=balasGRP[i];
    x= velocidadInicial*cos(BALA.angulo)*BALA.tiempo;
    y= velocidadInicial*sin(BALA.angulo)*BALA.tiempo-0.5*gravedad*pow(BALA.tiempo,2);
    BALA.x=canon.x+40 + x;
    BALA.y=canon.y - y;
    BALA.tiempo+=1;
    if(BALA.y>=530){
      BALA.cayo=true;
      BALA.changeAnimation("balaAguaANI",balaAguaANI);
      BALA.scale=0.4;
      BALA.animation.looping = false;
  
    }
  if(BALA.cayo==true && BALA.getAnimationLabel() == "balaAguaANI" && BALA.animation.getFrame()==BALA.animation.getLastFrame()){
    BALA.destroy();
    BALA.lifetime=0;
  }
  }

}

function crearBarco(){
  if( frameCount % 180 == 0){
    barcoPirata=createSprite(random(1400, 1700),450);
    barcoPirata.addAnimation("barcoANI",barcoANI);
    barcoPirata.addAnimation("barcobyebyeANI",barcobyebyeANI);
    barcoPirata.velocityX=-random(2,5);
    barcoPirata.scale=0.7;
    barcosGRP.add(barcoPirata);
    barcoPirata.debug=true;
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
  });
}