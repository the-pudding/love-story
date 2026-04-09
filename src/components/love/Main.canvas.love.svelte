<script>
	import { onMount, onDestroy } from 'svelte';

	let {
		data,
		positions,    // Map<id, {x, y}>
		personColors, // Map<id, colorString>
		personSize,
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
		h: 0
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
	});

	let container;
	let p5Instance;

	// Sprite sheet constants (same as leftovers)
	const spriteWidth  = 400 / 8;   // 50px per frame
	const spriteHeight = 1000 / 10; // 100px per frame
	const spriteRows   = 10;
	const spriteCols   = 8;
	const spriteRowLabels = ['f-left','m-left','f-right','m-right','f-stand','m-stand','f-down','m-down','f-up','m-up'];

	// We use a single color variant ("blackpurple") for all sprites.
	// The person's actual data color is shown via the background rect.
	const spriteKeys = ['01-blackpurple','02-blackpurple','03-blackpurple','04-blackpurple'];

	const races = ['01','02','03','04'];

	class Person {
		constructor(p, state, person, canvasW, canvasH) {
			this.p = p;
			this.state = state;
			this.id = person.id;
			this.race = races[Math.floor(Math.random() * races.length)];
			this.gender = person.d?.[2] === 'Male' ? 'm' : 'f';
			this.loc = p.createVector(p.random(canvasW), -state.personSize * 2);
			this.target_loc = p.createVector(canvasW / 2, canvasH / 2);
			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
			this.topSpeed = p.random(3, 6);
			this.distance = 100;
			this.frameCount = 0;
		}

		seek(collide) {
			const { p, state } = this;

			if (collide[0] !== 0 || collide[1] !== 0) {
				this.acc.add(p.createVector(collide[0] / 30, collide[1] / 30));
			}

			const target = state.positions.get(this.id);
			if (target) {
				const ps = state.personSize;
				this.target_loc.x = target.x + ps / 2 + state.padding;
				this.target_loc.y = target.y + ps + state.topPadding;
			}

			const desired = p.createVector(
				this.target_loc.x - this.loc.x,
				this.target_loc.y - this.loc.y
			);
			this.distance = desired.mag();
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
			this.vel.add(this.acc);
			this.vel.limit(this.topSpeed);
			this.loc.add(this.vel);
			this.acc.mult(0);
			// Keep within horizontal canvas bounds
			const ps = this.state.personSize;
			this.loc.x = Math.max(ps / 2, Math.min(this.state.w - ps / 2, this.loc.x));
		}

		display(sprites) {
			const { p, state } = this;
			const ps = state.personSize;
			const color = state.personColors.get(this.id) || '#e2e8f0';

			// Background color rect (shows the person's metric color)
			p.noStroke();
			p.fill(color);
			p.rect(this.loc.x - ps / 2, this.loc.y - ps, ps, ps * 2);

			// Sprite on top
			const spriteKey = this.race + '-blackpurple';
			const spriteSheet = sprites[spriteKey];
			if (!spriteSheet) return;

			// Pick animation row based on velocity direction
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
		}
	}

	const sketch = (p) => {
		let all_people = [];
		let canvasW = 0;
		let canvasH = 0;

		// sprites[key][rowLabel] = [frame0, frame1, ...]
		const sprites = {};
		for (const key of spriteKeys) {
			sprites[key] = {};
		}

		p.setup = async () => {
			canvasW = state.w || 1;
			canvasH = state.h || 1;
			p.createCanvas(canvasW, canvasH);
			p.noSmooth();

			// Load all sprite sheets in parallel then slice into frames
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
