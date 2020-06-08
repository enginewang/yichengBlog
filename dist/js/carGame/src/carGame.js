let scene,
    camera, controls, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
    renderer, container;
let keyboard = new THREEx.KeyboardState();
let hemisphereLight, shadowLight;
let clock = new THREE.Clock;
let car, ground;
let trees = [];
let coins = [];
let holes = [];
let pickBomb = [];
let hearts = [];
let clouds = [];
let otherCars = [];
let otherCarsSpeed = [];
let bombList = [];
let bombNum = 2;
let isThrowingBomb = false;
let speed = 1;
let HP = 100;
let lines = [];
let endLine;
let level1UI, level2UI;
let bombUI;
let HPTextUI;
let HPBarUI;
let roadUI;
let carUI;
let coinNum = [0, 0, 0];
let time = 0;
let level = 0;
let coinUI;
let cl;
let clScale = 1;
let clExist = 0;
let gameOverUI;
let gameWinUI;
let isOver = 0;
let isWin = 0;
let isAccelerate = false;
let isChangingGround = false;
let isPlayingAcc = false;
let Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0,
    ground: 0x654321,
    green: 0x96ceb4,
    gold: 0xffd700,
    road: 0x222222,
    black: 0x050505,
    light: 0xfff48f,
};

let groundColorId = 0;
let groundColor = [0x654321, 0x66cc66, 0x077fff, 0xff6100];

if (!localStorage['bestScore']) {
    localStorage.setItem("bestScore", "0");
}

function clickStart() {
    document.getElementById("game").innerHTML = "";
    setTimeout(init, 200)
}

let Tree = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "tree";

    let foliageGeom = new THREE.DodecahedronGeometry(14);
    let foliageMat = new THREE.MeshPhongMaterial({color: Colors.green, shading: THREE.FlatShading});
    let foliage = new THREE.Mesh(foliageGeom, foliageMat);
    this.mesh.add(foliage);
    foliage.position.y = 60;
    foliage.rotation.y = Math.random() * Math.PI;
    foliage.castShadow = true;

    let foliageGeom2 = new THREE.DodecahedronGeometry(24);
    let foliage2 = new THREE.Mesh(foliageGeom2, foliageMat);
    this.mesh.add(foliage2);
    foliage2.position.y = 35;
    foliage2.rotation.y = Math.random() * Math.PI;
    foliage2.castShadow = true;

    let trunkGeom = new THREE.CylinderGeometry(Math.abs(Math.random() * 3) + 1, Math.abs(Math.random() * 5) + 3, 100);
    let trunkMat = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
    let trunk = new THREE.Mesh(trunkGeom, trunkMat);
    this.mesh.add(trunk);
    trunk.castShadow = true;
};

let Bomb = function (color) {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "bomb";

    let bodyGeom = new THREE.SphereBufferGeometry(8);
    let bodyMat = new THREE.MeshPhongMaterial({color: color, shading: THREE.FlatShading});
    let body = new THREE.Mesh(bodyGeom, bodyMat);
    this.mesh.add(body);
    body.castShadow = true;

    let leadGeom = new THREE.CylinderGeometry(1, 1, 10);
    let leadMat = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
    let lead = new THREE.Mesh(leadGeom, leadMat);
    this.mesh.add(lead);
    lead.position.set(10, 0, 0);
    lead.rotation.z = Math.PI / 2;
    lead.castShadow = true;
};

let Coin = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "coin";

    let coinGeom = new THREE.CylinderBufferGeometry(5, 5, 1, 16);
    let coinMat = new THREE.MeshPhongMaterial({color: Colors.gold, shading: THREE.FlatShading});

    let coin = new THREE.Mesh(coinGeom, coinMat);
    this.mesh.add(coin);
    coin.position.y = -20;
    coin.rotation.x = Math.PI / 2;
    coin.castShadow = true;
};

let Hole = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "hole";

    let holeGeom = new THREE.CylinderBufferGeometry(20, 20, 1, 16);
    let holeMat = new THREE.MeshPhongMaterial({color: Colors.black, shading: THREE.FlatShading});

    let hole = new THREE.Mesh(holeGeom, holeMat);
    this.mesh.add(hole);
    //hole.position.y = 5;
    //hole.rotation.x = Math.PI / 2;
    hole.castShadow = true;
};

let CrashLight = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "crashLight";

    var clGeometry = new THREE.SphereGeometry(12, 12, 12);
    var clMat = new THREE.MeshPhongMaterial({
        color: Colors.light,
        shading: THREE.FlatShading,
        transparent: true,
        opacity: .8,
    });

    let crashLight = new THREE.Mesh(clGeometry, clMat);
    this.mesh.add(crashLight);
};

let Heart = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "heart";

    var heartGeometry = new THREE.IcosahedronGeometry(7, 1);
    var heartMat = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});

    let heart = new THREE.Mesh(heartGeometry, heartMat);
    this.mesh.add(heart);
    heart.position.y = -20;
    heart.rotation.x = Math.PI;
    heart.castShadow = true;
};

