var lastFrameTime = Date.now() / 1000;
var canvas;
var shader;
var batcher;
var gl;
var mvp = new spine.webgl.Matrix4();
var skeletonRenderer;
var debugRenderer;
var shapes;
window.skeleton = {};
var activeSkeleton = "";
var loadingText = document.getElementById('loading-text');
var pendingAnimation = '';
var progressBar;
var animationQueue = [];
var speedFactor = 1;
var audio;

var bgColor = [1, 1, 1, 0];

function _(e, t, n) {
    var r = null;
    if ("text" === e) return document.createTextNode(t);
    r = document.createElement(e);
    for (var l in t) if ("style" === l) for (var a in t.style) r.style[a] = t.style[a]; else if ("className" === l) r.className = t[l]; else if ("event" === l) for (var a in t[l]) r.addEventListener(a, t[l][a]); else r.setAttribute(l, t[l]);
    if (n) for (var s = 0; s < n.length; s++) null != n[s] && r.appendChild(n[s]);
    return r
}

function getClass(i) {
    return (i < 10 ? '0' : '') + i;
}

function loadData(url, cb, loadType, progress) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', "https://yicheng.me/file/spine/cysp/" + url, true);
    if (loadType) xhr.responseType = loadType;
    if (progress) xhr.onprogress = progress;
    xhr.onload = function () {
        if (xhr.status == 200)
            cb(true, xhr.response);
        else
            cb(false);
    }
    xhr.onerror = function () {
        cb(false);
    }
    xhr.send();
}


function init() {
    canvas = document.getElementById("spine-canvas");
    var config = {alpha: true};
    gl = canvas.getContext("webgl", config) || canvas.getContext("experimental-webgl", config);
    if (!gl) {
        alert('WebGL is unavailable.');
        return;
    }

    // Create a simple shader, mesh, model-view-projection matrix and SkeletonRenderer.
    shader = spine.webgl.Shader.newTwoColoredTextured(gl);
    batcher = new spine.webgl.PolygonBatcher(gl);
    mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
    skeletonRenderer = new spine.webgl.SkeletonRenderer(gl);
    debugRenderer = new spine.webgl.SkeletonDebugRenderer(gl);
    debugRenderer.drawRegionAttachments = true;
    debugRenderer.drawBoundingBoxes = true;
    debugRenderer.drawMeshHull = true;
    debugRenderer.drawMeshTriangles = true;
    debugRenderer.drawPaths = true;
    debugShader = spine.webgl.Shader.newColored(gl);
    shapes = new spine.webgl.ShapeRenderer(gl);
    setTimeout("load(109731, 24);", 200)
}

var loading = false;
var loadingSkeleton;
var generalBattleSkeletonData;
var currentTexture;
var currentClassAnimData = {
    type: 0,
    data: {}
};
var currentCharaAnimData = {
    id: 0,
    data: {}
};
var currentClass = '7';

function load(unit_id, class_id) {
    if (loading) return;
    loading = true;
    if (activeSkeleton == unit_id && currentClass == 7) return;
    currentClass = class_id;
    var baseUnitId = unit_id | 0;
    baseUnitId -= baseUnitId % 100 - 1;
    loadingSkeleton = {id: unit_id | 0, info: 109701};
    if (progressBar) progressBar.remove();
    progressBar = document.body.appendChild(_('div', {
        className: 'img-progress',
        style: {width: '5px', opacity: 1}
    }));
    progressBar.style.width = '0';

    if (!generalBattleSkeletonData)
        loadingText.textContent = '加载共用骨架 (0/5)', loadData('000000_CHARA_BASE.cysp', function (success, json) {
            if (!success || json === null) return loading = false, loadingText.textContent = '加载共用骨架失败', progressBar.width = '100%', progressBar.opacity = 0;
            generalBattleSkeletonData = json;
            loadClassAnimation();
        }, 'arraybuffer');
    else loadClassAnimation();
}

