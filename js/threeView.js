/**
 * Created by ghassaei on 9/16/16.
 */

function initThreeView() {

    var scene = new THREE.Scene();
    var $threeContainer = $("#threeContainer");
    var camera = new THREE.OrthographicCamera($threeContainer.innerWidth() / -2, $threeContainer.innerWidth() / 2, window.innerHeight / 2, window.innerHeight / -2, -1000, 1000);//-40, 40);
    var renderer = new THREE.WebGLRenderer({antialias: true});
    var controls;

    window.addEventListener('resize', onWindowResize, false);

    init();

    function init() {

        var container = $("#threeContainer");
        renderer.setSize($threeContainer.innerWidth(), window.innerHeight);
        container.append(renderer.domElement);

        //scene.fog = new THREE.FogExp2(0xf4f4f4, 1.7);
        //renderer.setClearColor(scene.fog.color);

        camera.zoom = 20;
        camera.updateProjectionMatrix();
        camera.position.x = 40;
        camera.position.y = 60;
        camera.position.z = 40;
        camera.up.set( 0, 0, 1 );
        camera.lookAt(new THREE.Vector3(0,0,0));

        controls = new THREE.OrbitControls(camera, container.get(0));
        controls.addEventListener('change', render);

        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = $threeContainer.innerWidth() / window.innerHeight;
        camera.left = -$threeContainer.innerWidth() / 2;
        camera.right = $threeContainer.innerWidth() / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = -window.innerHeight / 2;
        camera.updateProjectionMatrix();

        renderer.setSize($threeContainer.innerWidth(), window.innerHeight);

        render();
    }

    return {
        render: render,
        scene: scene,
        renderer: renderer,
        camera: camera
    }
}