let Car = function (color) {
    this.mesh = new THREE.Object3D();

    let bodyMat = new THREE.MeshPhongMaterial({color: color, shading: THREE.FlatShading});
    let bodyGeom = new THREE.BoxGeometry(50, 30, 80, 1, 1, 1);
    let body = new THREE.Mesh(bodyGeom, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    //Protector
    let wheelProtectGeom = new THREE.BoxGeometry(8, 12, 25, 1, 1, 1);
    let wheelProtectMat = new THREE.MeshPhongMaterial({color: color, shading: THREE.FlatShading});
    let wheelProtect = new THREE.Mesh(wheelProtectGeom, wheelProtectMat);
    wheelProtect.receiveShadow = true;
    wheelProtectGeom.vertices[1].z += 5;
    wheelProtectGeom.vertices[4].z += 5;
    wheelProtectGeom.vertices[5].z -= 5;
    wheelProtectGeom.vertices[0].z -= 5;

    let wheelProtectFL = wheelProtect.clone();
    wheelProtectFL.position.set(25, -12, 20);
    this.mesh.add(wheelProtectFL);

    let wheelProtectFR = wheelProtect.clone();
    wheelProtectFR.position.set(-25, -12, 20);
    this.mesh.add(wheelProtectFR);

    let wheelProtectBL = wheelProtect.clone();
    wheelProtectBL.position.set(25, -12, -20);
    this.mesh.add(wheelProtectBL);

    let wheelProtectBR = wheelProtect.clone();
    wheelProtectBR.position.set(-25, -12, -20);
    this.mesh.add(wheelProtectBR);

    let wheelTireGeom = new THREE.CylinderGeometry(10, 10, 4);
    let wheelTireMat = new THREE.MeshPhongMaterial({color: Colors.brownDark, shading: THREE.FlatShading});
    let wheelTire = new THREE.Mesh(wheelTireGeom, wheelTireMat);
    wheelTire.castShadow = true;

    let wheelTireFL = wheelTire.clone();
    wheelTireFL.position.set(25, -18, 20);
    wheelTireFL.rotation.z = Math.PI / 2;
    this.mesh.add(wheelTireFL);

    let wheelTireFR = wheelTire.clone();
    wheelTireFR.position.set(-25, -18, 20);
    wheelTireFR.rotation.z = Math.PI / 2;
    this.mesh.add(wheelTireFR);

    let wheelTireBL = wheelTire.clone();
    wheelTireBL.position.set(25, -18, -20);
    wheelTireBL.rotation.z = Math.PI / 2;
    this.mesh.add(wheelTireBL);

    let wheelTireBR = wheelTire.clone();
    wheelTireBR.position.set(-25, -18, -20);
    wheelTireBR.rotation.z = Math.PI / 2;
    this.mesh.add(wheelTireBR);

    //Windshield
    let geomWindshield = new THREE.BoxGeometry(3, 20, 45, 1, 1, 1);
    let matWindshield = new THREE.MeshPhongMaterial({
        color: Colors.white,
        transparent: true,
        opacity: .3,
        shading: THREE.FlatShading
    });
    let windshield = new THREE.Mesh(geomWindshield, matWindshield);
    windshield.position.set(0, 20, 30);
    windshield.rotation.y = Math.PI / 2;
    windshield.castShadow = true;
    windshield.receiveShadow = true;
    this.mesh.add(windshield);

    //Bumper
    let bumperGeom = new THREE.BoxGeometry(55, 6, 6);
    let bumperMat = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
    let bumper = new THREE.Mesh(bumperGeom, bumperMat);
    bumper.receiveShadow = true;

    let frontBumper = bumper.clone();
    frontBumper.position.set(0, -14, 40);
    this.mesh.add(frontBumper);

    let backBumper = bumper.clone();
    backBumper.position.set(0, -14, -40);
    this.mesh.add(backBumper);

    //Number Plate
    let numberPlateGeom = new THREE.BoxGeometry(12, 10, 2);
    let numberPlateMat = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
    let numberPlate = new THREE.Mesh(numberPlateGeom, numberPlateMat);
    numberPlate.receiveShadow = true;
    this.mesh.add(numberPlate);
    numberPlate.position.set(0, -5, -40);

    //lights
    let lightsGeom = new THREE.BoxGeometry(6, 8, 2);
    let lightsMat = new THREE.MeshPhongMaterial({color: Colors.pink, shading: THREE.FlatShading});
    let lights = new THREE.Mesh(lightsGeom, lightsMat);
    lights.receiveShadow = true;

    let backLightsL = lights.clone();
    this.mesh.add(backLightsL);
    backLightsL.position.set(-20, 10, -40);

    let backLightsR = lights.clone();
    this.mesh.add(backLightsR);
    backLightsR.position.set(20, 10, -40);

    let frontLightsL = lights.clone();
    this.mesh.add(frontLightsL);
    frontLightsL.position.set(-20, 10, 40);

    let frontLightsR = lights.clone();
    this.mesh.add(frontLightsR);
    frontLightsR.position.set(20, 10, 40);

    //engine vent
    let engineVentGeom = new THREE.BoxGeometry(40, 2, 1);
    let engineVentMat = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
    let engineVent = new THREE.Mesh(engineVentGeom, engineVentMat);

    let engineVentT = engineVent.clone();
    this.mesh.add(engineVentT);
    engineVentT.position.set(0, 0, 40);

    let engineVentM = engineVent.clone();
    this.mesh.add(engineVentM);
    engineVentM.position.set(0, -3, 40);

    let engineVentB = engineVent.clone();
    this.mesh.add(engineVentB);
    engineVentB.position.set(0, -6, 40);
};

let Cloud = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";

    let geom = new THREE.DodecahedronGeometry(20);
    let mat = new THREE.MeshPhongMaterial({color: Colors.white});

    let nBlocs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocs; i++) {
        let m = new THREE.Mesh(geom.clone(), mat);
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;
        let s = 0.1 + Math.random() * 0.9;
        m.scale.set(s, s, s);
        this.mesh.add(m);
        m.castShadow = true;
    }
};