function loadClassAnimation() {
    progressBar.style.width = '15%';
    if (currentClassAnimData.type == currentClass)
        loadCharaSkillAnimation();
    else
        loadingText.textContent = '加载职介动画 (1/5)', loadData(getClass(currentClass) + '_COMMON_BATTLE.cysp', function (success, json) {
            if (!success || json === null) return loading = false, loadingText.textContent = '加载职介动画失败', progressBar.width = '100%', progressBar.opacity = 0;
            currentClassAnimData = {
                type: currentClass,
                data: json
            }
            loadCharaSkillAnimation();
        }, 'arraybuffer');
}

function loadCharaSkillAnimation() {
    progressBar.style.width = '30%';
    var baseUnitId = loadingSkeleton.id;
    baseUnitId -= baseUnitId % 100 - 1;
    if (currentCharaAnimData.id == baseUnitId)
        loadTexture();
    else
        loadingText.textContent = '加载角色技能动画 (2/5)', loadData(baseUnitId + '_BATTLE.cysp', function (success, json) {
            if (!success || json === null) return loading = false, loadingText.textContent = '加载角色技能动画失败', progressBar.width = '100%', progressBar.opacity = 0;
            currentCharaAnimData = {
                id: baseUnitId,
                data: json
            }
            loadTexture();
        }, 'arraybuffer');
}


function loadTexture() {
    progressBar.style.width = '45%';
    loadingText.textContent = '加载材质 (3/5)';
    loadData(loadingSkeleton.id + '.atlas', function (success, atlasText) {
        if (!success) return loading = false, loadingText.textContent = '加载材质失败', progressBar.width = '100%', progressBar.opacity = 0;
        progressBar.style.width = '60%';
        loadingText.textContent = '加载材质图片 (4/5)';
        loadData(loadingSkeleton.id + '.png', function (success, blob) {
            if (!success) return loading = false, loadingText.textContent = '加载材质图片失败';
            var img = new Image();
            img.onload = function () {
                progressBar.style.width = '100%';
                progressBar.style.opacity = 0;
                var created = !!window.skeleton.skeleton;
                if (created) {
                    window.skeleton.state.clearTracks();
                    window.skeleton.state.clearListeners();
                    gl.deleteTexture(currentTexture.texture)
                }

                var imgTexture = new spine.webgl.GLTexture(gl, img);
                URL.revokeObjectURL(img.src);
                atlas = new spine.TextureAtlas(atlasText, function (path) {
                    return imgTexture;
                });
                currentTexture = imgTexture;
                atlasLoader = new spine.AtlasAttachmentLoader(atlas);

                var animationCount = 0;
                var classAnimView = new DataView(currentClassAnimData.data);
                var classAnimCount = classAnimView.getInt32(12, true);
                animationCount += classAnimCount;
                var unitAnimView = new DataView(currentCharaAnimData.data);
                var unitAnimCount = unitAnimView.getInt32(12, true)
                animationCount += unitAnimCount;

                //assume always no more than 128 animations
                var newBuffSize = generalBattleSkeletonData.byteLength - 64 + 1 +
                    currentClassAnimData.data.byteLength - (++classAnimCount) * 32 +
                    currentCharaAnimData.data.byteLength - (++unitAnimCount) * 32;
                var newBuff = new Uint8Array(newBuffSize);
                var offset = 0;
                newBuff.set(new Uint8Array(generalBattleSkeletonData.slice(64)), 0);
                offset += generalBattleSkeletonData.byteLength - 64;
                newBuff[offset] = animationCount;
                offset++;
                newBuff.set(new Uint8Array(currentClassAnimData.data.slice(classAnimCount * 32)), offset);
                offset += currentClassAnimData.data.byteLength - classAnimCount * 32;
                newBuff.set(new Uint8Array(currentCharaAnimData.data.slice(unitAnimCount * 32)), offset);
                offset += currentCharaAnimData.data.byteLength - unitAnimCount * 32;

                var skeletonBinary = new spine.SkeletonBinary(atlasLoader);
                var skeletonData = skeletonBinary.readSkeletonData(newBuff.buffer);
                var skeleton = new spine.Skeleton(skeletonData);
                skeleton.setSkinByName('default');
                var bounds = calculateBounds(skeleton);

                animationStateData = new spine.AnimationStateData(skeleton.data);
                var animationState = new spine.AnimationState(animationStateData);
                animationState.setAnimation(0, getClass(currentClass) + '_idle', true);
                animationState.addListener({
                    /*start: function (track) {
                      console.log("Animation on track " + track.trackIndex + " started");
                    },
                    interrupt: function (track) {
                      console.log("Animation on track " + track.trackIndex + " interrupted");
                    },
                    end: function (track) {
                      console.log("Animation on track " + track.trackIndex + " ended");
                    },
                    disposed: function (track) {
                      console.log("Animation on track " + track.trackIndex + " disposed");
                    },*/
                    complete: function tick(track) {
                        //console.log("Animation on track " + track.trackIndex + " completed");
                        if (animationQueue.length) {
                            var nextAnim = animationQueue.shift();
                            if (nextAnim == 'stop') return;
                            if (nextAnim == 'hold') return setTimeout(tick, 1e3);
                            if (nextAnim.substr(0, 1) != '1') nextAnim = getClass(currentClassAnimData.type) + '_' + nextAnim;
                            console.log(nextAnim);
                            animationState.setAnimation(0, nextAnim, !animationQueue.length);
                        }
                    },
                    /*event: function (track, event) {
                      console.log("Event on track " + track.trackIndex + ": " + JSON.stringify(event));
                    }*/
                });

                window.skeleton = {
                    skeleton: skeleton,
                    state: animationState,
                    bounds: bounds,
                    premultipliedAlpha: true
                }
                loading = false;
                loadingText.textContent = '';
                (window.updateUI || setupUI)();
                if (!created) {
                    canvas.style.width = '99%';
                    requestAnimationFrame(render);
                    setTimeout(function () {
                        canvas.style.width = '';
                    }, 0)
                }
                activeSkeleton = loadingSkeleton.id;
            }
            img.src = URL.createObjectURL(blob);
        }, 'blob', function (e) {
            var perc = e.loaded / e.total * 40 + 60;
            progressBar.style.width = perc + '%';
        });
    })
}

