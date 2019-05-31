$(document).ready(function () {
    $('#uploadFile').hide();
    $('#uploadFile').on("change", function () {
        var fd = new FormData();
        fd.append("file", $("#uploadFile").get(0).files[0]);
        glitchPass.goWild = true;
        $(".fun-btn").text("Processing");
        $.ajax({
            url: "/api/image",
            type: "POST",
            processData: false,
            contentType: false,
            data: fd,
            success: function (d) {
                console.log(d);
                $(".fun-btn").text("Upload");

                glitchPass.goWild = false;
            }
        });
    });
    $('.fun-btn').on('click', function (event) {
        $('#uploadFile').click();

    });
    var container, loader, camera, scene, renderer, composer, bgTexture, bgWidth, bgHeight;
    var glitchPass;

    init();
    animate();

    function init() {
        container = $('.background');

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        container.append(renderer.domElement);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(0, -4, -1.5);

        loader = new THREE.TextureLoader();
        loader.setCrossOrigin("");

        scene = new THREE.Scene();
        bgTexture = loader.load("images/bg.png",
            function (texture) {
                var img = texture.image;
                bgWidth = img.width;
                bgHeight = img.height;
                resize();
            }
        );
        scene.background = bgTexture;
        bgTexture.wrapS = THREE.MirroredRepeatWrapping;
        bgTexture.wrapT = THREE.MirroredRepeatWrapping;

        scene.add(camera);
        window.onresize = resize;

        var ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.x = -0.75;
        directionalLight.position.y = -0.5;
        directionalLight.position.z = -1;
        scene.add(directionalLight);

        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));
        glitchPass = new THREE.GlitchPass();
        composer.addPass(glitchPass);

        createModel();
    }

    function createModel() {

        var material = new THREE.MeshPhongMaterial({
            color: '#b090b0'
        });
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
    }

    function resize() {

        var aspect = window.innerWidth / window.innerHeight;
        var texAspect = bgWidth / bgHeight;
        var relAspect = aspect / texAspect;

        bgTexture.repeat = new THREE.Vector2(Math.max(relAspect, 1), Math.max(1 / relAspect, 1));
        bgTexture.offset = new THREE.Vector2(-Math.max(relAspect - 1, 0) / 2, -Math.max(1 / relAspect - 1, 0) / 2);

        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        composer.render();
        // renderer.render(scene, camera);
    }
});