Cloud.prototype.rotate = function () {
    let l = this.mesh.children.length;
    for (let i = 0; i < l; i++) {
        let m = this.mesh.children[i];
        m.rotation.z += Math.random() * 0.005 * (i + 1);
        m.rotation.y += Math.random() * 0.002 * (i + 1);
    }
};

//window.addEventListener('load', init, false);

function checkDeath() {
    //console.log("checkDeath");
    if (HP <= 0 && isOver === 0) {
        HP = 0;
        updateHPUI();
        isOver = 1;
        playLoseAudio();
        createGameOverUI();
        setTimeout(function () {
            location.href = "lose.html";
        }, 5000)
    }
}

function checkWin() {
    //console.log("checkWin");
    if (endLine.mesh.position.z > 20 && isWin === 0) {
        isWin = 1;
        playWinAudio();
        localStorage.setItem("score", coinNum[0].toString());
        if (parseInt(localStorage["bestScore"]) < coinNum[0]) {
            localStorage.setItem("bestScore", coinNum[0].toString());
        }
        createGameWinUI();
        setTimeout(function () {
            location.href = "win.html";
        }, 5000)
    }
}

function init() {
    playBGMAudio();
    playStartAudio();
    createScene();
    createLights();
    createCar();
    createGround();
    createRoad();
    createLines();
    createEndLine();
    createTrees();
    createSky();
    createCoin();
    createHole();
    createCoinUI();
    createBombUI();
    createHeart();
    createPickBomb();
    createHPUI();
    createHPBarUI();
    createRoadUI();
    createOtherCars();
    setInterval(checkDeath, 1000);
    setInterval(checkWin, 1000);
    tick();
}


function playBGMAudio() {
    var audio = new Audio('media/bgm.mp3');
    audio.play();
}

function playStartAudio() {
    var audio = new Audio('media/start.mp3');
    audio.play();
}

function playReadyGoAudio() {
    var audio = new Audio('media/readygo.mp3');
    audio.play();
}

function playCrashAudio() {
    var audio = new Audio('media/crash.mp3');
    audio.play();
}

function playGetHeartAudio() {
    var audio = new Audio('media/getHeart.mp3');
    audio.play();
}

function playGetBombAudio() {
    var audio = new Audio('media/getBomb.mp3');
    audio.play();
}

function playGetCoinAudio() {
    var audio = new Audio('media/getCoin.mp3');
    audio.play();
}

function playBombBloomAudio() {
    var audio = new Audio('media/bombBloom.mp3');
    audio.play();
}

function playReleaseBombAudio() {
    var audio = new Audio('media/releaseBomb.mp3');
    audio.play();
}

function playNoBombAudio() {
    var audio = new Audio('media/noBomb.mp3');
    audio.play();
}

function playAccelerateAudio() {
    if (!isPlayingAcc){
        var audio = new Audio('media/accelerate.mp3');
        audio.play();
        isPlayingAcc = true;
        setTimeout(function () {
            isPlayingAcc = false;
        },5000)
    }
}

function playWinAudio() {
    var audio = new Audio('media/win.mp3');
    audio.play();
}

function playLoseAudio() {
    var audio = new Audio('media/lose.mp3');
    audio.play();
}


function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xf7d9aa, 10, 950);

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 2000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('game');
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, container);

    window.addEventListener('resize', handleWindowResize, false);
}




function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function createCar() {
    car = new Car(Colors.red);
    car.mesh.scale.set(0.5, 0.5, 0.5);
    car.mesh.position.y = 14;
    car.mesh.position.z = 60;
    car.mesh.rotation.y = Math.PI;

    scene.add(car.mesh);
}


function createBomb() {
    var bomb = new Bomb(Colors.brownDark);
    bomb.mesh.position.y = car.mesh.position.y;
    bomb.mesh.position.z = car.mesh.position.z - 22;
    bomb.mesh.position.x = car.mesh.position.x;
    bombList.push(bomb);
    scene.add(bomb.mesh);
}

