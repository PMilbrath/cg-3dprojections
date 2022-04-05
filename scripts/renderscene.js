let view;
let ctx;
let scene;
let start_time;

const LEFT =   32; // binary 100000
const RIGHT =  16; // binary 010000
const BOTTOM = 8;  // binary 001000
const TOP =    4;  // binary 000100
const FAR =    2;  // binary 000010
const NEAR =   1;  // binary 000001
const FLOAT_EPSILON = 0.000001;

// Initialization function - called when web page loads
function init() {
    let w = 800;
    let h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');

    // initial scene... feel free to change this
    scene = {
        view: {
            type: 'perspective',
            prp: Vector3(44, 20, -16),
            srp: Vector3(20, 20, -40),
            vup: Vector3(0, 1, 0),
            clip: [-19, 5, -10, 8, 12, 100]
        },
        models: [
            {
                type: 'generic',
                vertices: [
                    Vector4( 0,  0, -30, 1),
                    Vector4(20,  0, -30, 1),
                    Vector4(20, 12, -30, 1),
                    Vector4(10, 20, -30, 1),
                    Vector4( 0, 12, -30, 1),
                    Vector4( 0,  0, -60, 1),
                    Vector4(20,  0, -60, 1),
                    Vector4(20, 12, -60, 1),
                    Vector4(10, 20, -60, 1),
                    Vector4( 0, 12, -60, 1)
                ],
                edges: [
                    [0, 1, 2, 3, 4, 0],
                    [5, 6, 7, 8, 9, 5],
                    [0, 5],
                    [1, 6],
                    [2, 7],
                    [3, 8],
                    [4, 9]
                ],
                matrix: new Matrix(4, 4)
            }
        ]
    };

    // event handler for pressing arrow keys
    document.addEventListener('keydown', onKeyDown, false);
    
    // start animation loop
    start_time = performance.now(); // current timestamp in milliseconds
    window.requestAnimationFrame(animate);
}

// Animation loop - repeatedly calls rendering code
function animate(timestamp) {
    // step 1: calculate time (time since start)
    let time = timestamp - start_time;
    
    // step 2: transform models based on time
    // TODO: implement this!

    // step 3: draw scene
    drawScene();

    // step 4: request next animation frame (recursively calling same function)
    // (may want to leave commented out while debugging initially)
    // window.requestAnimationFrame(animate);
}

// Main drawing code - use information contained in variable `scene`
function drawScene() {
    console.log(scene);
    
    // TODO: implement drawing here!
    // For each model, for each edge
    //  * transform to canonical view volume
    //  * clip in 3D
    //  * project to 2D
    //  * draw line
}

// Get outcode for vertex (parallel view volume)
function outcodeParallel(vertex) {
    let outcode = 0;
    if (vertex.x < (-1.0 - FLOAT_EPSILON)) {
        outcode += LEFT;
    }
    else if (vertex.x > (1.0 + FLOAT_EPSILON)) {
        outcode += RIGHT;
    }
    if (vertex.y < (-1.0 - FLOAT_EPSILON)) {
        outcode += BOTTOM;
    }
    else if (vertex.y > (1.0 + FLOAT_EPSILON)) {
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        outcode += FAR;
    }
    else if (vertex.z > (0.0 + FLOAT_EPSILON)) {
        outcode += NEAR;
    }
    return outcode;
}

