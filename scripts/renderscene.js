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
            //prp: Vector3(0, 10, -5),
            //srp: Vector3(20, 15, -40),
            //vup: Vector3(1, 1, 0),
            //left, [right, bottom, top, near, far]
            //clip: [-12, 6, -12, 6, 10, 100]
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
            },
            // {
            //     type: 'cube',
            //     vertices: [],
            //     edges: [],
            //     "center": Vector4(20, 20, -30, 1),
            //     "width": 10,
            //     "height": 10,
            //     "depth": 10,
            //     "animation": {
            //         "axis": "y",
            //         "rps": 0.5
            //     },
            //     matrix: new Matrix(4, 4),
            //},
            //{
            //    type: 'cylinder',
            //    vertices: [],
            //    edges: [],
            //    "center": Vector4(0, 50, -30, 1),
            //    "height": 15,
            //    "radius": 5,
            //    "sides": 6,
            //    "animation": {
            //        "axis": "y",
            //        "rps": 0.5
            //    },
            //    matrix: new Matrix(4, 4)
            //},
            // {
            //     type: 'cone',
            //     vertices: [],
            //     edges: [],
            //     "center": Vector4(5, 25, -15, 1),
            //     "height": 25,
            //     "radius": 5,
            //     "sides": 12,
            //     "animation": {
            //         "axis": "y",
            //         "rps": 0.5
            //     },
            //     matrix: new Matrix(4, 4)
            // },
            /*{
                type: 'sphere',
                vertices: [],
                edges: [],
                "center": Vector4(0, 30, 30, 1);
                "radius": 5,
                "slices": 16,
                "stacks": 16,
                "animation": {
                    "axis": "y",
                    "rps": 0.5
                }
            }*/
        ]
    };

    for(let count = 0; count < scene.models.length; count++){       //in case there's multiple models for each scene
        console.log("Model Type: " + scene.models[count].type)
        if(scene.models[count].type == 'cube'){
            scene.models[count] = drawCube(scene.models[count]);
        } else if(scene.models[count].type == 'cylinder'){
            scene.models[count] = drawCylinder(scene.models[count]);
        } else if(scene.models[count].type == 'cone'){
            scene.models[count] = drawCone(scene.models[count]);
        } else if(scene.models[count].type == 'sphere'){
            scene.models[count] = drawSphere(scene.models[count]);
        } 
    }

    // event handler for pressing arrow keys
    document.addEventListener('keydown', onKeyDown, false);
    
    // start animation loop
    start_time = performance.now(); // current timestamp in milliseconds
    const myTimeout = setTimeout(() => {
        window.requestAnimationFrame(animate);
   }, 1000);
}

// Animation loop - repeatedly calls rendering code
function animate(timestamp) {
    // while(true){
    //     onkeydown(keyCode);
    // step 1: calculate time (time since start)
    let time = timestamp - start_time;
    
    // step 2: transform models based on time
    // TODO: implement this!

    // step 3: draw scene

    drawScene();

    // step 4: request next animation frame (recursively calling same function)
    // (may want to leave commented out while debugging initially)
    const myTimeout = setTimeout(() => {
         window.requestAnimationFrame(animate);
    }, 5000);
}

