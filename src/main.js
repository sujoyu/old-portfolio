
export default (document, window, id) => {

    class Ripple {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.maxSize = size;
            this.second = 0.7;
            this.elapsed = 0;

            this.shape = new createJs.Shape();
            this.shape.graphics.beginStroke('gray').drawEllipse(0, 0, this.maxSize, this.maxSize);
            this.shape.x = x;
            this.shape.y = y;
            this.shape.regX = this.maxSize / 2;
            this.shape.regY = this.maxSize / 2;
            this.shape.cache(0, 0, this.maxSize, this.maxSize);

            stage.addChild(this.shape);
        }
        draw(delta) {
            this.elapsed += delta;
            if (this.elapsed > this.second) {
                this.destroy();
                return;
            }

            const t = this.elapsed / this.second;
            this.shape.scale = t;
            this.shape.alpha = 1 - t;
        }
        destroy() {
            stage.removeChild(this.shape);
            const index = drawables.indexOf(this);
            if (index >= 0) {
                drawables.splice(index, 1);
            }
        }
    }

    class Bubble {
        constructor(x, y, size, alpha, alphaDelta, ugougo) {
            this.x = x;
            this.y = y;
            this.theta = Math.random();
            this.size = size;
            this.second = 3;
            this.elapsed = 0;
            this.alpha = alpha;
            this.alphaDelta = alphaDelta;
            this.ugougo = ugougo;

            this.shape = new createJs.Shape();
            this.shape.graphics.beginFill('#dddddd').drawEllipse(0, 0, this.size, this.size);
            this.shape.x = x;
            this.shape.y = y;
            this.shape.regX = this.size / 2;
            this.shape.regY = this.size / 2;
            this.shape.alpha = alpha;
            this.shape.cache(0, 0, this.size, this.size);

            stage.addChild(this.shape);
        }
        draw(delta) {
            this.elapsed += delta;
            if (this.elapsed > this.second + this.ugougo) {
                this.destroy();
                return;
            }

            if (this.elapsed < this.ugougo) {
                const t = this.elapsed / this.ugougo;
                this.shape.x = this.x + Math.sin(this.theta * 2 * Math.PI + 100 / this.size * this.elapsed) * this.size / 3;
                this.shape.y = this.y + Math.sin(this.theta * 2 * Math.PI + 100 / this.size * this.elapsed) * this.size / 3;
            } else {
                const t = (this.elapsed - this.ugougo) / this.second;
                this.shape.x = this.x + Math.sin(this.theta * 2 * Math.PI + 1000 / this.size * t) * this.size * t;
                this.shape.y = this.y - 100000 / this.size * t * t;
                this.shape.alpha = this.alpha * (1 - t * (1 + this.alphaDelta));
            }

        }
        destroy() {
            stage.removeChild(this.shape);
            const index = drawables.indexOf(this);
            if (index >= 0) {
                drawables.splice(index, 1);
                Bubble.create();
            }
        }
        static create() {
            drawables.push(new Bubble(
                Math.random() * stage.canvas.width,
                Math.random() * 150 + (stage.canvas.height + 30),
                50 + Math.random() * 150,
                Math.random(),
                Math.random(),
                Math.random() * 100
            ));
        }
    }

    const createJs = window.createjs;

    const canvas = document.createElement('canvas', {
        // transparent: true,
        // antialias: true,
    });
    canvas.setAttribute('id', 'bodyCanvas');

    const stage = new createJs.StageGL(canvas);
    stage.setClearColor('#FFFFFF');

    document.getElementById(id).appendChild(canvas);

    const hitArea = new createJs.Shape();
    hitArea.graphics.beginFill('black').drawRect(0, 0, 1, 1);

    window.addEventListener('resize', resize);
    resize();

    const container = new createJs.Container();
    container.hitArea = hitArea;

    stage.addChild(container);

    let drawables = [];

    for (let i = 1; i < 100; i++) {
        Bubble.create();
    }

    createjs.Ticker.on("tick", handleTick);

    function handleTick(event) {
        drawables.map((d) => {
            d.draw(event.delta/1000);
        });
        stage.update();
    }

    container.addEventListener('click', (ev) => {
        const x = ev.rawX;
        const y = ev.rawY;

        drawables.push(new Ripple(x, y, 400));
    });

    stage.addEventListener('stagemousemove', (ev) => {
        if (Math.random() > 0.95) {
            const x = ev.rawX;
            const y = ev.rawY;
            drawables.push(new Ripple(x, y, Math.random() * 200 + 100));
        }
    });

    function resize() {
        const displayWidth  = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        stage.canvas.width  = displayWidth;
        stage.canvas.height = displayHeight;

        hitArea.scaleX = displayWidth;
        hitArea.scaleY = displayHeight;

        stage.updateViewport(stage.canvas.width, stage.canvas.height);
    }
};
