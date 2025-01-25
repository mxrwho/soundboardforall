document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 800;
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#FF00FF"; // Magenta background
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const cellSize = 100;
    const keySpacing = 20;
    const topPadding = 120; // Adjusted for full visibility
    const horizontalPadding = 50;
    const gridSizes = [4, 4, 6];
    const colors = {
        magentaOverlay: "#FF00FF",
        black: "#000000",
        red: "#FF0000",
        blue: "#0000FF",
        orange: "#FFA500",
        darkGreen: "#006400",
        yellow: "#FFFF00",
        lightBlue: "#ADD8E6",
        lightGreen: "#90EE90",
        pink: "#FFB6C1",
        pressed: "#00FF00",
    };

    const keyMappings = [
        ["a", "f", "g", "h", "l", "z", "c", "v", "n", "m", "s", "b", "u", "i", "p"],
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "[", ",", ";"],
        ["q (They_are)", "w (We_are)", "e (You_are)", "r (She_is)", "t (He_is)", "y (I_am)"]
    ];

    const soundFiles = {
        a: "sounds/a.wav",
        f: "sounds/f.wav",
        g: "sounds/g.wav",
        h: "sounds/h.wav",
        l: "sounds/l.wav",
        z: "sounds/z.wav",
        c: "sounds/c.wav",
        v: "sounds/v.wav",
        n: "sounds/n.wav",
        m: "sounds/m.wav",
        s: "sounds/s.wav",
        b: "sounds/b.wav",
        u: "sounds/u.wav",
        i: "sounds/i.wav",
        p: "sounds/p.wav",
        "1": "sounds2/1.wav",
        "2": "sounds2/2.wav",
        "3": "sounds2/3.wav",
        "4": "sounds2/4.wav",
        "5": "sounds2/5.wav",
        "6": "sounds2/6.wav",
        "7": "sounds2/7.wav",
        "8": "sounds2/8.wav",
        "9": "sounds2/9.wav",
        "0": "sounds2/0.wav",
        "-": "sounds2/-.wav",
        "=": "sounds2/=.wav",
        "[": "sounds2/[.wav",
        ",": "sounds2/,.wav",
        ";": "sounds2/;.wav",
        "q (They_are)": "sounds3/q (They_are).wav",
        "w (We_are)": "sounds3/w (We_are).wav",
        "e (You_are)": "sounds3/e (You_are).wav",
        "r (She_is)": "sounds3/r (She_is).wav",
        "t (He_is)": "sounds3/t (He_is).wav",
        "y (I_am)": "sounds3/y (I_am).wav"
    };

    const pressedKeys = new Set();

    class AnimatedKey {
        constructor() {
            this.baseRadius = cellSize / 2;
            this.currentRadius = this.baseRadius;
            this.pulsateSpeed = 1;
            this.colorShift = Math.random() * 360; // Start hue at a random point
        }

        update() {
            this.currentRadius += this.pulsateSpeed;
            this.colorShift = (this.colorShift + 1) % 360;
            if (this.currentRadius >= this.baseRadius + 10 || this.currentRadius <= this.baseRadius - 10) {
                this.pulsateSpeed = -this.pulsateSpeed;
            }
        }

        getRadius() {
            return this.currentRadius;
        }

        getColor() {
            return `hsl(${this.colorShift}, 100%, 60%)`;
        }
    }

    const animatedKeys = keyMappings.map(group => group.map(() => new AnimatedKey()));

    function drawGrid(keys, offsetX, offsetY, gridSize, groupIndex) {
        keys.forEach((key, index) => {
            const col = index % gridSize;
            const row = Math.floor(index / gridSize);

            const x = offsetX + col * (cellSize + keySpacing);
            const y = offsetY + row * (cellSize + keySpacing);

            const animatedKey = animatedKeys[groupIndex][index];
            animatedKey.update();
            const radius = animatedKey.getRadius();
            const color = pressedKeys.has(key) ? colors.pressed : animatedKey.getColor();

            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors.black;
            ctx.stroke();

            ctx.fillStyle = colors.black;
            ctx.font = "14px Menlo";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(key.replace(/_/g, " "), x + cellSize / 2, y + cellSize / 2);
        });
    }

    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw magenta overlay with alpha blending for pinkish effect
        ctx.fillStyle = colors.magentaOverlay;
        ctx.globalAlpha = 0.3; // Lighter overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;

        // Draw the grids
        const grid3XCentered = (canvas.width - gridSizes[2] * (cellSize + keySpacing)) / 2;
        drawGrid(keyMappings[2], grid3XCentered, topPadding, gridSizes[2], 2);

        const grid1X = horizontalPadding;
        const grid2X = canvas.width - horizontalPadding - gridSizes[1] * (cellSize + keySpacing);
        const grid1Y = topPadding + cellSize + 70;
        const grid2Y = grid1Y;

        drawGrid(keyMappings[0], grid1X, grid1Y, gridSizes[0], 0);
        drawGrid(keyMappings[1], grid2X, grid2Y, gridSizes[1], 1);
    }

    document.addEventListener("keydown", (event) => {
        const key = event.key;
        if (soundFiles[key]) {
            if (!pressedKeys.has(key)) {
                pressedKeys.add(key);
                const audio = new Audio(soundFiles[key]);
                audio.play();
                drawScene();
            }
        } else {
            const labeledKey = keyMappings.flat().find(k => k.startsWith(key));
            if (labeledKey && soundFiles[labeledKey]) {
                if (!pressedKeys.has(labeledKey)) {
                    pressedKeys.add(labeledKey);
                    const audio = new Audio(soundFiles[labeledKey]);
                    audio.play();
                    drawScene();
                }
            }
        }
    });

    document.addEventListener("keyup", (event) => {
        const key = event.key;
        if (pressedKeys.has(key)) {
            pressedKeys.delete(key);
            drawScene();
        } else {
            const labeledKey = keyMappings.flat().find(k => k.startsWith(key));
            if (labeledKey && pressedKeys.has(labeledKey)) {
                pressedKeys.delete(labeledKey);
                drawScene();
            }
        }
    });

     document.addEventListener("click", () => {
        const video = document.getElementById("myVideo");
        video.muted = false; // Unmute
        video.play();        // Ensure it plays
    });
    
    drawScene();
});
