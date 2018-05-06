var gl,
    shaderProgram,
    vertices,
    matrix = mat4.create(),
    vertexCount = 36;

initGL();
createShaders();
createVertices();

draw(gl.TRIANGLES);
getAttributes();
getUniforms();

function initGL() {
    var canvas = document.getElementById("canvas");
    console.log(canvas);
    gl = canvas.getContext("webgl");
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
}

function createShaders() {
    var vertexShader = getShader(gl, "shader-vs");
    var fragmentShader = getShader(gl, "shader-fs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}

function createVertices() {
    vertices = [
    0.88, -0.25, -0.18,     1, 0, 0, 1,
    0.9, 0.25, 0,           1, 0, 0, 1,
    0.88, -0.25, 0.18,      1, 0, 0, 1,

    0.85, -0.25, 0.29,      1, 1, 0, 1,
    0.78, 0.25, 0.45,       1, 1, 0, 1,
    0.67, -0.25, 0.6,       1, 1, 0, 1,

    0.6, -0.25, 0.67,       0, 1, 0, 1,
    0.45, 0.25, 0.78,       0, 1, 0, 1,
    0.29, -0.25, 0.85,      0, 1, 0, 1,

    0.18, -0.25, 0.88,      0, 1, 1, 1,
    0, 0.25, 0.9,           0, 1, 1, 1,
    -0.18, -0.25, 0.88,     0, 1, 1, 1,

    -0.29, -0.25, 0.85,     0, 0, 1, 1,
    -0.45, 0.25, 0.78,      1, 1, 0, 1,
    -0.6, -0.25, 0.67,      0, 0, 1, 1,

    -0.67, -0.25, 0.6,      1, 0, 1, 1,
    -0.78, 0.25, 0.45,      1, 0, 1, 1,
    -0.85, -0.25, 0.29,     1, 0, 1, 1,

    -0.88, -0.25, 0.18,     1, 0.5, 0, 1,
    -0.9, 0.25, 0,          1, 0.5, 0, 1,
    -0.88, -0.25, -0.18,    1, 0.5, 0, 1,

    -0.85, -0.25, -0.29,    0, 0.5, 1, 1,
    -0.78, 0.25, -0.45,     0, 0.5, 1, 1,
    -0.67, -0.25, -0.6,     0, 0.5, 1, 1,

    -0.6, -0.25, -0.67,     0, 1, 0.5, 1,
    -0.45, 0.25, -0.78,     0, 1, 0.5, 1,
    -0.29, -0.25, -0.85,    0, 1, 0.5, 1,

    -0.18, -0.25, -0.88,    1, 0, 0.5, 1,
    0, 0.25, -0.9,          1, 0, 0.5, 1,
    0.18, -0.25, -0.88,     1, 0, 0.5, 1,

    0.29, -0.25, -0.85,     0.5, 1, 0, 1,
    0.45, 0.25, -0.78,      0.5, 1, 0, 1,
    0.6, -0.25, -0.67,      0.5, 1, 0, 1,

    0.67, -0.25, -0.6,      0.5, 0, 1, 1,
    0.78, 0.25, -0.45,      0.5, 0, 1, 1,
    0.85, -0.25, -0.29,     0.5, 0, 1, 1
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var coords = gl.getAttribLocation(shaderProgram, "coords");
    //gl.vertexAttrib3f(coords, 0.5, 0.5, 0);
    // Same as bindAttribLocation, but does it for all the vertices in the gl.ARRAY_BUFFER
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
    gl.enableVertexAttribArray(coords);
    
    var colorsLocation = gl.getAttribLocation(shaderProgram, "colors");
    gl.vertexAttribPointer(colorsLocation, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(colorsLocation);
        
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
    gl.vertexAttrib1f(pointSize, 20);

    //var color = gl.getUniformLocation(shaderProgram, "color");
    //gl.uniform4f(color, 0.5, 0, 0.5, 1);
    
    // Implements the perspective
    var perspectiveMatrix = mat4.create();
    mat4.perspective(perspectiveMatrix, 1, canvas.width / canvas.height, 0.1, 11);
    
    var perspectiveLoc = gl.getUniformLocation(shaderProgram, "perspectiveMatrix");
    gl.uniformMatrix4fv(perspectiveLoc, false, perspectiveMatrix);
    
    mat4.translate(matrix, matrix, [0, 0, -2]);
}

function draw(shapeType) {    
    mat4.rotateX(matrix, matrix, -0.0035);
    mat4.rotateY(matrix, matrix, 0.01);
    mat4.rotateZ(matrix, matrix, 0.005);
    
    var transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");
    gl.uniformMatrix4fv(transformMatrix, false, matrix);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.drawArrays(shapeType, 0, vertexCount);
    
    requestAnimationFrame(function() {
        draw(shapeType);
    });
}

/*
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
 */
function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

    while (currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        // Unknown shader type
        return null;
    }
    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function getAttributes() {
    let history = document.getElementById("attributes"),
        numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
    
    history.innerHTML = '';

    for (let i = 0; i < numAttribs; ++i) {
        const info = gl.getActiveAttrib(shaderProgram, i);
        var li = document.createElement("li");
        
        str = "name: " + info.name + ", type: " + info.type + ", size: " + info.size;
        
        li.className = "list-group-item";
        li.appendChild(document.createTextNode(str));
        history.appendChild(li);
    }
}

function getUniforms() {
    let history = document.getElementById("uniforms"),
        numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
    
    history.innerHTML = '';

    for (let i = 0; i < numAttribs; ++i) {
        const info = gl.getActiveAttrib(shaderProgram, i);
        var li = document.createElement("li");
        
        str = "name: " + info.name + ", type: " + info.type + ", size: " + info.size;
        
        li.className = "list-group-item";
        li.appendChild(document.createTextNode(str));
        history.appendChild(li);
    }
}