function calculateBounds(skeleton) {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    var offset = new spine.Vector2();
    var size = new spine.Vector2();
    skeleton.getBounds(offset, size, []);
    offset.y = 0
    return {offset: offset, size: size};
}

function setupUI() {
    var setupAnimationUI = function () {
        var animationList2 = document.getElementById("animationList");
        var animationList = [];
        animationList[0] = animationList2;

        while(animationList.firstChild) animationList.removeChild(animationList.firstChild);
        var skeleton = window.skeleton.skeleton;
        var state = window.skeleton.state;
        var activeAnimation = state.tracks[0].animation.name;
        [
            ['闲置', 'idle'],
            ['准备', 'standBy'],
            ['走', 'walk'],
            ['跑', 'run'],
            ['跑（入场）', 'run_gamestart'],
            ['落地', 'landing'],
            ['攻击', 'attack'],
            ['攻击（扫荡）', 'attack_skipQuest'],
            ['庆祝-短', 'joy_short,hold,joy_short_return'],
            ['庆祝-长', 'joy_long,hold,joy_long_return'],
            ['受伤', 'damage'],
            ['死亡', 'die,stop'],
            ['合作-准备', 'multi_standBy'],
            ['合作-闲置', 'multi_idle_standBy'],
            ['合作-闲置（无武器）', 'multi_idle_noWeapon']
        ].forEach(function (i) {
            animationList[0].appendChild(_('option', {value: i[1]}, [_('text', i[0])]));
        });
        animationList[0].appendChild(_('option', {disabled: ''}, [_('text', '---')]));
        skeleton.data.animations.forEach(function (i) {
            i = i.name;
            if (!/^\d{6}_/.test(i)) return;
            var val = i;
            if (/joyResult/.test(i)) val = i + ',stop';
            animationList[0].appendChild(_('option', {value: val}, [
                _('text', i.replace(/\d{6}_skill(.+)/, '技能$1').replace(/\d{6}_joyResult/, '庆祝-角色特有'))
            ]));
        })
    };
    document.getElementById("setAnimation").onclick = function () {
        var bubbleText = ["休息一下吧！", "我会自动保存的", "添加个新计划？", "出去走动一下吧", "任务都完成了吗"];
        var random_id = randomBetween(0, bubbleText.length);
        showBubble(bubbleText[random_id]);
        //playSound();
        var animationState = skeleton.state, forceNoLoop = false;
        const animationQueueArray = [['joy_long', 'joy_long_return'], ['109701_joyResult'], ['109701_skill2']];
        var animationQueueSource = animationQueueArray[Math.floor((Math.random() * animationQueueArray.length))];
        console.log(animationQueueSource);
        animationQueue = Object.assign([], animationQueueSource);
        if (animationQueue[0] == 'multi_standBy') {
            animationQueue.push('multi_idle_standBy');
        } else if ([
            'multi_idle_standBy', 'multi_idle_noWeapon', 'idle', 'walk', 'run', 'run_gamestart'
        ].indexOf(animationQueue[0]) == -1) {
            animationQueue.push('idle');
        }
        var nextAnim = animationQueue.shift();
        if (nextAnim.substr(0, 1) != '1') nextAnim = getClass(currentClassAnimData.type) + '_' + nextAnim;
        animationState.setAnimation(0, nextAnim, !animationQueue.length && !forceNoLoop);
    };

    /*
    var animeBtn = document.getElementById("setAnimation")

    animeBtn.addEventListener("touchstart",touchstartHander,false);
    animeBtn.addEventListener("touchmove",touchmoveHander,false);
    animeBtn.addEventListener("touchend",touchendHander,false);

    var touchstartHander=function(event){
        console.log("touch start");
        timer=setTimeout(LongPress,500);
    }

    var touchmoveHander=function(event){
        event.preventDefault();
        clearTimeout(timer);
        timer=null;
    }

    var touchendHander=function(event){
        event.preventDefault();
        clearTimeout(timer);
        return false;
    }
    */

    window.updateUI = function () {
        setupAnimationUI();
    };
    setupAnimationUI();
}

