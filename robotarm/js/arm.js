/**
 * Created by iceleaf on 2016/9/2.
 */
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container, control;

var WIDTH, HEIGHT;

var helpset ;
var boneMesh;
var gui, params;
var processValue = 10;




window.addEventListener('load', init, false);

function init(){
    $( "#progressbar" ).progressbar({
        value: processValue
    });

    createGUI();
    createScene();
    createLight();
    createModels();
    createOrbit(); //建立3D環轉
    //renderer.render(scene, camera); //單次render放這就好
    loop();

    window.addEventListener('resize', handleWindowResize, false);
}

function createGUI() {
    gui = new dat.GUI();
    params = {
        clip:0.1,
        base:0,
        upperArm:0.1,
        wrist:0
    };
    gui.add(params, 'clip', -0.4,1.5);
    gui.add(params, 'base', -3,3);
    gui.add(params, 'upperArm', -1.3,1.5);
    gui.add(params, 'wrist', -1,1);
}

function handleWindowResize() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH/HEIGHT;
    camera.updateProjectionMatrix();
}

function createOrbit() {
    control = new THREE.OrbitControls(camera, renderer.domElement);
    control.object.position.set(-6, 7, 9);  // 設定control camera原點
    control.target.set(0, 1, 1);  // 設定control camera 目標點
    control.update();
}


function createScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xF9EBCA, 0,40);
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    aspectRatio = WIDTH/HEIGHT;
    fieldOfView = 50;
    nearPlane = 1;
    farPlane = 10000;

    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);


    renderer = new THREE.WebGLRenderer({alpha:true, antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xF9EBCA); //設定alpha: true 背景為透明，可用CSS設定背景顏色
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

}

function createLight() {
    var ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

}



function createModels() {

    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('model/bone.json', addModel);
    function addModel(geometry) {
        var mtl = new THREE.MeshBasicMaterial({color: 0x888888});
        boneMesh = new THREE.SkinnedMesh(geometry, mtl);

        //mesh.skeleton.bones[1].rotation.z = 1;
       // mesh.material.materials.forEach(function (m) {    //
       //     m.skinning = true;                           // TMD 超級重要!!!!!!!!!!!!!!!!!!
       // });                                              //


        scene.add(boneMesh);

        processGO();
       // helpset = new THREE.SkeletonHelper(boneMesh);

        //scene.add(helpset);
        loadJson();
    }



}

function loadJson() {

    var jsonLoader = new THREE.JSONLoader();

    jsonLoader.load('model/floor.json', addFloor);
    function addFloor(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial (material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);

        processGO();



    }


    jsonLoader.load('model/base.json', addBase);
    function addBase(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial (material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);

        processGO();

    }

    jsonLoader.load('model/rotateBase.json', addRotateBase);
    function addRotateBase(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial (material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);

        boneMesh.skeleton.bones[0].add(mesh);
        //boneMesh.skeleton.bones[0].rotation.y = Math.PI/2;
        processGO();
    }

    jsonLoader.load('model/lowArm.json', addLowArm);
    function addLowArm(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial (material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);
        boneMesh.skeleton.bones[1].add(mesh);

        for(var i=0; i<=1; i++){
            mesh.position.x -= boneMesh.skeleton.bones[i].position.x;
            mesh.position.y -= boneMesh.skeleton.bones[i].position.y;
            mesh.position.z -= boneMesh.skeleton.bones[i].position.z;
        }

        processGO();

    }

    jsonLoader.load('model/upArm.json', addUpArm);
    function addUpArm(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial (material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);
        boneMesh.skeleton.bones[2].add(mesh);

        for(var i=0; i<=2; i++){
            mesh.position.x -= boneMesh.skeleton.bones[i].position.x;
            mesh.position.y -= boneMesh.skeleton.bones[i].position.y;
            mesh.position.z -= boneMesh.skeleton.bones[i].position.z;
        }

        //boneMesh.skeleton.bones[2].rotation.x = 1;


        processGO();


    }

    jsonLoader.load('model/clipBase.json', addClipBase);
    function addClipBase(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial (material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);
        boneMesh.skeleton.bones[3].add(mesh);

        for(var i=0; i<=3; i++){
            mesh.position.x -= boneMesh.skeleton.bones[i].position.x;
            mesh.position.y -= boneMesh.skeleton.bones[i].position.y;
            mesh.position.z -= boneMesh.skeleton.bones[i].position.z;
        }
        processGO();

    }

    jsonLoader.load('model/clipR.json', addClipR);
    function addClipR(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial (material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);
        boneMesh.skeleton.bones[5].add(mesh);
        console.log(boneMesh.skeleton.bones[7]);

        for(var i=0; i<=5; i++){
            if(i !=4){
                mesh.position.x -= boneMesh.skeleton.bones[i].position.x;
                mesh.position.y -= boneMesh.skeleton.bones[i].position.y;
                mesh.position.z -= boneMesh.skeleton.bones[i].position.z;
            }
        }
        processGO();


    }

    jsonLoader.load('model/clipL.json', addClipL);
    function addClipL(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial (material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);
        boneMesh.skeleton.bones[4].add(mesh);
        for(var i=0; i<=4; i++){
            mesh.position.x -= boneMesh.skeleton.bones[i].position.x;
            mesh.position.y -= boneMesh.skeleton.bones[i].position.y;
            mesh.position.z -= boneMesh.skeleton.bones[i].position.z;
        }
        // boneMesh.skeleton.bones[4].rotation.y += 1;
        processGO();

    }
}


function processGO() {
    processValue += 10;
    $( "#progressbar" ).progressbar({
        value: processValue
    });
}


function loop() {
    if(processValue ==100){
        $('#cover').delay(500).fadeOut(1000);
    }


    renderer.render(scene, camera);
    requestAnimationFrame(loop);

    scene.traverse(function (child) {
        if(child instanceof THREE.SkinnedMesh){
            child.skeleton.bones[0].rotation.y = params.base;
            child.skeleton.bones[1].rotation.x = params.upperArm;

            params.upperArm *= -1;
            child.skeleton.bones[2].rotation.x = params.upperArm;
            child.skeleton.bones[3].rotation.x = params.wrist;
            params.upperArm *= -1;
            child.skeleton.bones[4].rotation.y = params.clip;
            params.clip *= -1;
            child.skeleton.bones[5].rotation.y = params.clip;
            params.clip *= -1;

        }
      //  else if (child instanceof THREE.SkeletonHelper){
      //      child.update();
      //  }

    });

}