function createOtherCars() {
    var distance = -300;
    for (let i = 0; i < 20; i++) {
        let otherCar = new Car(Colors.blue);
        scene.add(otherCar.mesh);
        otherCar.mesh.position.x = Math.random() * -120 + 60;
        otherCar.mesh.position.z = distance + Math.random() * 200;
        otherCar.mesh.scale.set(0.5, 0.5, 0.5);
        otherCar.mesh.position.y = 14;
        otherCar.mesh.rotation.y = Math.PI;
        let speed = 0.33;
        //console.log(distance);
        console.log(otherCar.mesh.position.z);
        distance -= 300;
        otherCars.push(otherCar);
        otherCarsSpeed.push(speed);
    }
    //console.log(otherCars);
}

function createGround() {
    ground = new THREE.Object3D();
    let groundGeom = new THREE.PlaneGeometry(2 * WIDTH, 2 * WIDTH, 1, 1);
    console.log(groundColor[groundColorId])
    let groundMat = new THREE.MeshPhongMaterial({
        color: groundColor[groundColorId],
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });
    ground.mesh = new THREE.Mesh(groundGeom, groundMat);
    ground.receiveShadow = true;
    scene.add(ground.mesh);
    ground.mesh.position.y = 0;
    ground.mesh.rotation.x = -Math.PI / 2;
}

function createRoad() {
    let road = new THREE.Object3D();
    let roadMaterial = new THREE.MeshBasicMaterial({color: 0x222222, side: THREE.DoubleSide});
    let roadGeometry = new THREE.CubeGeometry(200, 2 * WIDTH, 1, 10);
    road.mesh = new THREE.Mesh(roadGeometry, roadMaterial);
    road.mesh.rotation.x = Math.PI / 2;
    road.mesh.position.y = 1;
    scene.add(road.mesh);
}

function createLines() {
    let Lline = new THREE.Object3D();
    let LlineGeom = new THREE.PlaneGeometry(8, 2 * WIDTH, 1, 1);
    let LlineMat = new THREE.MeshPhongMaterial({
        color: Colors.white,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });
    Lline.mesh = new THREE.Mesh(LlineGeom, LlineMat);
    Lline.mesh.position.y = 3;
    Lline.mesh.position.x = -80;
    Lline.mesh.rotation.x = Math.PI / 2;
    scene.add(Lline.mesh);

    let Rline = new THREE.Object3D();
    Rline.mesh = new THREE.Mesh(LlineGeom, LlineMat);
    Rline.mesh.position.y = 3;
    Rline.mesh.position.x = 80;
    Rline.mesh.rotation.x = Math.PI / 2;
    scene.add(Rline.mesh);

    let lineGeom = new THREE.PlaneGeometry(6, 45, 1, 1);
    let lineMat = new THREE.MeshPhongMaterial({
        color: Colors.white,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });

    var distance = 1000;
    for (let i = 0; i < 60; i++) {
        let line = new THREE.Object3D();
        line.mesh = new THREE.Mesh(lineGeom, lineMat);
        if (i % 2 === 0) {
            line.mesh.position.x = 45;
        } else {
            line.mesh.position.x = -45;
        }
        line.mesh.position.z = distance;
        line.mesh.position.y = 5;
        line.mesh.rotation.x = Math.PI / 2;
        if (i % 2 === 1) {
            distance -= 100;
        }
        lines.push(line);
        scene.add(line.mesh);
    }

}

function createEndLine() {
    endLine = new THREE.Object3D();
    let endLineGeom = new THREE.PlaneGeometry(200, 30, 1, 10);
    let endLineMat = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });
    endLine.mesh = new THREE.Mesh(endLineGeom, endLineMat);
    endLine.mesh.position.y = 8;
    endLine.mesh.rotation.x = Math.PI / 2;
    endLine.mesh.position.z = -8000;
    scene.add(endLine.mesh);
}


function createTrees() {
    for (let i = 0; i < 30; i++) {
        let max = WIDTH / 3;
        let min = -WIDTH / 4;
        let tree = new Tree();
        scene.add(tree.mesh);
        tree.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
        tree.mesh.position.y = 35;
        tree.mesh.position.z = Math.floor(Math.random() * -1800);

        if (tree.mesh.position.x > 0) {
            tree.mesh.position.x += 140;
        } else {
            tree.mesh.position.x -= 140;
        }

        trees.push(tree);
    }
}

function createCoin() {
    var distance = -400;
    for (let i = 0; i < 20; i++) {
        let coin = new Coin();
        scene.add(coin.mesh);
        coin.mesh.position.x = Math.random() * -160 + 80;
        coin.mesh.position.y = 35;
        coin.mesh.position.z = distance + Math.random() * 200;
        distance -= 400;
        coins.push(coin);
    }
}