function render() {
    var now = Date.now() / 1000;
    var delta = now - lastFrameTime;
    lastFrameTime = now;
    delta *= speedFactor;

    // Update the MVP matrix to adjust for canvas size changes
    resize();
    //gl.clearColor(.95703, .95703, .95703, 1)
    //gl.clearColor(1, 1, 1, 0);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);

    // Apply the animation state based on the delta time.
    var state = window.skeleton.state;
    var skeleton = window.skeleton.skeleton;
    var bounds = window.skeleton.bounds;
    var premultipliedAlpha = window.skeleton.premultipliedAlpha;
    state.update(delta);
    state.apply(skeleton);
    skeleton.updateWorldTransform();

    // Bind the shader and set the texture and model-view-projection matrix.
    shader.bind();
    shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
    shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    batcher.begin(shader);

    skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    skeletonRenderer.draw(batcher, skeleton);
    batcher.end();

    shader.unbind();

    requestAnimationFrame(render);
}

function resize() {
    var useBig = screen.width * devicePixelRatio > 1280;
    //var w = useBig ? 1920 : 1280;
    //var h = useBig ? 1080 : 720;
    var w = canvas.clientWidth * devicePixelRatio;
    var h = canvas.clientHeight * devicePixelRatio;
    var bounds = window.skeleton.bounds;
    if (canvas.width != w || canvas.height != h) {
        canvas.width = w;
        canvas.height = h;
    }

    // magic
    var centerX = bounds.offset.x + bounds.size.x / 2;
    var centerY = bounds.offset.y + bounds.size.y / 2;
    var scaleX = bounds.size.x / canvas.width;
    var scaleY = bounds.size.y / canvas.height;
    var scale = Math.max(scaleX, scaleY) * 1.2;
    if (scale < 1) scale = 1;
    var width = canvas.width * scale;
    var height = canvas.height * scale;

    mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
    gl.viewport(0, 0, canvas.width, canvas.height);
}

/*
function playSound() {
    var sid = Math.round(Math.random() * 73);
    var wavname = "static/xcw/" + sid + ".wav";
    console.log(audio);
    if (audio){
        audio.pause();
    }
    audio = new Audio(wavname);
    audio.play();
}
*/
(function () {
    init();
})();