// Get outcode for vertex (perspective view volume)
function outcodePerspective(vertex, z_min) {
    let outcode = 0;
    if (vertex.x < (vertex.z - FLOAT_EPSILON)) {
        outcode += LEFT;
    }
    else if (vertex.x > (-vertex.z + FLOAT_EPSILON)) {
        outcode += RIGHT;
    }
    if (vertex.y < (vertex.z - FLOAT_EPSILON)) {
        outcode += BOTTOM;
    }
    else if (vertex.y > (-vertex.z + FLOAT_EPSILON)) {
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        outcode += FAR;
    }
    else if (vertex.z > (z_min + FLOAT_EPSILON)) {
        outcode += NEAR;
    }
    return outcode;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLineParallel(line) {
    let result = null;
    let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z); 
    let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
    let out0 = outcodeParallel(p0);
    let out1 = outcodeParallel(p1);
    
    // TODO: implement clipping here!
    //Trivial Accept: Both endpoints are in view rectangle - Bitwise OR the outcodes
    let out_accept = (out0 | out1);
    //Trival Reject: Both endpoints lie outside the same edge - Bitwise AND the outcodes -> result not 0
    let out_reject = (out0 & out1);
    
    if(out_reject > 0){
        return null;
    }

    //Initializing Parametric Line Eq. Values + Formulas
    
    return result;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLinePerspective(line, z_min) {
    let result = null;
    let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z); 
    let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
    let out0 = outcodePerspective(p0, z_min);
    let out1 = outcodePerspective(p1, z_min);
     
    //Trivial Accept: Both endpoints are in view rectangle - Bitwise OR the outcodes
    let out_accept = (out0 | out1);
    //Trival Reject: Both endpoints lie outside the same edge - Bitwise AND the outcodes -> result not 0
    let out_reject = (out0 & out1);

    if(out_reject > 0){ //both endpoints lie outside same edge, therefore line is completely outside view volume
        return result;
    }

    //Initializing Parametric Line Eq. Values + Formulas
    let x0 = p0.x;
    let y0 = p0.y;
    let z0 = p0.z;
    let x1 = p1.x;
    let y1 = p1.y;
    let z1 = p1.z;
    //let near = clip.near;
    let near = clip[4];
    //let far = clip.far;
    let far = clip[5];
    let zmin = -near/far;
    let t = 0;

    let x = (1-t)*x0 + (t*x1);
    let y = (1-t)*y0 + (t*y1);
    let z = (1-t)*z0 + (t*z1);

    //Intersection t-value formulas

    left_t = (-x0 + z0)/((x1-x0)-(z1-z0));
    bot_t = (y0 + z0)/((y1-y0)-(z1-z0));
    near_t = (z0 - zmin)/-(z1-z0);
    back_t = (-z0 - 1)/(z1-z0);
    right_t = (x0 + z0)/(-(x1-x0)-(z1-z0));
    top_t = (y0 + z0)/(-(y1-y0)-(z1-z0));
    
    //TODO: I'm not sure how the scaling works for this. Might need scaling matrix?

    //CLIPPING OUTCODE0
    if(out0 >= 32){  //LEFT
        t = left_t;
        x = (1-t)*x0 + (t*x1);
        out0 = out0 - 32;
    }else if(out0 >= 16){  //RIGHT
        t = right_t;
        x = (1-t)*x0 + (t*x1);
        out0 = out0 - 16;
    }
    if(out0 >= 8){   //TOP
        t = top_t;
        y = (1-t)*y0 + (t*y1);
        out0 = out0 - 8;
    }else if(out0 >= 4){   //BOTTOM
        t = bot_t;
        y = (1-t)*y0 + (t*y1);
        out0 = out0 - 4;
    }
    if(out0 >= 2){   //FAR
        t = back_t;
        z = (1-t)*z0 + (t*z1);
        out0 = out0 - 2;
    }else if(out >= 1){    //NEAR
        t = near_t;
        z = (1-t)*z0 + (t*z1);
        out0 = out0 - 1;
    }
    //CLIPPING OUTCODE1
    if(out1 >= 32){  //LEFT
        t = left_t;
        x = (1-t)*x0 + (t*x1);
        out1 = out1 - 32;
    }else if(out1 >= 16){  //RIGHT
        t = right_t;
        x = (1-t)*x0 + (t*x1);
        out1 = out1 - 16;
    }
    if(out1 >= 8){   //TOP
        t = top_t;
        y = (1-t)*y0 + (t*y1);
        out1 = out1 - 8;
    }else if(out1 >= 4){   //BOTTOM
        t = bot_t;
        y = (1-t)*y0 + (t*y1);
        out1 = out1 - 4;
    }
    if(out1 >= 2){   //FAR
        t = back_t;
        z = (1-t)*z0 + (t*z1);
        out1 = out1 - 2;
    }else if(out >= 1){    //NEAR
        t = near_t;
        z = (1-t)*z0 + (t*z1);
        out1 = out1 - 1;
    }
    
    //TODO: return result but idk what result is. Is it a vertex? idk.
    return result;
}

// Called when user presses a key on the keyboard down 
function onKeyDown(event) {
    switch (event.keyCode) {
        case 37: // LEFT Arrow
            console.log("left");
            break;
        case 39: // RIGHT Arrow
            console.log("right");
            break;
        case 65: // A key
            console.log("A");
            break;
        case 68: // D key
            console.log("D");
            break;
        case 83: // S key
            console.log("S");
            break;
        case 87: // W key
            console.log("W");
            break;
    }
}

///////////////////////////////////////////////////////////////////////////
// No need to edit functions beyond this point
///////////////////////////////////////////////////////////////////////////

// Called when user selects a new scene JSON file
function loadNewScene() {
    let scene_file = document.getElementById('scene_file');

    console.log(scene_file.files[0]);

    let reader = new FileReader();
    reader.onload = (event) => {
        scene = JSON.parse(event.target.result);
        scene.view.prp = Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]);
        scene.view.srp = Vector3(scene.view.srp[0], scene.view.srp[1], scene.view.srp[2]);
        scene.view.vup = Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]);

        for (let i = 0; i < scene.models.length; i++) {
            if (scene.models[i].type === 'generic') {
                for (let j = 0; j < scene.models[i].vertices.length; j++) {
                    scene.models[i].vertices[j] = Vector4(scene.models[i].vertices[j][0],
                                                          scene.models[i].vertices[j][1],
                                                          scene.models[i].vertices[j][2],
                                                          1);
                }
            }
            else {
                scene.models[i].center = Vector4(scene.models[i].center[0],
                                                 scene.models[i].center[1],
                                                 scene.models[i].center[2],
                                                 1);
            }
            scene.models[i].matrix = new Matrix(4, 4);
        }
    };
    reader.readAsText(scene_file.files[0], 'UTF-8');
}

// Draw black 2D line with red endpoints 
function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
    ctx.fillRect(x2 - 2, y2 - 2, 4, 4);
}
