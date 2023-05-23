import {
	generateRandomNumber,
	generateRandomNegativeNumber,
	generateRandomPositiveNumber
} from './utils.js';

export default class Ball {
	/**
	 * Represents a ball which will bounce back and forth between paddles
	 * and walls until it passes a left or right boundary of the screen,
	 * scoring a point for the opponent.
	 *
	 * @param {Number} x The ball's X coordinate.
	 * @param {Number} y The ball's Y coordinate.
	 * @param {Number} width The ball's width.
	 * @param {Number} height The ball's height.
	 */
	constructor(x, y, width, height, canvasHeight) {
		this.width = width;
		this.height = height;
		this.canvasHeight = canvasHeight;
		this.sounds = {
			paddleHit: new Audio('./sounds/paddle_hit.wav'),
			wallHit: new Audio('./sounds/wall_hit.wav'),
		};
		this.sounds.paddleHit.volume = 0.2;
		this.sounds.wallHit.volume = 0.2;
		this.image = document.getElementById("vathu")
		this.reset(x, y);
	}

	/**
	 * Position the ball at the specified coordinates
	 * and generate a new random velocity.
	 *
	 * @param {Number} x The X coordinate.
	 * @param {Number} y The Y coordinate.
	 * @param {Number} servingPlayer The ball will travel away from this player.
	 */
	reset(x, y, servingPlayer = 1) {
		this.x = x;
		this.y = y;
		this.dy = generateRandomNumber(400, 800);

		if (servingPlayer === 1) {
			this.dx = generateRandomPositiveNumber(400, 800);
		}
		else {
			this.dx = generateRandomNegativeNumber(400, 800);
		}
	}

	/**
	 * Expects a paddle as an argument and returns true or false,
	 * depending on whether their rectangles overlap.
	 *
	 * @param {Object} paddle
	 * @returns Whether or not there was a collision.
	 */
	didCollide(paddle) {
		/**
		 * First, check to see if the left edge of either is farther
		 * to the right than the right edge of the other. Then check
		 * to see if the bottom edge of either is higher than the top
		 * edge of the other.
		 */
		if (this.x < paddle.x + paddle.width
			&& paddle.x < this.x + this.width
			&& this.y < paddle.y + paddle.height
			&& paddle.y < this.y + this.height) {
			this.sounds.paddleHit.play();
			return true;
		}

		// If the above aren't true, they're overlapping.
		return false;
	}

	/**
	 * Update our ball based on its DX and DY only if we're in play state;
	 * scale the velocity by dt so movement is framerate-independent.
	 *
	 * @param {Number} dt Time since the last frame.
	 * @param {Object} player1
	 * @param {Object} player2
	 */
	update(dt, player1, player2) {
		/**
		 * Detect ball collision with paddles, reversing dx if true and
		 * slightly increasing it, then altering the dy based on the position
		 * of collision
		 */
		if (this.didCollide(player1) || this.didCollide(player2)) {
			this.dx = -this.dx * 1.03;

			// Keep velocity going in the same direction, but randomize it.
			if (this.dy < 0) {
				this.dy = generateRandomNegativeNumber(400, 800);
			}
			else {
				this.dy = generateRandomPositiveNumber(400, 800);
			}
		}

		// Detect upper and lower screen boundary collision and reverse if collided.
		if (this.y <= 0) {
			this.y = 0;
			this.dy = -this.dy;
			this.sounds.wallHit.play();
		}

		// -this.height to account for the ball's size.
		if (this.y >= this.canvasHeight - this.height) {
			this.y = this.canvasHeight - this.height;
			this.dy = -this.dy;
			this.sounds.wallHit.play();
		}

		this.x += this.dx * dt;
		this.y += this.dy * dt;
	}

	/**
	 * Draw the ball to the screen.
	 *
	 * @param {CanvasRenderingContext2D} context
	 */
	render(context) {
		context.fillStyle = "yellow";
		//context.fillRect(this.x, this.y, this.width, this.height);
		context.drawImage(this.image, this.x - (this.width / 2), this.y - (this.height / 2))
	}
}