function createPickBomb() {
    var distance = -800;
    for (let i = 0; i < 5; i++) {
        let pbomb = new Bomb(Colors.brown);
        scene.add(pbomb.mesh);
        pbomb.mesh.position.x = Math.random() * -160 + 80;
        pbomb.mesh.position.y = 10;
        pbomb.mesh.position.z = distance + Math.random() * 200;
        distance -= 800;
        pickBomb.push(pbomb);
    }
}

function createHole() {
    var distance = -700;
    for (let i = 0; i < 6; i++) {
        let hole = new Hole();
        scene.add(hole.mesh);
        hole.mesh.position.x = Math.random() * -120 + 60;
        hole.mesh.position.y = 6;
        hole.mesh.position.z = distance + Math.random() * 200;
        distance -= 400;
        holes.push(hole);
    }
    //console.log(holes);
}

function createHeart() {
    var distance = -1000;
    for (let i = 0; i < 6; i++) {
        let heart = new Heart();
        scene.add(heart.mesh);
        heart.mesh.position.x = Math.random() * (-160) + 80;
        heart.mesh.position.y = 35;
        heart.mesh.position.z = distance + Math.random() * 500;
        distance -= 1100;
        hearts.push(heart);
    }
}

function createCoinUI() {
    const loader = new THREE.FontLoader();
    loader.load('js/lib/helvetiker_regular.typeface.json', (font) => {
        let text = 'Coin:' + coinNum[level].toString();
        coinUI = new THREE.Object3D();
        let CoinUIgeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 42,
            height: 1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5,
        });
        let CoinUIMat = new THREE.MeshPhongMaterial({
            color: Colors.gold,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
        });
        coinUI.mesh = new THREE.Mesh(CoinUIgeometry, CoinUIMat);
        coinUI.receiveShadow = true;
        scene.add(coinUI.mesh);
        coinUI.mesh.position.y = 80;
        coinUI.mesh.position.x = 120;
        coinUI.mesh.rotation.y = -0.15;
        coinUI.mesh.position.z = -300;
    });
}

function createBombUI() {
    var bombLabel = new Bomb(Colors.black);
    bombLabel.mesh.scale.set(3, 3, 3);
    scene.add(bombLabel.mesh);
    bombLabel.mesh.rotation.x = Math.PI / 2;
    bombLabel.mesh.rotation.y = -1.2 * Math.PI;
    bombLabel.mesh.position.y = 35;
    bombLabel.mesh.position.x = 150;
    bombLabel.mesh.position.z = -300;

    const loader = new THREE.FontLoader();
    loader.load('js/lib/helvetiker_regular.typeface.json', (font) => {
        let text = ":" + bombNum.toString();
        bombUI = new THREE.Object3D();
        let BombUIgeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 42,
            height: 1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5,
        });
        let BombUIMat = new THREE.MeshPhongMaterial({
            color: Colors.brownDark,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
        });
        bombUI.mesh = new THREE.Mesh(BombUIgeometry, BombUIMat);
        bombUI.receiveShadow = true;
        scene.add(bombUI.mesh);
        bombUI.mesh.position.y = 25;
        bombUI.mesh.position.x = 190;
        bombUI.mesh.rotation.y = -0.15;
        bombUI.mesh.position.z = -300;
    });
}

function createLevel1UI() {
    const loader = new THREE.FontLoader();
    loader.load('js/lib/helvetiker_regular.typeface.json', (font) => {
        let text = 'LEVEL 1';
        level1UI = new THREE.Object3D();
        let level1UIgeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 36,
            height: 1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5,
        });
        let level1UIMat = new THREE.MeshPhongMaterial({
            color: Colors.blue,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
        });
        level1UI.mesh = new THREE.Mesh(level1UIgeometry, level1UIMat);
        level1UI.receiveShadow = true;
        scene.add(level1UI.mesh);
        level1UI.mesh.position.y = 80;
        level1UI.mesh.position.x = -400;
        level1UI.mesh.rotation.y = 0.15;
        level1UI.mesh.position.z = -300;
    });
}


function createHPUI() {
    const loader = new THREE.FontLoader();
    loader.load('js/lib/helvetiker_regular.typeface.json', (font) => {
        let text = 'HP';
        HPTextUI = new THREE.Object3D();
        let HPTextUIgeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 36,
            height: 1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5,
        });
        let HPTextUIMat = new THREE.MeshPhongMaterial({
            color: Colors.red,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
        });
        HPTextUI.mesh = new THREE.Mesh(HPTextUIgeometry, HPTextUIMat);
        HPTextUI.receiveShadow = true;
        scene.add(HPTextUI.mesh);
        HPTextUI.mesh.position.y = 60;
        HPTextUI.mesh.position.x = -400;
        HPTextUI.mesh.rotation.y = 0.15;
        HPTextUI.mesh.position.z = -300;
    });
}

