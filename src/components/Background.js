let currentColor = "Pink";

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('animated-bg');
    const ctx = canvas.getContext('2d');
    let circles = [];

    // Configuration
    const circleDiameter = 100;
    const x_margin = 200; // 100px margin on left and right
    const y_margin = 50; // 50px margin on top and bottom
    const x_spacing = x_margin + circleDiameter; // Total space between centers
    const y_spacing = y_margin + circleDiameter; // Total space between centers
    const movementSpeed = 3;
    const diagonalAngle = (3 * Math.PI) / 4; // 135 degrees

    const colors = {
        Pink: 'rgb(255, 219, 241)',  // pink #ffdbf1
        Blue: 'rgb(156, 202, 255)',  // blue #9ccaff
        Purple: 'rgb(169, 165, 255)',  // purple #a9a5ff
        Green: 'rgb(159, 243, 189)'   // green #9ff3bd
    };


    class Circle {
        constructor(x, y) {
            this.baseX = x;
            this.baseY = y;
            this.x = x;
            this.y = y;
            this.radius = circleDiameter / 2;
            this.color = colors[currentColor];
        }

        update(offsetX, offsetY) {
            // Move diagonally
            this.x = this.baseX + offsetX;
            this.y = this.baseY + offsetY;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;

            // Subtle glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    function initCircles() {
        circles = [];

        // Calculate how many circles fit with margins
        const cols = Math.ceil(canvas.width / x_spacing) + 2;
        const rows = Math.ceil(canvas.height / y_spacing) + 2;

        // Create grid with proper margins
        for (let r = 0; r < rows; r++) {
            const rowOffset = (r % 2) * (x_spacing / 2);

            for (let c = 0; c < cols; c++) {
                // Position with 50px margin from edges
                const x = x_margin + (c * x_spacing) + rowOffset;
                const y = y_margin + (r * y_spacing);
                circles.push(new Circle(x, y));

                // Create additional circles for seamless looping
                circles.push(new Circle(x - cols * x_spacing, y - rows * x_spacing));
                circles.push(new Circle(x - cols * x_spacing, y));
                circles.push(new Circle(x, y - rows * x_spacing));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate movement offset (bottom-left to top-right)
        const time = Date.now() * 0.01;
        const offsetX = (time * movementSpeed * Math.cos(diagonalAngle)) % (x_spacing * 2);
        const offsetY = -(time * movementSpeed * Math.sin(diagonalAngle)) % (y_spacing * 2);

        for (const circle of circles) {
            circle.update(offsetX, offsetY);
            circle.draw();
        }

        requestAnimationFrame(animate);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initCircles();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
});