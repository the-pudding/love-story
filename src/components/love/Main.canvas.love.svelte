<script>
	import { onMount, onDestroy } from "svelte";
	import copy from "$data/copy.json";
	const bgColor = getComputedStyle(document.documentElement)
		.getPropertyValue("--bgcolor")
		.trim();
	const textColor = "#a399a8";
	const hexToColorName = {
		"#b30057": "magenta",
		"#ff24bd": "pink",
		"#9629ba": "purple",
		"#826c91": "lavender",
		"#f8d255": "yellow",
		"#db8946": "peach",
		"#cec59f": "neutral",
		"#a68b7f": "neutral2"
	};
	const firstID = Number(copy.story[0]?.zoom_id) || null;
	let {
		data,
		positions, // Map<id, {x, y}>
		personColors, // Map<id, colorString>
		personSize,
		zoomId = null,
		zoomLabel = null,
		labels = [],
		padding = 20,
		topPadding = 20,
		w,
		h,
		onpersonclick = null,
		fastMode = false,
		introMode = false,
		zoomSprite = null
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
		labels: [],
		zoom: 1,
		introMode: false,
		zoomSprite: null
	};

	$effect(() => {
		state.data = data ?? [];
		state.positions = positions;
		state.personColors = personColors;
		state.personSize = personSize;
		state.padding = padding;
		state.topPadding = topPadding;
		state.w = w;
		state.h = h;
		state.zoomId = zoomId;
		state.zoomLabel = zoomLabel;
		state.labels = labels ?? [];
		state.onpersonclick = onpersonclick;
		state.fastMode = fastMode;
		state.introMode = introMode;
		state.zoomSprite = zoomSprite;
	});

	let container;
	let p5Instance;

	// Sprite sheet constants
	const zoomSpeed = 0.06;
	const zoomLevel = 6;
	const spriteAnimSpeed = 1.2;  // frame advance multiplier (higher = faster animation)
	const spriteWidthMin = 0.8;
	const spriteWidthMax = 1.4;
	const spriteHeightMin = 0.9;
	const spriteHeightMax = 1.2;
	const spriteMultiplier = 2;
	const spriteWidth = 400 / 8 * spriteMultiplier;
	const spriteHeight = 1000 / 10 * spriteMultiplier;
	const spriteRows = 10;
	const spriteCols = 8;
	const zoomSpriteWidth = 300;   // 2400 / 8
	const zoomSpriteHeight = 300;  // 1500 / 5
	const zoomSpriteRowIndex = { "meet": 0, "date": 1, "married": 2, "kids": 3, "thumbsup": 4 };
	const zoomSpriteFadeSpeed = 6; // alpha units per frame (0-255)
	const spriteRowLabels = [
		"f-left",
		"m-left",
		"f-right",
		"m-right",
		"f-stand",
		"m-stand",
		"f-down",
		"m-down",
		"f-up",
		"m-up"
	];
	const spriteKeys = [
		"00-intro", "00-intro1",
		"01-magenta", "02-magenta", "03-magenta", "04-magenta",
		"01-pink",    "02-pink",    "03-pink",    "04-pink",
		"01-purple",  "02-purple",  "03-purple",  "04-purple",
		"01-lavender","02-lavender","03-lavender","04-lavender",
		"01-yellow",  "02-yellow",  "03-yellow",  "04-yellow",
		"01-peach",   "02-peach",   "03-peach",   "04-peach",
		"01-neutral", "02-neutral", "03-neutral", "04-neutral",
		"01-neutral2","02-neutral2","03-neutral2","04-neutral2"
	];
	const raceOptions = {
		"Black, Non-Hispanic":  ["03", "04"],
		"Hispanic":             ["02", "03"],
		"White, Non-Hispanic":  ["01", "02"],
	};
	const raceOptionsFallback = ["01", "02", "03"];

	class Person {
		constructor(p, state, person, canvasW, canvasH) {
			this.p = p;
			this.state = state;
			this.id = person.id;
			const racePool = raceOptions[person.d?.[3]] ?? raceOptionsFallback;
			const tr = ((this.id * 3266489917) >>> 0) / 4294967295;
			this.race = racePool[Math.floor(tr * racePool.length)];
			const dataGender = person.d?.[1] === "Male" ? "m" : "f";
			const tg = ((this.id * 1597334677) >>> 0) / 4294967295;
			this.gender = this.id === 524 ? "m" : (tg < 0.85 ? dataGender : (dataGender === "m" ? "f" : "m"));
			this.loc = p.createVector(
				p.random(canvasW) - canvasW / 2,
				-h / 2 - state.personSize * 2
			);
			if (firstID && this.id == firstID) {
				this.loc = p.createVector(
					p.random(-canvasW / 6, canvasW / 6),
					p.random(-h / 10, h / 10)
				);
			}
			this.target_loc = p.createVector(0, 0);
			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
			this.topSpeed = p.random(8, 12);
			this.distance = 100;
			this.frameCount = 0;
			this.zoomSpriteAlpha = 0;
			this.displayedZoomSprite = null;
			this.zoomSpriteFadingOut = false;
			const tw = ((this.id * 2654435761) >>> 0) / 4294967295;
			const th = ((this.id * 2246822519) >>> 0) / 4294967295;
			const tf = ((this.id * 2166136261) >>> 0) / 4294967295;
			this.widthMult = spriteWidthMin + tw * (spriteWidthMax - spriteWidthMin);
			this.heightMult = spriteHeightMin + th * (spriteHeightMax - spriteHeightMin);
			this.flipX = tf < 0.5;
		}

		seek(collide) {
			const { p, state } = this;
			const isMe = this.id === state.zoomId;
			const isZoomed = state.zoomId !== null;

			if (collide[0] !== 0 || collide[1] !== 0) {
				this.acc.add(p.createVector(collide[0] / 10, collide[1] / 10));
			}

			const target = state.positions.get(this.id);
			if (target) {
				const ps = state.personSize;
				this.target_loc.x = target.x + ps / 2 + state.padding - state.w / 2;
				this.target_loc.y = target.y + ps + state.topPadding - state.h / 2;
			}

			if (isMe && isZoomed) {
				this.target_loc.x = 0;
				this.target_loc.y = 0;
			} else if (!isMe && isZoomed) {
				this.target_loc.y = -state.h / 2 - state.personSize * 3;
			}

			const desired = p.createVector(
				this.target_loc.x - this.loc.x,
				this.target_loc.y - this.loc.y
			);
			this.distance = desired.mag();
			desired.normalize();
			const speedMult = state.fastMode ? 20 : 1;
			const speed =
				this.distance < 100
					? p.map(this.distance, 0, 100, 0, this.topSpeed * speedMult)
					: this.topSpeed * speedMult;
			desired.mult(speed);
			this.vel.lerp(desired, state.fastMode ? 0.6 : 0.2);

			if (this.distance < 3) {
				this.vel.mult(0.5);
			} else {
				this.acc.x += p.random(-0.05, 0.05);
				this.acc.y += p.random(-0.05, 0.05);
			}
		}

		update() {
			const { state } = this;
			const isMe = this.id === state.zoomId;
			const isZoomed = state.zoomId !== null;

			this.vel.add(this.acc);
			this.vel.limit(this.topSpeed * (state.fastMode ? 4 : 1));
			this.loc.add(this.vel);
			this.acc.mult(0);

			if (!isZoomed || isMe) {
				const ps = state.personSize;
				this.loc.x = Math.max(
					-state.w / 2 + ps / 2,
					Math.min(state.w / 2 - ps / 2, this.loc.x)
				);
			}
		}

		display(sprites) {
			const { p, state } = this;
			const ps = state.personSize;
			const isMe = this.id === state.zoomId;

			const isSettled = this.distance < 4 && Math.abs(this.vel.x) + Math.abs(this.vel.y) < 1;

			if (isMe && state.zoomSprite && isSettled) {
				const zoomSheet = sprites["00-intro1"];
				if (zoomSheet) {
					// Detect row change: start fading out current, then swap
					if (this.displayedZoomSprite !== state.zoomSprite && !this.zoomSpriteFadingOut) {
						if (this.displayedZoomSprite === null) {
							this.displayedZoomSprite = state.zoomSprite;
						} else {
							this.zoomSpriteFadingOut = true;
						}
					}

					if (this.zoomSpriteFadingOut) {
						this.zoomSpriteAlpha = Math.max(0, this.zoomSpriteAlpha - zoomSpriteFadeSpeed);
						if (this.zoomSpriteAlpha === 0) {
							this.displayedZoomSprite = state.zoomSprite;
							this.zoomSpriteFadingOut = false;
						}
					} else {
						this.zoomSpriteAlpha = Math.min(255, this.zoomSpriteAlpha + zoomSpriteFadeSpeed);
					}

					const rowIdx = zoomSpriteRowIndex[this.displayedZoomSprite] ?? 0;
					const frameIdx = Math.floor(this.frameCount) % 8;
					this.frameCount += 0.1 * spriteAnimSpeed;
					const drawSize = ps * 2;
					p.tint(255, this.zoomSpriteAlpha);
					p.image(zoomSheet, this.loc.x - drawSize / 2, this.loc.y - drawSize, drawSize, drawSize,
						frameIdx * zoomSpriteWidth, rowIdx * zoomSpriteHeight, zoomSpriteWidth, zoomSpriteHeight);
					p.noTint();
				}
				return;
			}

			// Reset fade state when not in settled zoom_sprite mode
			this.zoomSpriteAlpha = 0;
			this.displayedZoomSprite = null;
			this.zoomSpriteFadingOut = false;

			const color = state.personColors.get(this.id) || "#e2e8f0";

			const colorName = hexToColorName[color] ?? "neutral";
			const spriteKey = (isMe && state.zoomSprite) ? "00-intro" : state.introMode ? "00-intro" : this.race + "-" + colorName;
			const spriteSheet = sprites[spriteKey];
			if (!spriteSheet) return;

			let rowLabel;
			if (this.distance < 4 && Math.abs(this.vel.x) + Math.abs(this.vel.y) < 1) {
				rowLabel = this.gender + "-stand";
				this.frameCount += 0.1 * spriteAnimSpeed;
			} else if (this.vel.y > 0 && this.vel.y > Math.abs(this.vel.x)) {
				rowLabel = this.gender + "-down";
				this.frameCount += Math.max(0.1, (Math.abs(this.vel.x) + Math.abs(this.vel.y)) / 8) * spriteAnimSpeed;
			} else if (this.vel.y < 0 && Math.abs(this.vel.y) > Math.abs(this.vel.x)) {
				rowLabel = this.gender + "-up";
				this.frameCount += Math.max(0.1, (Math.abs(this.vel.x) + Math.abs(this.vel.y)) / 8) * spriteAnimSpeed;
			} else {
				rowLabel = this.gender + (this.vel.x < 0 ? "-left" : "-right");
				this.frameCount += Math.max(0.1, (Math.abs(this.vel.x) + Math.abs(this.vel.y)) / 10) * spriteAnimSpeed;
			}

			const rowIndex = spriteRowLabels.indexOf(rowLabel);
			const frameIdx = Math.floor(this.frameCount) % spriteCols;
			const sx = frameIdx * spriteWidth;
			const sy = rowIndex * spriteHeight + 2;
			const sw = ps * (isMe ? 1 : this.widthMult);
			const sh = ps * 2 * (isMe ? 1 : this.heightMult);
			if (this.flipX && rowLabel.endsWith("-stand")) {
				p.push();
				p.translate(this.loc.x, this.loc.y - sh);
				p.scale(-1, 1);
				p.image(spriteSheet, -sw / 2, 0, sw, sh, sx, sy, spriteWidth, spriteHeight - 2);
				p.pop();
			} else {
				p.image(spriteSheet, this.loc.x - sw / 2, this.loc.y - sh, sw, sh, sx, sy, spriteWidth, spriteHeight - 2);
			}

			if (isMe && state.zoom > 2 && state.zoomLabel) {
				const label = state.zoomLabel;
				const fontSize = ps * 0.4;
				const padding = fontSize * 0.5;
				const boxH = fontSize + padding;
				const by = this.loc.y - ps - boxH - fontSize * 0.3;
				p.textSize(fontSize);
				p.noStroke();
				p.fill(textColor);
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
		let atlasFont = null;

		p.setup = async () => {
			canvasW = state.w || 1;
			canvasH = state.h || 1;
			p.createCanvas(canvasW, canvasH);
			p.noSmooth();

			atlasFont = await new FontFace("AtlasTypewriter", "url(assets/AtlasTypewriter-Medium-Web.woff2)")
				.load()
				.then((font) => { document.fonts.add(font); return "AtlasTypewriter"; })
				.catch(() => null);

			await Promise.all(
				spriteKeys.map(async (key) => {
					sprites[key] = await p.loadImage("assets/leftovers_resized/" + key + ".png");
				})
			);
		};

		p.draw = () => {
			if (state.w > 0 && state.h > 0 && (state.w !== canvasW || state.h !== canvasH)) {
				canvasW = state.w;
				canvasH = state.h;
				p.resizeCanvas(canvasW, canvasH);
			}

			p.background(bgColor);

			if (all_people.length === 0 && state.data?.length > 0) {
				all_people = state.data.map(
					(person) => new Person(p, state, person, canvasW, canvasH)
				);
			}

			targetZoom = state.zoomId !== null ? zoomLevel : 1;
			zoom = p.lerp(zoom, targetZoom, zoomSpeed);
			state.zoom = zoom;

			p.translate(canvasW / 2, canvasH / 2);
			p.scale(zoom);

			for (let i = 0; i < all_people.length; i++) {
				const collide = checkCollision(all_people[i], i, all_people, state.personSize);
				all_people[i].seek(collide);
				all_people[i].update();
				all_people[i].display(sprites);
			}

			if (state.labels?.length > 0) {
				const fontSize = Math.max(10, state.personSize * 1.1);
				if (atlasFont) p.textFont(atlasFont);
				p.textSize(fontSize);
				p.textAlign(p.LEFT, p.TOP);
				p.fill(textColor);
				p.noStroke();
				for (const label of state.labels) {
					const lx = label.x + state.padding - state.w / 2;
					const ly = label.y + state.topPadding - state.h / 2;
					p.text(label.text, lx, ly);
				}
			}
		};

		p.mouseClicked = (event) => {
			if (event?.target?.closest?.(".textContainer, .step.longcopy")) return;
			const ps = state.personSize;
			const worldX = (p.mouseX - canvasW / 2) / zoom;
			const worldY = (p.mouseY - canvasH / 2) / zoom;
			let found = null;
			for (const person of all_people) {
				if (
					Math.abs(worldX - person.loc.x) < ps / 2 &&
					Math.abs(worldY - person.loc.y) < ps
				) {
					found = person.id;
					break;
				}
			}
			state.onpersonclick?.(found);
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
		const { default: P5 } = await import("p5");
		p5Instance = new P5(sketch, container);
	});

	onDestroy(() => {
		p5Instance?.remove();
	});
</script>

<div
	bind:this={container}
	style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
></div>