function createHPBarUI() {
    var HPBarBackUI = new THREE.Object3D();
    let HPBarBackUIGeo = new THREE.CubeGeometry(200, 30, 3);
    let HPBarBackUIMat = new THREE.MeshPhongMaterial({
        color: '#aaaaaa',
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });
    HPBarBackUI.mesh = new THREE.Mesh(HPBarBackUIGeo, HPBarBackUIMat);
    scene.add(HPBarBackUI.mesh);
    HPBarBackUI.mesh.position.y = 80;
    HPBarBackUI.mesh.position.x = -220;
    HPBarBackUI.mesh.position.z = -300;

    var HPWidth = 2 * HP;

    HPBarUI = new THREE.Object3D();
    let HPBarUIGeo = new THREE.CubeGeometry(HPWidth, 30, 3);
    let HPBarUIMat = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });
    HPBarUI.mesh = new THREE.Mesh(HPBarUIGeo, HPBarUIMat);
    scene.add(HPBarUI.mesh);
    HPBarUI.mesh.position.y = 80;
    HPBarUI.mesh.position.x = -320 + HP;
    //carUI.mesh.position.x = -215;
    HPBarUI.mesh.position.z = -290;
}


function createRoadUI() {
    roadUI = new THREE.Object3D();
    let roadUIGeo = new THREE.CubeGeometry(180, 10, 3);
    let roadUIMat = new THREE.MeshPhongMaterial({
        color: Colors.road,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });
    roadUI.mesh = new THREE.Mesh(roadUIGeo, roadUIMat);
    scene.add(roadUI.mesh);
    roadUI.mesh.position.y = 120;
    roadUI.mesh.position.x = -300;
    roadUI.mesh.position.z = -300;

    carUI = new THREE.Object3D();
    let carUIGeo = new THREE.CubeGeometry(20, 10, 3);
    let carUIMat = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });
    carUI.mesh = new THREE.Mesh(carUIGeo, carUIMat);
    scene.add(carUI.mesh);
    carUI.mesh.position.y = 120;
    carUI.mesh.position.x = -375;
    //carUI.mesh.position.x = -215;
    carUI.mesh.position.z = -290;
}

function createSky() {
    for (let i = 0; i < 10; i++) {
        let max = WIDTH / 2;
        let min = -WIDTH / 2;

        let cloud = new Cloud();
        scene.add(cloud.mesh);
        cloud.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
        cloud.mesh.position.y = 250;
        cloud.mesh.position.z = Math.floor(Math.random() * -700);

        clouds.push(cloud);
    }
}


function createGameOverUI() {
    var GameOverBack = new THREE.Object3D();
    let GameOverBackGeo = new THREE.CubeGeometry(160, 100, 3);
    let GameOverBackMat = new THREE.MeshPhongMaterial({
        color: '#aaaaaa',
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true,
    });
    GameOverBack.mesh = new THREE.Mesh(GameOverBackGeo, GameOverBackMat);
    scene.add(GameOverBack.mesh);
    GameOverBack.mesh.position.y = 40;
    GameOverBack.mesh.rotation.x = -Math.PI / 10;
    GameOverBack.mesh.position.x = 0;
    GameOverBack.mesh.position.z = 80;

    var GameOverBtn = new THREE.Object3D();
    let GameOverBtnGeo = new THREE.CubeGeometry(50, 18, 3);
    let GameOverBtnMat = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true,
    });
    GameOverBtn.mesh = new THREE.Mesh(GameOverBtnGeo, GameOverBtnMat);
    scene.add(GameOverBtn.mesh);
    GameOverBtn.mesh.position.y = 22;
    GameOverBtn.mesh.rotation.x = -Math.PI / 10;
    GameOverBtn.mesh.position.x = 0;
    GameOverBtn.mesh.position.z = 88;

    const loader = new THREE.FontLoader();
    loader.load('js/lib/helvetiker_regular.typeface.json', (font) => {
        let text = 'Game Over';
        var GameOverText = new THREE.Object3D();
        let GameOverTextgeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 10,
            height: 1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5,
        });
        let GameOverTextMat = new THREE.MeshPhongMaterial({
            color: Colors.black,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
        });
        GameOverText.mesh = new THREE.Mesh(GameOverTextgeometry, GameOverTextMat);
        GameOverText.receiveShadow = true;
        scene.add(GameOverText.mesh);
        GameOverText.mesh.position.y = 60;
        GameOverText.mesh.position.x = -36;
        GameOverText.mesh.rotation.x = -Math.PI / 10;
        GameOverText.mesh.position.z = 76;
    });

    const loader2 = new THREE.FontLoader();
    loader2.load('js/lib/helvetiker_regular.typeface.json', (font) => {
        let text = 'Restart';
        var GameOverBtnText = new THREE.Object3D();
        let GameOverBtnTextgeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 8,
            height: 1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5,
        });
        let GameOverBtnTextMat = new THREE.MeshPhongMaterial({
            color: Colors.white,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
        });
        GameOverBtnText.mesh = new THREE.Mesh(GameOverBtnTextgeometry, GameOverBtnTextMat);
        GameOverBtnText.receiveShadow = true;
        scene.add(GameOverBtnText.mesh);
        GameOverBtnText.mesh.position.y = 20;
        GameOverBtnText.mesh.position.x = -18;
        GameOverBtnText.mesh.rotation.x = -Math.PI / 10;
        GameOverBtnText.mesh.position.z = 92;
    });
}


