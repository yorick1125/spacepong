export default class Paddle {
	/**
	 * Represents a paddle that can move up and down. Used in the
	 * main program to deflect the ball back toward the opponent.
	 *
	 * @param {Number} x The paddle's X coordinate.
	 * @param {Number} y The paddle's Y coordinate.
	 * @param {Number} width The paddle's width.
	 * @param {Number} height The paddle's height.
	 * @param {*} canvasHeight The height of the canvas.
	 */
	constructor(x, y, width, height, canvasHeight, isAi = false) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.canvasHeight = canvasHeight;
		this.dy = 0;
		this.maxSpeed = 1000;
		this.direction = -1;
		this.isAi = isAi;
	}

	moveUp() {
		this.dy = -this.maxSpeed;
	}

	moveDown() {
		this.dy = this.maxSpeed;
	}

	stop() {
		this.dy = 0;
	}

	/**
	 * Update our ball based on its DX and DY only if we're in play state;
	 * scale the velocity by dt so movement is framerate-independent.
	 *
	 * @param {Number} dt Time since the last frame.
	 */
	update(dt) {

		/**
		 * Math.max here ensures that we're the greater of 0 or the player's
		 * current calculated Y position when pressing up so that we don't
		 * go into the negatives; the movement calculation is simply our
		 * previously-defined paddle speed scaled by dt.
		 */
		if (this.dy < 0) {
			this.y = Math.max(0, this.y + this.dy * dt);
		}
		/**
		 * Similar to before, this time we use Math.min to ensure we don't
		 * go any farther than the bottom of the screen minus the paddle's
		 * height (or else it will go partially below, since position is
		 * based on its top left corner).
		 */
		else {
			this.y = Math.min(this.canvasHeight - this.height, this.y + this.dy * dt);
		}
		
	}

	/**
	 * Draw the ball to the screen.
	 *
	 * @param {CanvasRenderingContext2D} context
	 */
	render(context) {
		if(this.isAi){
			context.fillStyle = "blue";
		}
		else{
			context.fillStyle = "red";
		}
		context.fillRect(this.x, this.y, this.width, this.height);
		context.fillStyle = "white";

	}
}
