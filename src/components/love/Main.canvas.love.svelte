<script>
	import { onMount, onDestroy } from "svelte";
	import { Tween } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import copy from "$data/copy.json";
	const bgColor = "#1d0f1a";
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
		selectedId = null,
		labels = [],
		padding = 20,
		topPadding = 50,
		w,
		h,
		onpersonclick = null,
		fastMode = false,
		introMode = false,
		zoomSprite = null
	} = $props();

	// Sprite sheet constants
	const zoomSpeed = 0.06;
	const zoomLevel = 10;
	const zoomIconMinPx = 240;
	const zoomIconMaxPx = 300;
	const spriteAnimSpeed = 1.2;
	const spriteWidthMin = 0.8;
	const spriteWidthMax = 1.4;
	const spriteHeightMin = 0.9;
	const spriteHeightMax = 1.2;
	const spriteWidth = 600 / 8;
	const spriteHeight = 1500 / 10;
	const spriteRows = 10;
	const spriteCols = 8;
	const zoomSpriteWidth = 300;
	const zoomSpriteHeight = 300;
	const zoomSpriteRowIndex = { "meet": 0, "date": 1, "married": 2, "kids": 3, "thumbsup": 4 };
	const zoomSpriteFadeSpeed = 6;
	const spriteRowLabels = [
		"f-left", "m-left", "f-right", "m-right",
		"f-stand", "m-stand", "f-down", "m-down", "f-up", "m-up"
	];
	const spriteKeys = [
		"00-intro1",
		"01-magenta", "02-magenta", "03-magenta",
		"01-pink",    "02-pink",    "03-pink",
		"01-purple",  "02-purple",  "03-purple",
		"01-lavender","02-lavender","03-lavender",
		"01-yellow",  "02-yellow",  "03-yellow",
		"01-peach",   "02-peach",   "03-peach",
		"01-neutral", "02-neutral", "03-neutral",
		"01-neutral2","02-neutral2","03-neutral2"
	];
	const raceOptions = {
		"Black, Non-Hispanic": ["03"],
		"Hispanic":            ["02"],
		"White, Non-Hispanic": ["01"],
	};
	const raceOptionsFallback = ["01", "02", "03"];

	// HTML loading overlay state
	let spritesLoaded = $state(0);
	const totalSprites = spriteKeys.length;
	let introSpriteLoaded = $state(false);
	const progress = new Tween(0, { duration: 5000, easing: cubicOut });
	progress.set(0.9);

	$effect(() => {
		if (introSpriteLoaded || spritesLoaded >= totalSprites) progress.set(1, { duration: 200 });
	});

	// Mutable context object shared between Svelte and p5 sketch each frame.
	const sk = {
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
		selectedId: null,
		labels: [],
		zoom: 1,
		introMode: false,
		zoomSprite: null
	};

	$effect(() => {
		sk.data = data ?? [];
		sk.positions = positions;
		sk.personColors = personColors;
		sk.personSize = personSize;
		sk.padding = padding;
		sk.topPadding = topPadding;
		sk.w = w;
		sk.h = h;
		sk.zoomId = zoomId;
		sk.zoomLabel = zoomLabel;
		sk.selectedId = selectedId;
		sk.labels = labels ?? [];
		sk.onpersonclick = onpersonclick;
		sk.fastMode = fastMode;
		sk.introMode = introMode;
		sk.zoomSprite = zoomSprite;
	});

	let container;
	let p5Instance;

	class Person {
		constructor(p, sk, person, canvasW, canvasH) {
			this.p = p;
			this.sk = sk;
			this.id = person.id;
			const racePool = raceOptions[person.d?.[3]] ?? raceOptionsFallback;
			const tr = ((this.id * 3266489917) >>> 0) / 4294967295;
			this.race = racePool[Math.floor(tr * racePool.length)];
			const dataGender = person.d?.[1] === "Male" ? "m" : "f";
			const tg = ((this.id * 1597334677) >>> 0) / 4294967295;
			this.gender = this.id === 524 ? "m" : (tg < 0.85 ? dataGender : (dataGender === "m" ? "f" : "m"));
			this.loc = p.createVector(
				p.random(canvasW) - canvasW / 2,
				-h / 2 - sk.personSize * 2
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
			this.topSpeed = p.random(0.6, 0.8) * sk.personSize;
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
			const { p, sk } = this;
			const isMe = this.id === sk.zoomId;
			const isZoomed = sk.zoomId !== null;

			if (collide[0] !== 0 || collide[1] !== 0) {
				this.acc.add(p.createVector(collide[0] / 10, collide[1] / 10));
			}

			const target = sk.positions.get(this.id);
			if (target) {
				const ps = sk.personSize;
				this.target_loc.x = target.x + ps / 2 + sk.padding - sk.w / 2;
				this.target_loc.y = target.y + ps + sk.topPadding - sk.h / 2;
			}

			if (isMe && isZoomed) {
				this.target_loc.x = 0;
				this.target_loc.y = 0;
			} else if (!isMe && isZoomed) {
				this.target_loc.y = -sk.h / 2 - sk.personSize * 3;
			}

			if (sk.introMode && firstID && this.id === firstID) {
				this.target_loc.x = 0;
				this.target_loc.y = 0;
			}

			const desired = p.createVector(
				this.target_loc.x - this.loc.x,
				this.target_loc.y - this.loc.y
			);
			this.distance = desired.mag();
			desired.normalize();
			const speedMult = sk.fastMode ? 20 : 1;
			const speed =
				this.distance < 100
					? p.map(this.distance, 0, 100, 0, this.topSpeed * speedMult)
					: this.topSpeed * speedMult;
			desired.mult(speed);
			this.vel.lerp(desired, sk.fastMode ? 0.6 : 0.2);

			if (this.distance < 3) {
				this.vel.mult(0.5);
			} else {
				this.acc.x += p.random(-0.05, 0.05);
				this.acc.y += p.random(-0.05, 0.05);
			}
		}

		update() {
			const { sk } = this;
			const isMe = this.id === sk.zoomId;
			const isZoomed = sk.zoomId !== null;

			this.vel.add(this.acc);
			this.vel.limit(this.topSpeed * (sk.fastMode ? 4 : 1));
			this.loc.add(this.vel);
			this.acc.mult(0);

			if (!isZoomed || isMe) {
				const ps = sk.personSize;
				this.loc.x = Math.max(
					-sk.w / 2 + ps / 2,
					Math.min(sk.w / 2 - ps / 2, this.loc.x)
				);
			}
		}

		display(sprites) {
			const { p, sk } = this;
			const ps = sk.personSize;
			const isMe = this.id === sk.zoomId;

			if (isMe && sk.zoomSprite) {
				const zoomSheet = sprites["00-intro1"];
				if (zoomSheet) {
					if (this.displayedZoomSprite !== sk.zoomSprite && !this.zoomSpriteFadingOut) {
						if (this.displayedZoomSprite === null) {
							this.displayedZoomSprite = sk.zoomSprite;
						} else {
							this.zoomSpriteFadingOut = true;
						}
					}

					if (this.zoomSpriteFadingOut) {
						this.zoomSpriteAlpha = Math.max(0, this.zoomSpriteAlpha - zoomSpriteFadeSpeed);
						if (this.zoomSpriteAlpha === 0) {
							this.displayedZoomSprite = sk.zoomSprite;
							this.zoomSpriteFadingOut = false;
						}
					} else {
						this.zoomSpriteAlpha = Math.min(255, this.zoomSpriteAlpha + zoomSpriteFadeSpeed);
					}

					const rowIdx = zoomSpriteRowIndex[this.displayedZoomSprite] ?? 0;
					const frameIdx = Math.floor(this.frameCount) % 8;
					this.frameCount += 0.1 * spriteAnimSpeed;
					const drawSize = ps * 2;
					const zoomYNudge = ps * 0.5;
					p.tint(255, this.zoomSpriteAlpha);
					p.image(zoomSheet, -drawSize / 2, -drawSize + zoomYNudge, drawSize, drawSize,
						frameIdx * zoomSpriteWidth, rowIdx * zoomSpriteHeight, zoomSpriteWidth, zoomSpriteHeight);
					p.noTint();
				}
				return;
			}

			// Intro hero: show firstID large and centered using zoom sprite
			if (sk.introMode && firstID && this.id === firstID) {
				const zoomSheet = sprites["00-intro1"];
				if (zoomSheet) {
					const frameIdx = Math.floor(this.frameCount) % 8;
					this.frameCount += 0.1 * spriteAnimSpeed;
					const drawSize = p.constrain(ps * 2 * zoomLevel, zoomIconMinPx, zoomIconMaxPx);
					const zoomYNudge = drawSize * 0.25;
					p.image(zoomSheet, -drawSize / 2, -drawSize + zoomYNudge, drawSize, drawSize,
						frameIdx * zoomSpriteWidth, 0, zoomSpriteWidth, zoomSpriteHeight);
					return;
				}
			}

			if (this.displayedZoomSprite !== null) {
				this.frameCount = 0;
			}
			this.zoomSpriteAlpha = 0;
			this.displayedZoomSprite = null;
			this.zoomSpriteFadingOut = false;

			const color = sk.personColors.get(this.id) || "#826c91";
			const colorName = hexToColorName[color] ?? "neutral";
			const spriteKey = sk.introMode ? "00-intro" : this.race + "-" + colorName;
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
			if (rowIndex === -1) return;
			const frameIdx = Math.floor(this.frameCount) % spriteCols;
			const sx = frameIdx * spriteWidth;
			const sy = rowIndex * spriteHeight + 2;
			const sw = ps * (isMe ? 1 : this.widthMult);
			const sh = ps * 2 * (isMe ? 1 : this.heightMult);
			const yNudge = isMe ? ps * 0.5 : 0;
			if (this.flipX && rowLabel.endsWith("-stand")) {
				p.push();
				p.translate(this.loc.x, this.loc.y - sh + yNudge);
				p.scale(-1, 1);
				p.image(spriteSheet, -sw / 2, 0, sw, sh, sx, sy, spriteWidth, spriteHeight - 2);
				p.pop();
			} else {
				p.image(spriteSheet, this.loc.x - sw / 2, this.loc.y - sh + yNudge, sw, sh, sx, sy, spriteWidth, spriteHeight - 2);
			}

			if (isMe && sk.zoom > 2 && sk.zoomLabel) {
				const label = sk.zoomLabel;
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
			p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
			canvasW = sk.w || 1;
			canvasH = sk.h || 1;
			p.createCanvas(canvasW, canvasH);
			p.noSmooth();

			atlasFont = await new FontFace("AtlasTypewriter", "url(assets/AtlasTypewriter-Medium-Web.woff2)")
				.load()
				.then((font) => { document.fonts.add(font); return "AtlasTypewriter"; })
				.catch(() => null);

			// Load zoom sprite first so intro hero renders immediately
			const orderedKeys = ["00-intro1", ...spriteKeys.filter(k => k !== "00-intro1")];
			orderedKeys.forEach((key) => {
				p.loadImage(
					"assets/love/" + key + ".webp",
					(img) => {
						sprites[key] = img;
						spritesLoaded++;
						if (key === "00-intro1") introSpriteLoaded = true;
					},
					() => { console.warn("Failed to load sprite:", key); spritesLoaded++; }
				);
			});
		};

		p.draw = () => {
			if (sk.w > 0 && sk.h > 0 && (sk.w !== canvasW || sk.h !== canvasH)) {
				canvasW = sk.w;
				canvasH = sk.h;
				p.resizeCanvas(canvasW, canvasH);
			}
			p.noSmooth();
			p.drawingContext.imageSmoothingEnabled = false;
			p.clear();
			// p.background(bgColor);

			if (all_people.length === 0 && sk.data?.length > 0) {
				all_people = sk.data.map(
					(person) => new Person(p, sk, person, canvasW, canvasH)
				);
			}

			if (sk.zoomId !== null) {
				const iconPx = p.constrain(sk.personSize * 2 * zoomLevel, zoomIconMinPx, zoomIconMaxPx);
				targetZoom = iconPx / (sk.personSize * 2);
			} else {
				targetZoom = 1;
			}
			zoom = p.lerp(zoom, targetZoom, zoomSpeed);
			sk.zoom = zoom;

			p.translate(canvasW / 2, canvasH / 2);
			p.scale(zoom);

			// Spotlight behind selected person
			if (sk.selectedId !== null && sk.zoomId === null) {
				for (const person of all_people) {
					if (person.id === sk.selectedId) {
						const ps = sk.personSize;
						const cx = person.loc.x;
						const cy = person.loc.y - ps * person.heightMult;
						const r = ps * 1.6;
						p.drawingContext.shadowBlur = ps * 5;
						p.drawingContext.shadowColor = "rgba(255, 255, 255, 1)";
						p.noStroke();
						p.fill(255, 255, 255, 200);
						p.ellipse(cx, cy, r, r);
						p.drawingContext.shadowBlur = 0;
						p.drawingContext.shadowColor = "rgba(0,0,0,0)";
						break;
					}
				}
			}

			for (let i = 0; i < all_people.length; i++) {
				const collide = checkCollision(all_people[i], i, all_people, sk.personSize);
				all_people[i].seek(collide);
				all_people[i].update();
				all_people[i].display(sprites);
			}

			if (sk.labels?.length > 0) {
				const fontSize = Math.max(14, Math.min(18, sk.personSize * 1.1));
				if (atlasFont) p.textFont(atlasFont);
				p.textSize(fontSize);
				p.textAlign(p.LEFT, p.TOP);
				p.fill(textColor);
				p.noStroke();
				for (const label of sk.labels) {
					const lx = label.x + sk.padding - sk.w / 2;
					const ly = label.y + sk.topPadding - sk.h / 2 - 8;
					p.text(label.text, lx, ly);
				}
			}
		};

		p.mouseClicked = (event) => {
			if (event?.target?.closest?.(".textContainer, .step.longcopy")) return;
				if (sk.zoomId !== null) return;
			const ps = sk.personSize;
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
			sk.onpersonclick?.(found);
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

{#if progress.current < 0.999}
	<div class="loadOverlay">
		<div class="spinWrap">
			<div class="spinRing"></div>
			<span class="spinPct">{Math.round(progress.current * 100)}%</span>
		</div>
	</div>
{/if}

<style>
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	.loadOverlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
	.spinWrap {
		position: relative;
		width: 44px;
		height: 44px;
	}
	.spinRing {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 3px solid rgba(160, 110, 180, 0.2);
		border-top-color: rgba(160, 110, 180, 0.85);
		animation: spin 0.8s linear infinite;
	}
	.spinPct {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: rgba(160, 110, 180, 0.85);
		font-family: var(--font-mono);
	}
</style>