function createGameWinUI() {
    var GameWinBack = new THREE.Object3D();
    let GameWinBackGeo = new THREE.CubeGeometry(160, 100, 3);
    let GameWinBackMat = new THREE.MeshPhongMaterial({
        color: '#aaaaaa',
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true,
    });
    GameWinBack.mesh = new THREE.Mesh(GameWinBackGeo, GameWinBackMat);
    scene.add(GameWinBack.mesh);
    GameWinBack.mesh.position.y = 40;
    GameWinBack.mesh.rotation.x = -Math.PI / 10;
    GameWinBack.mesh.position.x = 0;
    GameWinBack.mesh.position.z = 80;
    const loader = new THREE.FontLoader();
    loader.load('js/lib/helvetiker_regular.typeface.json', (font) => {
        let text = 'You WIN!';
        var GameWinText = new THREE.Object3D();
        let GameWinTextgeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 10,
            height: 1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5,
        });
        let GameWinTextMat = new THREE.MeshPhongMaterial({
            color: Colors.red,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
        });
        GameWinText.mesh = new THREE.Mesh(GameWinTextgeometry, GameWinTextMat);
        GameWinText.receiveShadow = true;
        scene.add(GameWinText.mesh);
        GameWinText.mesh.position.y = 60;
        GameWinText.mesh.position.x = -30;
        GameWinText.mesh.rotation.x = -Math.PI / 10;
        GameWinText.mesh.position.z = 76;
    });
}