// Main drawing code - use information contained in variable `scene`
function drawScene() {
    ctx.clearRect(0, 0, view.width, view.height);
    console.log(scene);
    // For each model, for each edge
    for(let count = 0; count < scene.models.length; count++){       //in case there's multiple models for each scene
        console.log("Model Type: " + scene.models[count].type)
        if(scene.models[count].type == 'cube'){
            scene.models[count] = drawCube(scene.models[count]);
        } else if(scene.models[count].type == 'cylinder'){
            scene.models[count] = drawCylinder(scene.models[count]);
        } else if(scene.models[count].type == 'cone'){
            scene.models[count] = drawCone(scene.models[count]);
        } else if(scene.models[count].type == 'sphere'){
            scene.models[count] = drawSphere(scene.models[count]);
        } 
    }
    //Initializing Canonical View Calculations
    let nPer;
    let mPer;
    let p0;
    let p1;
    let verts;
    let line;
    let results;

    let clipped_vertices;
    let scalar;

    let identity= new Matrix(4,4);
    mat4x4Identity(identity);
    let v = new Matrix(4,4);
    v.values = [[view.width/2, 0, 0, view.width/2],
                       [0, view.height/2, 0, view.height/2],
                       [0, 0, 1, 0],
                       [0, 0, 0, 1]];

    if(scene.view.type == 'perspective'){
        nPer = mat4x4Perspective(scene.view.prp, scene.view.srp, scene.view.vup, scene.view.clip);
        mPer = mat4x4MPer();
    } else{
        nPer = mat4x4Parallel(scene.view.prp, scene.view.srp, scene.view.vup, scene.view.clip); 
        mPer = mat4x4MPar();
    }

    // console.log(nPer);
    for(let i = 0; i < scene.models.length; i++){//looks through every model
        verts = new Array(0);
        // console.log(verts);
        clipped_vertices = new Array(0);
        clippedVerts = new Array(0);
        for(let vert_count = 0; vert_count < scene.models[i].vertices.length; vert_count++){    //looks at every vertices
            //  * transform to canonical view volume

            verts.push(Matrix.multiply([nPer,scene.models[i].vertices[vert_count]]));
        }
        // console.log(verts);
        // console.log(clipped_vertices);
        // console.log(scene.models.edges.length);
        // console.log(scene.models.type);
        for(let edge_count = 0; edge_count < scene.models[i].edges.length; edge_count++){       //looks at every edge
            // console.log(scene.models.edges.length);
            for(let j=0;j<scene.models[i].edges[edge_count].length-1;j++) {                     //looks p0 and p1, make a line b/w both points, and clip
                //get two edges
                p0 = verts[scene.models[i].edges[edge_count][j]];
                p1 = verts[scene.models[i].edges[edge_count][j+1]];
                // console.log("P0.x: " + p0.x + " P0.y: " + p0.y);
                // console.log("P1.x: " + p1.x + " P1.y: " + p1.y);
                // console.log("\n");
                line = {
                    pt0: p0, 
                    pt1: p1
                };
                line.pt0 = p0;
                line.pt1 = p1;
                // console.log(line);
                //  * clip in 3D
                results=clipLinePerspective(line,scene.view.clip[4]/scene.view.clip[5]);
                // console.log(results);
                if(results != null) {
                    clipped_vertices.push(results.pt0);               
                    clipped_vertices.push(results.pt1);
                }
            }
        }
        for(let j = 0; j < clipped_vertices.length; j++){                                   //
            clipped_vertices[j] = Matrix.multiply([mPer,clipped_vertices[j]]);
            clipped_vertices[j].scale(1/clipped_vertices[j].w);
            clipped_vertices[j] = Matrix.multiply([v,clipped_vertices[j]]);
        }
        // console.log(clipped_vertices);
        for(let line_pt = 0; line_pt<clipped_vertices.length; line_pt=line_pt+2){           //draw line between the vertices
            // Select 2 Points that are connected
            p0 = clipped_vertices[line_pt];
            p1 = clipped_vertices[line_pt+1];
            //  * draw line
            // console.log("p0x " + p0.x + " p0y " + p0.y);
            // console.log("p1x " + p1.x + " p1y " + p1.y);
            drawLine(p0.x,p0.y,p1.x,p1.y);
        }
    }
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

    let out;
    let select;
    
    // TODO: implement clipping here!
    //Trivial Accept: Both endpoints are in view rectangle - Bitwise OR the outcodes
    let out_accept = (out0 | out1);
    //Trival Reject: Both endpoints lie outside the same edge - Bitwise AND the outcodes -> result not 0
    let out_reject = (out0 & out1);
    
    if(out_reject > 0){
        return null;
    } else if (out_accept == 0) {
        return line;
    }

    //Initializing Parametric Line Eq. Values + Formulas
    let x0 = p0.x;
    let y0 = p0.y;
    let z0 = p0.z;
    let x1 = p1.x;
    let y1 = p1.y;
    let z1 = p1.z;
    let near = scene.view.clip[4];
    let far = scene.view.clip[5];
    let t = 0;

    let x = (1-t)*x0 + (t*x1);
    let y = (1-t)*y0 + (t*y1);
    let z = (1-t)*z0 + (t*z1);

    //Intersection t-value formulas
    /**
     * left     x = 1,  right: x = 1
     * bottom:  y = -1, Top:   x = 1
     * near:    z = 0,  back:  z = -1
     */
    // left_t = (-x0 + -1)/(-x0+x1);
    // bot_t = (y0 + -1)/(-y0+y1);
    // near_t = (z0 - 0)/-(z1-z0);
    // back_t = (-z0 - 1)/(z1-z0);
    // right_t = (x0 + 1)/(-x0+x1);
    // top_t = (y0 + 1)/(-y0+y1);

    left_t = (-x0 + z0)/((x1-x0)-(z1-z0));
    bot_t = (y0 + z0)/((y1-y0)-(z1-z0));
    near_t = (z0 - zmin)/-(z1-z0);
    back_t = (-z0 - 1)/(z1-z0);
    right_t = (x0 + z0)/(-(x1-x0)-(z1-z0));
    top_t = (y0 + z0)/(-(y1-y0)-(z1-z0));

    let loop = 0;
    //CLIPPING OUTCODE0
    //BOUNDS: LEFT = z, RIGHT = -z, BOTTOM y = z, TOP = -z, FAR z = 1, NEAR z = z_min
    while (true) {

        out_reject=(out0 & out1);
        out_accept=(out0|out1);
        if(out_reject > 0){ //both endpoints lie outside same edge, therefore line is completely outside view volume
            return result;
        } else if(out_accept == 0) {
            return line;
        }

        if(out0 != 0) {
            select=0;
            out = out0;
        } else {
            select=1;
            out = out1;
        }

        left_t = (-x0 + z0)/((x1-x0)-(z1-z0));
        bot_t = (y0 + z0)/((y1-y0)-(z1-z0));
        near_t = (z0 - zmin)/-(z1-z0);
        back_t = (-z0 - 1)/(z1-z0);
        right_t = (x0 + z0)/(-(x1-x0)-(z1-z0));
        top_t = (y0 + z0)/(-(y1-y0)-(z1-z0));


        if(out >= 32){  //LEFT
            t = left_t;
            x = 1;
            // x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out0 = out0 - 32;
        } else if(out >= 16){  //RIGHT
            t = right_t;
            x = -1;
            // x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out0 = out0 - 16;
        } else if(out >= 8){   //Bottom
            t = bot_t;
            y = -1;
            x = (1-t)*x0 + (t*x1);
            // y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out0 = out0 - 8;
        }else if(out >= 4){   //Top
            t = top_t;
            y = 1;
            x = (1-t)*x0 + (t*x1);
            // y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out0 = out0 - 4;
        } else if(out >= 2){   //FAR
            t = back_t;
            z = -1;
            x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
        // z = (1-t)*z0 + (t*z1);
        //out0 = out0 - 2;
        } else if(out >= 1){    //NEAR
            t = near_t;
            z = 0;
            x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
        // z = (1-t)*z0 + (t*z1);
        //out0 = out0 - 1;
        }
        if(select ==0) {
            line.pt0 = Vector4(x,y,z,1);    //create new clipped vector point
            x0 = x;
            y0 = y;
            z0 = z;
            out0 = outcodeParallel(line.pt0, z_min);
        } else {
            line.pt1 = Vector4(x,y,z,1);    //create new clipped vector point
            x1 = x;
            y1 = y;
            z1 = z;
            out1 = outcodeParallel(line.pt1, z_min);
        }

        if(loop == 8) {
            return null;
        }
        loop++;
    }
    //return result;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLinePerspective(line, z_min) {
    // console.log("ENTERING CLIPPING");
    let result = null;
    let p0 = Vector4(line.pt0.x, line.pt0.y, line.pt0.z,1); 
    let p1 = Vector4(line.pt1.x, line.pt1.y, line.pt1.z,1);
    let out0 = outcodePerspective(line.pt0, z_min);
    let out1 = outcodePerspective(line.pt1, z_min);
     
    let out;
    let select;
    //Trivial Accept: Both endpoints are in view rectangle - Bitwise OR the outcodes
    let out_accept = (out0 | out1);
    //Trival Reject: Both endpoints lie outside the same edge - Bitwise AND the outcodes -> result not 0
    let out_reject = (out0 & out1);

    if(out_reject > 0){ //both endpoints lie outside same edge, therefore line is completely outside view volume
        // console.log("REJECT");
        return result;
    } else if(out_accept == 0) {
        // console.log("ACCEPT");
        return line;
    }
    //Initializing Parametric Line Eq. Values + Formulas
    let x0 = p0.x;
    let y0 = p0.y;
    let z0 = p0.z;
    let x1 = p1.x;
    let y1 = p1.y;
    let z1 = p1.z;
    //let near = clip.near;
    let near = scene.view.clip[4];
    //let far = clip.far;
    let far = scene.view.clip[5];
    let zmin = -near/far;
    let t = 0;

    let x = (1-t)*x0 + (t*x1);
    let y = (1-t)*y0 + (t*y1);
    let z = (1-t)*z0 + (t*z1);

    //Intersection t-value formulas

    left_t = (-x0 + z0)/((x1-x0)-(z1-z0));
    bot_t = (-y0 + z0)/((y1-y0)-(z1-z0));
    near_t = (z0 - zmin)/-(z1-z0);
    back_t = (-z0 - 1)/(z1-z0);
    right_t = (x0 + z0)/(-(x1-x0)-(z1-z0));
    top_t = (y0 + z0)/(-(y1-y0)-(z1-z0));

    //CLIPPING OUTCODE0
    //BOUNDS: LEFT = z, RIGHT = -z, BOTTOM y = z, TOP = -z, FAR z = 1, NEAR z = z_min
    while(true) {
        out_reject=(out0 & out1);
        out_accept=(out0|out1);

        if(out_reject > 0){ //both endpoints lie outside same edge, therefore line is completely outside view volume
            return result;
        } else if(out_accept == 0) {
            return line;
        }

        console.log("x0: " + x0 + ", y0: " + y0 + ", z0: " + z0);
        console.log("x1: " + x1 + ", y1: " + y1 + ", z1: " + z1);
        console.log("out1: " + out0 + ", out1: " + out1);

        left_t = (-x0 + z0)/((x1-x0)-(z1-z0));
        bot_t = (-y0 + z0)/((y1-y0)-(z1-z0));
        near_t = (z0 - zmin)/-(z1-z0);
        back_t = (-z0 - 1)/(z1-z0);
        right_t = (x0 + z0)/(-(x1-x0)-(z1-z0));
        top_t = (y0 + z0)/(-(y1-y0)-(z1-z0));

        if(out0 != 0) {
            select=0;
            out = out0;
        } else {
            select=1;
            out = out1;
        }

        let loop = 0;

    //CLIPPING OUTCODE
        if(out >= 32){  //LEFT
            t = left_t;
            x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out = out - 32;
        }else if(out >= 16){  //RIGHT
            t = right_t;
            x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out = out - 16;
        }else if(out >= 8){   //Bottom
            t = bot_t;
            x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out = out - 8;
        }else if(out >= 4){   //Top
            t = top_t;
            x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out = out - 4;
        } else if(out >= 2){   //FAR
            t = back_t;
            x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out = out - 2;
        } else if(out >= 1){    //NEAR
            t = near_t;
            x = (1-t)*x0 + (t*x1);
            y = (1-t)*y0 + (t*y1);
            z = (1-t)*z0 + (t*z1);
            //out = out - 1;
        }

        if(select ==0) {
            line.pt0 = Vector4(x,y,z,1);    //create new clipped vector point
            x0 = x;
            y0 = y;
            z0 = z;
            out0 = outcodePerspective(line.pt0, z_min);
        } else {
            line.pt1 = Vector4(x,y,z,1);    //create new clipped vector point
            x1 = x;
            y1 = y;
            z1 = z;
            out1 = outcodePerspective(line.pt1, z_min);
        }

        if(loop == 8) {
            return null;
        }
        loop++;
    }
}

