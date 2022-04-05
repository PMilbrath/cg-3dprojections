// create a 4x4 matrix to the parallel projection / view matrix
function mat4x4Parallel(prp, srp, vup, clip) {
    // 1. translate PRP to origin
    let transPrP = new Matrix(4,4);
    Mat4x4Translate(transPrP,-prp[0],-prp[1],-prp[2]);
    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
    let rotVRC = new Matrix(4,4);
    // 3. shear such that CW is on the z-axis
    let shearMat = new Matrix(4,4);
    let dopx = (clip[0]+clip[1])/2 - prp[0];
    let dopy = (clip[2]+clip[3])/2 - prp[1];
    let dopz = (clip[4]+clip[5])/2 - prp[2];
    let shx = -dopx/dopz;
    let shy = -dopy/dopz;
    Mat4x4ShearXY(shearMat,shx,shy);
    // 4. translate near clipping plane to origin
    let transOrg = new Matrix(4,4);
    Mat4x4Translate(transOrg,0,0,clip[4]);
    // 5. scale such that view volume bounds are ([-1,1], [-1,1], [-1,0])
    let scaleMat = new Matrix(4,4);
    let sperX = 2/(clip[1]-clip[0]);
    let sperY = 2/(clip[3]-clip[2]);
    let sperZ = 1/(clip[5]);
    Mat4x4Scale(scaleMat,sperX,sperY,sperZ);
    // ...
    // let transform = Matrix.multiply([...]);
    // return transform;
}


// create a 4x4 matrix to the perspective projection / view matrix
function mat4x4Perspective(prp, srp, vup, clip) {
    // 1. translate PRP to origin
    let transPrP = new Matrix(4,4);
    Mat4x4Translate(transPrP,-prp.x,-prp.y,-prp.z);

    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
    let rotVRC = new Matrix(4,4);
    let nx = prp.x-srp.x;
    let ny = prp.y-srp.y;
    let nz = prp.z-srp.z;
    let ntot = nx+ny+nz;
    let n = Vector3(nx/ntot,ny/ntot,nz/ntot);
    let u = vup.cross(n);
    

    // 3. shear such that CW is on the z-axis
    let shearMat = new Matrix(4,4);
    let dopx = (clip[0]+clip[1])/2 - prp[0];
    let dopy = (clip[2]+clip[3])/2 - prp[1];
    let dopz = (clip[4]+clip[5])/2 - prp[2];
    let shx = -dopx/dopz;
    let shy = -dopy/dopz;
    Mat4x4ShearXY(shearMat,shx,shy);

    // 4. scale such that view volume bounds are ([z,-z], [z,-z], [-1,zmin])
    let scaleMat = new Matrix(4,4);
    let sperX = (2*clip[4])/((clip[1]-clip[0])*clip[5]);
    let sperY = (2*clip[4])/((clip[3]-clip[2])*clip[5]);
    let sperZ = 1/(clip[5]);
    Mat4x4Scale(scaleMat,sperX,sperY,sperZ);

    // ...
    // let transform = Matrix.multiply([...]);
    // return transform;
}

// create a 4x4 matrix to project a parallel image on the z=0 plane
function mat4x4MPar() {
    let mpar = new Matrix(4, 4);
     mpar.values = [[1,0,0,0],
                    [0,1,0,0],
                    [0,0,0,0],
                    [0,0,0,1]];
    return mpar;
}

// create a 4x4 matrix to project a perspective image on the z=-1 plane
function mat4x4MPer() {
    let mper = new Matrix(4, 4);
     mper.values = [[1,0,0,0],
                    [0,1,0,0],
                    [0,0,1,0],
                    [0,0,-1,0]];
    return mper;
}



///////////////////////////////////////////////////////////////////////////////////
// 4x4 Transform Matrices                                                         //
///////////////////////////////////////////////////////////////////////////////////

// set values of existing 4x4 matrix to the identity matrix
function mat4x4Identity(mat4x4) {
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the translate matrix

function Mat4x4Translate(mat4x4, tx, ty, tz) {
     
    mat4x4.values = [[1, 0, 0, tx],
                     [0, 1, 0, ty],
                     [0, 0, 1, tz],
                     [0, 0, 0, 1]];

}

// set values of existing 4x4 matrix to the scale matrix
function Mat4x4Scale(mat4x4, sx, sy, sz) {
     
    mat4x4.values = [[sx, 0, 0, 0],
                     [0, sy, 0, 0],
                     [0, 0, sz, 0],
                     [0, 0, 0, 1]];
    
}

// set values of existing 4x4 matrix to the rotate about x-axis matrix
function Mat4x4RotateX(mat4x4, theta) {
    mat4x4.values = [[1, 0, 0, 0],
                     [0, Math.cos(theta), -Math.sin(theta), 0],
                     [0, Math.sin(theta), Math.cos(theta), 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the rotate about y-axis matrix
function Mat4x4RotateY(mat4x4, theta) {
    mat4x4.values = [[Math.cos(theta), 0, Math.sin(theta), 0],
                     [0, 1, 0, 0],
                     [-Math.sin(theta), 0, Math.cos(theta), 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the rotate about z-axis matrix
function Mat4x4RotateZ(mat4x4, theta) {
    mat4x4.values = [[Math.cos(theta), -Math.sin(theta), 0, 0],
                     [Math.sin(theta), Math.cos(theta), 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
}

// set values of existing 4x4 matrix to the shear parallel to the xy-plane matrix
function Mat4x4ShearXY(mat4x4, shx, shy) {
    
    mat4x4.values = [[1, 0, shx, 0],
                     [0, 1, shy, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
}

// create a new 3-component vector with values x,y,z
function Vector3(x, y, z) {
    let vec3 = new Vector(3);
    vec3.values = [x, y, z];
    return vec3;
}

// create a new 4-component vector with values x,y,z,w
function Vector4(x, y, z, w) {
    let vec4 = new Vector(4);
    vec4.values = [x, y, z, w];
    return vec4;
}