function tick() {
    let carSpeed = 100 * clock.getDelta();
    //time += 1;
    controls.update();

    /*
    if (coinUI !== undefined){
        coinUI.mesh.position.y = 80 + 4 * Math.sin(Math.PI * 0.01 * time);
    }
    if (level1UI !== undefined){
        level1UI.mesh.position.y = 80 + 4 * Math.sin(Math.PI * 0.01 * time);
    }
    */

    if (clExist) {
        clScale += 0.1;
        cl.mesh.scale.set(clScale, clScale, clScale);
    } else {
        clScale = 1;
    }

    if (carUI.mesh.position.x < -215) {
        carUI.mesh.position.x += 0.02*speed;
    }
    endLine.mesh.position.z += speed;
    trees.forEach(function (tree) {
        tree.mesh.position.z += speed;
        if (tree.mesh.position.z > 500)
            tree.mesh.position.z = -2000;
    });

    lines.forEach(function (line) {
        line.mesh.position.z += speed;
        if (line.mesh.position.z > 1000)
            line.mesh.position.z = -2000;
    });

    for (var i = 0; i < coins.length; i++) {
        var coin = coins[i];
        if (collisionPlayer(coin.mesh.position.x, coin.mesh.position.z, 15, 20)) {
            coins.splice(i, 1);
            scene.remove(coin.mesh);
            coinNum[level] += 1;
            playGetCoinAudio();

            updateCoinUI();
        } else if (coin.mesh.position.z < 200) {
            coin.mesh.position.z += speed;
            coin.mesh.rotation.y += 0.05;
        } else {
            scene.remove(coin.mesh);
        }
    }

    for (var i = 0; i < hearts.length; i++) {
        var heart = hearts[i];
        if (collisionPlayer(heart.mesh.position.x, heart.mesh.position.z, 15, 20)) {
            hearts.splice(i, 1);
            scene.remove(heart.mesh);
            if (HP >= 90) {
                HP = 100;
                updateHPUI();
            }
            else{
                HP += 10;
                updateHPUI();
            }
            playGetHeartAudio();

        } else if (heart.mesh.position.z < 200) {
            heart.mesh.position.z += speed;
            heart.mesh.rotation.y += 0.05;
        } else {
            scene.remove(heart.mesh);
        }
    }

    for (var i = 0; i < pickBomb.length; i++) {
        var pbomb = pickBomb[i];
        if (collisionPlayer(pbomb.mesh.position.x, pbomb.mesh.position.z, 10, 10)) {
            pickBomb.splice(i, 1);
            scene.remove(pbomb.mesh);
            bombNum += 1;
            playGetBombAudio();
            updateBombUI();
            //console.log(bombNum);
            //updateBombUI();
        } else if (pbomb.mesh.position.z < 200) {
            pbomb.mesh.position.z += speed;
            pbomb.mesh.rotation.y += 0.05;
        } else {
            scene.remove(pbomb.mesh);
        }
    }

    for (var i = 0; i < holes.length; i++) {
        var hole = holes[i];
        if (hole.mesh.position.z < 200) {
            hole.mesh.position.z += speed;
            if (collisionPlayer(hole.mesh.position.x, hole.mesh.position.z, 15, 15)) {
                //holes.splice(i, 1);
                //console.log("Hole!");
                HP -= 0.2;
                updateHPUI();
            }
        } else {
            scene.remove(hole.mesh);
        }
    }


    clouds.forEach(function (cloud) {
        cloud.mesh.position.z += speed / 2;
        if (cloud.mesh.position.z > 500)
            cloud.mesh.position.z = -2000;
    });

    bombList.forEach(function (bomb) {
        bomb.mesh.position.z -= 0.5 * speed;
        bomb.mesh.rotation.y += 0.02;
    });

    for (let j = 0; j < otherCars.length; j++) {
        let otherCar = otherCars[j];
        if (collisionPlayer(otherCar.mesh.position.x, otherCar.mesh.position.z, 20, 40)) {
            cl = new CrashLight();
            clExist = 1;
            scene.add(cl.mesh);
            cl.mesh.position.x = otherCar.mesh.position.x;
            cl.mesh.position.y = otherCar.mesh.position.y;
            cl.mesh.position.z = otherCar.mesh.position.z;
            otherCars.splice(j, 1);
            playCrashAudio();
            scene.remove(otherCar.mesh);
            HP -= 20;
            updateHPUI();
            setTimeout(function () {
                scene.remove(cl.mesh);
                clScale = 1;
                clExist = 0;
            }, 600)
            //updateUI();
        } else if (otherCar.mesh.position.z < 200) {
            otherCar.mesh.position.z += otherCarsSpeed[j] * speed;
            if (bombList.length > 0) {
                for (var b = 0; b < bombList.length; b++) {
                    var bomb = bombList[b];
                    if (collision(otherCar.mesh.position.x, otherCar.mesh.position.z, bomb.mesh.position.x, bomb.mesh.position.z, 10, 10)) {
                        cl = new CrashLight();
                        clExist = 1;
                        scene.add(cl.mesh);
                        cl.mesh.position.x = otherCar.mesh.position.x;
                        cl.mesh.position.y = otherCar.mesh.position.y;
                        cl.mesh.position.z = otherCar.mesh.position.z;
                        playBombBloomAudio();
                        scene.remove(bomb.mesh);
                        otherCars.splice(j, 1);
                        bombList.splice(b, 1);
                        scene.remove(otherCar.mesh);
                        setTimeout(function () {
                            scene.remove(cl.mesh);
                            clScale = 1;
                            clExist = 0;
                        }, 600)

                    }
                }
            }
            //otherCar.mesh.rotation.y += 0.05;
        } else {
            scene.remove(otherCar.mesh);
        }
    }

    if (keyboard.pressed("left") || keyboard.pressed("A")) {
        if (car.mesh.position.x > -85) {
            car.mesh.position.x -= carSpeed;
        }
    }

    if (keyboard.pressed("right") || keyboard.pressed("D")) {
        if (car.mesh.position.x < 85) {
            car.mesh.position.x += carSpeed;
        }
    }
    if (keyboard.pressed("up") || keyboard.pressed("W")) {
        car.mesh.position.z -= carSpeed;
    }
    if (keyboard.pressed("down") || keyboard.pressed("S")) {
        car.mesh.position.z += carSpeed;
    }

    if (!isThrowingBomb) {
        if (keyboard.pressed("enter") || keyboard.pressed("J")) {
            if (bombNum > 0) {
                isThrowingBomb = true;
                createBomb();
                --bombNum;
                playReleaseBombAudio();
                updateBombUI();
                // 1s后才能再扔
                setTimeout(function () {
                    isThrowingBomb = false;
                }, 1000);
            } else {
                playNoBombAudio();
            }
        }
    }

    if (!isAccelerate) {
        if (keyboard.pressed("space")) {
            playAccelerateAudio();
            isAccelerate = true;
            speed = 3;
            setTimeout(function () {
                isAccelerate = false;
                speed = 1;
            }, 1000);
        }
    }
    if (!isChangingGround){
        if (keyboard.pressed("l")) {
            isChangingGround = true;
            changeGroundColor();
            setTimeout(function () {
                isChangingGround = false;
            },1000)
        }
    }


    renderer.render(scene, camera);

    requestAnimationFrame(tick);
}

// 检测与玩家小车是否碰撞
function collisionPlayer(x, z, l, w) {
    var playerX = car.mesh.position.x;
    var playerZ = car.mesh.position.z;
    //console.log("x:" + playerX + ",z:" + playerZ);
    if (Math.abs(playerX - x) < l && Math.abs(playerZ - z) < w) {
        return true;
    } else {
        return false;
    }
}

// 检测碰撞
function collision(x1, z1, x2, z2, l, w) {
    if (Math.abs(x1 - x2) < l && Math.abs(z1 - z2) < w) {
        return true;
    } else {
        return false;
    }
}

function updateCoinUI() {
    scene.remove(coinUI.mesh);
    createCoinUI();
}

function updateHPUI() {
    if (HP <= 100 && HP >= 0) {
        scene.remove(HPBarUI.mesh);
        createHPBarUI();
    }
}

function updateBombUI() {
    scene.remove(bombUI.mesh);
    createBombUI();
}

function changeGroundColor() {
    groundColorId = (groundColorId + 1)%(groundColor.length);
    isChangingGround = true;
    console.log("changeColor" + groundColor);
    scene.remove(ground.mesh);
    createGround();
}

