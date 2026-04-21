<script>
	import { onMount, onDestroy } from 'svelte';

	let {
		data,
		positions,    // Map<id, {x, y}>
		personColors, // Map<id, colorString>
		personSize,
		zoomId = null,
		zoomLabel = null,
		padding = 20,
		topPadding = 20,
		w,
		h
	} = $props();

	// Mutable state object read by the p5 sketch each frame.
	const state = {
		data: [],
		positions: new Map(),
		personColors: new Map(),
		personSize: 20,
		padding: 20,
		topPadding: 20,
		w: 0,
		h: 0,
		zoomId: null,
		zoomLabel: null,
		zoom: 1
	};

	$effect(() => {
		state.data = data;
		state.positions = positions;
		state.personColors = personColors;
		state.personSize = personSize;
		state.padding = padding;
		state.topPadding = topPadding;
		state.w = w;
		state.h = h;
		state.zoomId = zoomId;
		state.zoomLabel = zoomLabel;
	});

	let container;
	let p5Instance;

	// Sprite sheet constants
	const zoomSpeed = 0.06; // lerp rate for zoom (0 = never zooms, 1 = instant)
	const zoomLevel = 5;    // how much to zoom in on the selected person
	const spriteWidth  = 400 / 8;
	const spriteHeight = 1000 / 10;
	const spriteRows   = 10;
	const spriteCols   = 8;
	const spriteRowLabels = ['f-left','m-left','f-right','m-right','f-stand','m-stand','f-down','m-down','f-up','m-up'];
	const spriteKeys = ['01-blackpurple','02-blackpurple','03-blackpurple','04-blackpurple'];
	const races = ['01','02','03','04'];

	class Person {
		constructor(p, state, person, canvasW, canvasH) {
			this.p = p;
			this.state = state;
			this.id = person.id;
			this.race = races[Math.floor(Math.random() * races.length)];
			this.gender = person.d?.[2] === 'Male' ? 'm' : 'f';
			this.loc = p.createVector(p.random(canvasW) - canvasW / 2, -state.personSize * 2);
			this.target_loc = p.createVector(0, 0);
			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
			this.topSpeed = p.random(6, 9);
			this.distance = 100;
			this.frameCount = 0;
		}

		seek(collide) {
			const { p, state } = this;
			const isMe = this.id === state.zoomId;

			if (collide[0] !== 0 || collide[1] !== 0) {
				this.acc.add(p.createVector(collide[0] / 30, collide[1] / 30));
			}

			const target = state.positions.get(this.id);
			if (target) {
				const ps = state.personSize;
				// Offset by canvas center since we translate(w/2, h/2) before drawing
				this.target_loc.x = target.x + ps / 2 + state.padding - state.w / 2;
				this.target_loc.y = target.y + ps + state.topPadding - state.h / 2;
			}

			// Same logic as original: when zoomed past threshold, non-zoomed go off top
			let seekX, seekY;
			if (isMe && state.zoom > 2) {
				seekX = 0;
				seekY = 0;
			} else if (!isMe && state.zoom > 2) {
				seekX = this.loc.x;
				seekY = -60 - state.h / 2; // off top accounting for translate origin
			} else {
				seekX = this.target_loc.x;
				seekY = this.target_loc.y;
			}

			const desired = p.createVector(seekX - this.loc.x, seekY - this.loc.y);
			this.distance = (!isMe && state.zoom > 2) ? 999 : desired.mag();
			desired.normalize();
			const speed =
				this.distance < 100
					? p.map(this.distance, 0, 100, 0, this.topSpeed)
					: this.topSpeed;
			desired.mult(speed);
			this.vel.lerp(desired, 0.2);

			if (this.distance < 3) {
				this.vel.mult(0.5);
			} else {
				this.acc.x += p.random(-0.05, 0.05);
				this.acc.y += p.random(-0.05, 0.05);
			}
		}

		update() {
			const { state } = this;

			this.vel.add(this.acc);
			this.vel.limit(this.topSpeed);
			this.loc.add(this.vel);
			this.acc.mult(0);
			const ps = state.personSize;
			this.loc.x = Math.max(-state.w / 2 + ps / 2, Math.min(state.w / 2 - ps / 2, this.loc.x));
		}

		display(sprites) {
			const { p, state } = this;
			const ps = state.personSize;
			const color = state.personColors.get(this.id) || '#e2e8f0';

			p.noStroke();
			p.fill(color);
			p.rect(this.loc.x - ps / 2, this.loc.y - ps, ps, ps * 2);

			const spriteKey = this.race + '-blackpurple';
			const spriteSheet = sprites[spriteKey];
			if (!spriteSheet) return;

			let rowLabel;
			if (this.distance < 4 && (Math.abs(this.vel.x) + Math.abs(this.vel.y)) < 1) {
				rowLabel = this.gender + '-stand';
				this.frameCount += 0.1;
			} else if (this.vel.y > 0 && this.vel.y > Math.abs(this.vel.x)) {
				rowLabel = this.gender + '-down';
				this.frameCount += Math.max(0.1, (Math.abs(this.vel.x) + Math.abs(this.vel.y)) / 8);
			} else if (this.vel.y < 0 && Math.abs(this.vel.y) > Math.abs(this.vel.x)) {
				rowLabel = this.gender + '-up';
				this.frameCount += Math.max(0.1, (Math.abs(this.vel.x) + Math.abs(this.vel.y)) / 8);
			} else {
				rowLabel = this.gender + (this.vel.x < 0 ? '-left' : '-right');
				this.frameCount += Math.max(0.1, (Math.abs(this.vel.x) + Math.abs(this.vel.y)) / 10);
			}

			const frames = spriteSheet[rowLabel];
			if (!frames || frames.length === 0) return;

			const frameIdx = Math.floor(this.frameCount) % frames.length;
			p.image(frames[frameIdx], this.loc.x - ps / 2, this.loc.y - ps, ps, ps * 2);

			// Draw zoom label above the person when zoomed in
			const isMe = this.id === state.zoomId;
			if (isMe && state.zoom > 2 && state.zoomLabel) {
				const label = state.zoomLabel;
				const fontSize = ps * .5;
				const padding = fontSize * 0.5;
				const boxW = p.textWidth(label) + padding * 2;
				const boxH = fontSize + padding;
				const bx = this.loc.x - boxW / 2;
				const by = this.loc.y - ps - boxH - fontSize * 0.3;

				p.textSize(fontSize);
				p.noStroke();

				// Background pill
				p.fill(255);
				p.rect(bx, by, boxW, boxH, boxH / 2);

				// Text
				p.fill(30);
				p.textAlign(p.CENTER, p.CENTER);
				p.text(label, this.loc.x, by + boxH / 2);
			}
		}
	}

	const sketch = (p) => {
		let all_people = [];
		let canvasW = 0;
		let canvasH = 0;
		let zoom = 1;
		let targetZoom = 1;

		const sprites = {};
		for (const key of spriteKeys) {
			sprites[key] = {};
		}

		p.setup = async () => {
			canvasW = state.w || 1;
			canvasH = state.h || 1;
			p.createCanvas(canvasW, canvasH);
			p.noSmooth();

			await Promise.all(
				spriteKeys.map(async (key) => {
					const sheet = await p.loadImage('assets/leftovers/' + key + '.png');
					for (let col = 0; col < spriteCols; col++) {
						for (let row = 0; row < spriteRows; row++) {
							const x = col * spriteWidth;
							const y = row * spriteHeight;
							const frame = sheet.get(x, y + 2, spriteWidth, spriteHeight - 2);
							const label = spriteRowLabels[row];
							if (!sprites[key][label]) sprites[key][label] = [];
							sprites[key][label].push(frame);
						}
					}
				})
			);
		};

		p.draw = () => {
			if (state.w > 0 && state.h > 0 && (state.w !== canvasW || state.h !== canvasH)) {
				canvasW = state.w;
				canvasH = state.h;
				p.resizeCanvas(canvasW, canvasH);
			}

			p.background(255);

			if (all_people.length === 0 && state.data.length > 0) {
				all_people = state.data.map((person) => new Person(p, state, person, canvasW, canvasH));
			}

			// Zoom target: scale up when a person is zoomed
			targetZoom = state.zoomId !== null ? zoomLevel : 1;
			zoom = p.lerp(zoom, targetZoom, zoomSpeed);
			state.zoom = zoom; // expose to Person.seek()

			// Apply zoom from canvas center
			p.translate(canvasW / 2, canvasH / 2);
			p.scale(zoom);

			// Update and draw all people
			for (let i = 0; i < all_people.length; i++) {
				const collide = checkCollision(all_people[i], i, all_people, state.personSize);
				all_people[i].seek(collide);
				all_people[i].update();
				all_people[i].display(sprites);
			}
		};
	};

	function checkCollision(person, n, all_people, personSize) {
		const ps = personSize;
		for (let i = 0; i < all_people.length; i++) {
			if (i !== n) {
				if (
					Math.abs(all_people[i].loc.x - person.loc.x) < ps / 2 &&
					Math.abs(all_people[i].loc.y - person.loc.y) < ps
				) {
					return [
						person.loc.x - all_people[i].loc.x,
						person.loc.y - all_people[i].loc.y
					];
				}
			}
		}
		return [0, 0];
	}

	onMount(async () => {
		const { default: P5 } = await import('p5');
		p5Instance = new P5(sketch, container);
	});

	onDestroy(() => {
		p5Instance?.remove();
	});
</script>

<div bind:this={container} style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>