// Called when user presses a key on the keyboard down 
function onKeyDown(event) {
    //PRP: Camera, SRP: What the camera is looking at: VUP: The direction of "UP" in regards to the camera
    //n-axis: normalized(PRP-SRP)
    let n = scene.view.prp.subtract(scene.view.srp);
    n.normalize();
    //u-axis: normalized(VUP X n-axis)
    //right with respect to virtual camera's image plane
    let u = scene.view.vup.cross(n);
    u.normalize();
    let v = n.cross(u);
    //n.scale(.1);
    //u.scale(.1);
    let radian = degreeToRadian(10);
    let verts;
    let newSRP;
    let newPRP;
    let rotVal;
    
    switch (event.keyCode) {
        case 37: // LEFT Arrow  //translate the PRP and SRP along the u-axis
            console.log("left");
            //create a 4x4 Matrix for SRP and PRP
            newSRP = Vector4(scene.view.prp.x, scene.view.prp.y, scene.view.prp.z, 1);
            newPRP = Vector4(scene.view.prp.x, scene.view.prp.y, scene.view.prp.z, 1);
            
            //console.log("PRP: "+scene.view.prp.x);
            //scene.view.prp.x = scene.view.prp.x + 1;
            //rotate the camera for every left click

            // newSRP = Mat4x4RotateY(newSRP, radian);
            // newPRP = Mat4x4RotateY(newPRP, radian);
            break;
        case 39: // RIGHT Arrow //translate the PRP and SRP along the u-axis
            console.log("right");
            break;
        case 65: // A key   //translate the PRP and SRP along the u-axis
            console.log("A");
            scene.view.prp=scene.view.prp.subtract(u);
            scene.view.srp=scene.view.srp.subtract(u);
            break;
        case 68: // D key   //translate the PRP and SRP along the u-axis
            console.log("D");
            scene.view.prp=scene.view.prp.add(u);
            scene.view.srp=scene.view.srp.add(u);
            break;
        case 83: // S key   //translate the PRP and SRP along the n-axis
            console.log("S");
            scene.view.prp=scene.view.prp.subtract(n);
            scene.view.srp=scene.view.srp.subtract(n);
            break;
        case 87: // W key   //translate the PRP and SRP along the n-axis
            console.log("W");
            scene.view.prp=scene.view.prp.add(n);
            scene.view.srp=scene.view.srp.add(n);
            break;
    }
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

function drawCube(model){
    if (model.hasOwnProperty(vertices) && model.hasOwnProperty(edges)) {
        return model;
    }
    //let type = model.type;
    let center = model.center;
    let height = model.height;
    let width = model.width;
    let depth = model.depth;
    //let vertices = [];
    //let edges =[];

    model.vertices.push(Vector4(center.x-(width/2), center.y+(height/2), center.z-(depth/2), 1));  //front top left");
    model.vertices.push(Vector4(center.x+(width/2), center.y+(height/2), center.z-(depth/2), 1));  //front top right
    model.vertices.push(Vector4(center.x-(width/2), center.y-(height/2), center.z-(depth/2), 1));  //front bottom left
    model.vertices.push(Vector4(center.x+(width/2), center.y-(height/2), center.z-(depth/2), 1));  //front bottom right
    model.vertices.push(Vector4(center.x-(width/2), center.y+(height/2), center.z+(depth/2), 1));  //front top left
    model.vertices.push(Vector4(center.x+(width/2), center.y+(height/2), center.z+(depth/2), 1));  //front top right
    model.vertices.push(Vector4(center.x-(width/2), center.y-(height/2), center.z+(depth/2), 1));  //front bottom left
    model.vertices.push(Vector4(center.x+(width/2), center.y-(height/2), center.z+(depth/2), 1));  //front bottom right

    model.edges.push([0, 1, 3, 2, 0]);
    model.edges.push([4, 5, 7, 6, 4]);
    model.edges.push([0, 4]);
    model.edges.push([1, 5]);
    model.edges.push([2, 6]);
    model.edges.push([3, 7]);

    let newModel = {type: type, center: center, height: height, width: width, depth: depth, vertices: vertices, edges: edges};
    return newModel;
}

function drawCone(model){
    let sides = model.sides;
    let center = model.center;
    let height = model.height;
    let radius = model.radius;
    let tip = Vector4(center.x, center.y+(height/2), center.z, 1);
    for(let i = 0; i < sides; i++){     //create vertices
        //create coordinate for the original point in regards to x,z
        let radian = degreeToRadian((360/sides)*i);
        let x0 = center.x + radius*Math.cos(radian);
        let z0 = center.z + radius*Math.sin(radian);

        //create coordinate for the next point in regards to x,z
        radian = degreeToRadian((360/sides)*(i+1));
        let x1 = center.x + radius*Math.cos(radian);
        let z1 = center.z + radius*Math.sin(radian);
        
        //creating points
        let p0 = Vector4(x0, center.y-(height/2), z0, 1);
        let p1 = Vector4(x1, center.y-(height/2), z1, 1);
        // let p1 = Vector4()
        console.log(p0);
        console.log(p1);
        model.vertices.push(p0, p1);
        model.vertices.push(p0, tip, p1);
        // model.vertices.push(p1);
    }
    
    for(let i = 0; i < model.vertices.length; i++){
        let circle = [i,(i+1) % model.vertices.length];
        // let cone = [0, (i+1) % model.vertices.length];
        model.edges.push(circle);
        // model.edges.push(cone);
    }
    return model;
}

function degreeToRadian(degrees){
    return degrees*Math.PI/180;
}

function drawCylinder(model){
    let sides = model.sides;
    let radius = model.radius;
    let center = model.center;
    let height = model.height;
    let linesArray;
    for(let i = 0; i < sides; i++){
        //point x and z
        let radian = degreeToRadian((360/sides)*i);
        //create coordinates for p0 (bottom)
        let x0 = center.x + radius*Math.cos(radian);
        let z0 = center.z + radius*Math.sin(radian);
        //create coordinates for p2 (top)
        let x2 = center.x + radius*Math.cos(radian);
        let z2 = center.z + radius*Math.sin(radian);

        radian = degreeToRadian((360/sides)*(i+1));
        //create coordinates for p1 (bottom next point)
        let x1 = center.x + radius*Math.cos(radian);
        let z1 = center.z + radius*Math.sin(radian);
        //create coordinates for p3 (top next point)
        let x3 = center.x + radius*Math.cos(radian);
        let z3 = center.z + radius*Math.sin(radian);
        
        //creating points, top and bottom
        let p0 = Vector4(x0, center.y-(height/2), z0, 1);
        let p1 = Vector4(x1, center.y-(height/2), z1, 1);
        let p2 = Vector4(x2, center.y+(height/2), z2, 1);
        let p3 = Vector4(x3, center.y+(height/2), z3, 1);

        /**
         * p0 = bot,  p1 = bot next point
         * p2 = top,  p3 = top next point
         */
        model.vertices.push(p0, p2);
        model.vertices.push(p0, p1);
        model.vertices.push(p2, p3);
        // model.vertices.push(p0);
        // model.vertices.push(p1);
        // model.vertices.push(p2);
        // model.vertices.push(p3);
    }
    for(let i = 0; i < model.vertices.length; i++){
        let circleEdges;
        // circleEdges = [i, (i+1) % model.vertices.length, (i+3)% model.vertices.length, (i+2) % model.vertices.length, i];
        if(i%2 == 0){
            circleEdges = [i, (i+2) % model.vertices.length];
            linesArray = [i, i+1];
        } 
        else if(i%2 == 1){
            circleEdges = [i, (i+2) % model.vertices.length];
        }
        // let circleEdges = [i, (i+2) % model.vertices.length];
        if(i%2 == 0){
            linesArray = [i, i+1];
        }
        console.log(circleEdges);
        // console.log(linesArray);
        // console.log("\n");
        model.edges.push(circleEdges);
        model.edges.push(linesArray);
    }
    return model;
}

function drawSphere(model){
    //IDEA: Draw a sphere by first drawing a circle and then drawing more circles rotated along the z axis
    const sphere = Object.create(generic);
    let sides = model.sides;
    let center = model.center;
    let height = model.height;
    let width = model.width;
    let depth = model.depth;


    for(let i = 0; i < 180; i++){
        for(let i = 0; i < sides; i++){     //create vertices
            //old point x and z
            let radian = degreeToRadian((360/sides)*i);
            let x0 = center[0] + radius*Math.cos(radian);
            let z0 = center[2] + radius*Math.sin(radian);
    
            //new point x and z
            radian = degreeToRadian((360/sides)*(i+1));
            let x1 = center[0] + radius*Math.cos(radian);
            let z1 = center[2] + radius*Math.sin(radian);
            
            //creating points
            let p0 = Vector4(x0, center[1], z0, 1);
            let p1 = Vector4(z0, center[1], z1, 1);
            cone.vertices.push(p0);
            cone.vertices.push(p1);
        }
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

