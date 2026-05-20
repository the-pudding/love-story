<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Canvas from "$components/love/Main.canvas.love.svelte";
	import Text from "$components/love/Text.love.svelte";
	import Legend from "$components/love/Legend.love.svelte";
	import Modal from "$components/love/Modal.love.svelte";
	import { varDescriptions } from "$utils/varDescriptions.js";

	import panelData from "$data/panel_all3waves.json";
	import copy from "$data/copy.json";
	import metricTranslations from "$data/metricTranslations.json";
	import chartConfig from "$data/chartConfig.json";

	const data = panelData.data;
	const lookup = panelData.lookup;

	let containerWidth = $state(0);
	let containerHeight = $state(0);

	// `value` is the step index output by Scrolly (0, 1, 2, 3...).
	// Null/undefined between steps defaults to step 0.
	let value = $state(undefined);
	const stepIndex = $derived(value ?? 0);

	// Shared padding constants
	const canvasPadding = 20;
	const baseLegendHeight = 60;
	const chartTitleHeight = 22;

	const chartTitle = $derived(copy.story[stepIndex]?.chart_title ?? null);
	const legendHeight = $derived(baseLegendHeight + (chartTitle ? chartTitleHeight : 0));

	// groupPadding shrinks on narrow screens
	const groupPadding = $derived(containerWidth < 500 ? 12 : 30);
	const labelHeight = 30;

	// personSize is stable: always reserve space for MAX_GROUPS so icons
	// don't resize as the user scrolls between steps.
	const MAX_GROUPS = 6;
	const personSize = $derived.by(() => {
		if (!containerWidth || !containerHeight || !data.length) return 10;
		const availW = containerWidth - canvasPadding * 2;
		const availH = containerHeight - legendHeight - canvasPadding * 2;
		const overheadH = MAX_GROUPS * (labelHeight + groupPadding);
		const effectiveH = Math.max(availH - overheadH, availH * 0.5);
		const ps = Math.sqrt((availW * effectiveH) / (2.8 * data.length));
		return Math.max(4, Math.min(40, Math.floor(ps)));
	});

	const cols = $derived(
		Math.floor((containerWidth - canvasPadding * 2) / personSize) || 1
	);

	// --- Lookup helpers ---
	function getVarWave(varName) {
		if (!varName) return null;
		for (const [w, vars] of Object.entries(lookup)) {
			if (vars.includes(varName)) return w;
		}
		return null;
	}

	function getVarIndex(wave, varName) {
		if (!wave || !varName || !lookup[wave]) return -1;
		return lookup[wave].indexOf(varName);
	}

	let debugSortVar = $state("");
	let debugMetric = $state("");

	// All story-driven state reads from stepIndex, not value
	const sortVar = $derived(debugSortVar || copy.story[stepIndex]?.sort_var);
	const sortWave = $derived(getVarWave(sortVar));
	const sortIdx = $derived(getVarIndex(sortWave, sortVar));

	const metric = $derived(debugMetric || copy.story[stepIndex]?.metric);
	const wave = $derived(getVarWave(metric));
	const metricIdx = $derived(getVarIndex(wave, metric));

	const metricReverse = $derived(
		copy.story[stepIndex]?.metric_reverse === "true"
	);
	const iconReverse = $derived(
		copy.story[stepIndex]?.icon_reverse === "true"
	);
	const zoomId = $derived(
		copy.story[stepIndex]?.zoom_id !== undefined
			? Number(copy.story[stepIndex].zoom_id)
			: null
	);
	const zoomLabel = $derived(copy.story[stepIndex]?.zoom_label ?? null);
	const zoomSprite = $derived(copy.story[stepIndex]?.zoom_sprite ?? null);

	// --- Derive min/max directly from metricTranslations ---
	function getMetricRange(metricName) {
		const translations = metricTranslations[metricName];
		if (!translations) return { min: 0, max: 5 };
		const values = Object.values(translations).map(Number);
		return { min: Math.min(...values), max: Math.max(...values) };
	}

	const minMetric = $derived(getMetricRange(metric).min);
	const maxMetric = $derived(getMetricRange(metric).max);

	function translateMetric(metricName, rawValue) {
		if (rawValue === null || rawValue === undefined) return null;

		const translations = metricTranslations[metricName];
		if (!translations) return rawValue;

		const key = String(rawValue);
		if (key in translations) return translations[key];

		if (typeof rawValue === "number") return rawValue;

		return rawValue;
	}

	// --- Reverse Text Lookup ---
	const norm = (s) => String(s).toLowerCase();

	function getChartLabel(metricName, rawLabel) {
		const entry = chartConfig.colors?.[metricName];
		if (!entry || Array.isArray(entry)) return null;
		const firstVal = Object.values(entry)[0];
		if (!Array.isArray(firstVal)) return null;
		const match = Object.entries(entry).find(([k]) => norm(k) === norm(rawLabel));
		return match ? match[1][0] : null;
	}

	function getTextLabel(metricName, targetNumber) {
		const translations = metricTranslations[metricName];
		if (!translations) return targetNumber;

		let fallback = null;
		for (const [textKey, mappedValue] of Object.entries(translations)) {
			if (Number(mappedValue) === Number(targetNumber)) {
				const chartLabel = getChartLabel(metricName, textKey);
				if (chartLabel) return chartLabel;
				if (!fallback) fallback = textKey;
			}
		}

		return fallback ?? targetNumber;
	}

	// --- Color Scale Logic ---
	const nullColor = "#e2e8f0";

	const palette = $derived.by(() => {
		const fallback = [
			"#f0fdfa",
			"#a5f3fc",
			"#38bdf8",
			"#3b82f6",
			"#1d4ed8",
			"#1e3a8a"
		];

		// Resolve a color value: if it's a named palette entry, return the hex; otherwise pass through.
		const resolveColor = (c) => chartConfig.palette?.[c] ?? c;

		// 1. Prefer chartConfig.colors keyed by metric name.
		// Supports tuple format { rawLabel: ["Display", colorNameOrHex] } — extract and resolve color only.
		const entry = chartConfig.colors?.[metric];
		if (entry) {
			if (Array.isArray(entry)) return entry.map(resolveColor);
			const firstVal = Object.values(entry)[0];
			if (Array.isArray(firstVal)) {
				return Object.fromEntries(Object.entries(entry).map(([k, v]) => [k, resolveColor(v[1])]));
			}
			return Object.fromEntries(Object.entries(entry).map(([k, v]) => [k, resolveColor(v)]));
		}

		// 2. Fall back to per-step colors field (legacy)
		const rawColors = copy.story[stepIndex]?.colors;
		if (!rawColors) return fallback;

		try {
			const normalized =
				typeof rawColors === "string"
					? rawColors.replace(/'/g, '"')
					: rawColors;
			return typeof normalized === "string"
				? JSON.parse(normalized)
				: normalized;
		} catch (e) {
			console.error("Failed to parse colors array:", e);
			return fallback;
		}
	});

	// Build a sorted array of the unique numeric values in this metric's
	// translation map. palette[i] maps to sortedValues[i], so non-sequential
	// values (e.g. -1, 1, 2, 3, 4, 5 with no 0) map correctly without gaps.
	const sortedMetricValues = $derived.by(() => {
		const translations = metricTranslations[metric];
		if (!translations) return [];
		const vals = [...new Set(Object.values(translations).map(Number))].sort(
			(a, b) => a - b
		);
		return vals;
	});

	// Push negative values to the end only for metrics where negatives are a
	// categorical outlier (e.g. "Single" = -1 in rel_qual). For symmetric
	// diverging scales like qual_diff (which include 0), keep natural order.
	const negToEnd = $derived(
		sortedMetricValues.length > 0 && !sortedMetricValues.includes(0)
	);

	const getColor = $derived.by(() => {
		const currentPalette = palette;
		const currentValues = sortedMetricValues;
		const currentReverse = metricReverse;
		const translations = metricTranslations[metric];

		// Dict-format palette: keys are label names, e.g. { "Better": "#4d9221" }.
		// Look up by reversing the numeric value back to its label, with
		// case-insensitive matching so Google Doc keys (e.g. "divorce") match
		// translation labels (e.g. "Divorce"). Handles duplicate translation keys
		// like "(1) Divorce" and "Divorce" by trying all that share the same value.
		if (currentPalette && !Array.isArray(currentPalette)) {
			const norm = (s) => s.toLowerCase();
			const paletteByNorm = Object.fromEntries(
				Object.entries(currentPalette).map(([k, v]) => [norm(k), v])
			);
			return (val) => {
				if (val == null) return nullColor;
				const numVal = Number(val);
				if (isNaN(numVal) || !translations) return nullColor;
				const labels = Object.keys(translations).filter(
					(k) => Number(translations[k]) === numVal
				);
				for (const label of labels) {
					const color = paletteByNorm[norm(label)];
					if (color) return color;
				}
				return nullColor;
			};
		}

		// Array-format palette: index-based with optional reversal.
		return (val) => {
			if (val == null) return nullColor;

			const numVal = Number(val);
			if (isNaN(numVal)) return nullColor;

			let index = currentValues.indexOf(numVal);
			if (index === -1) return nullColor;

			if (currentReverse) {
				index = currentValues.length - 1 - index;
			}

			return currentPalette[index] || nullColor;
		};
	});

	// --- Legend Data Generator ---
	// Build from translation keys directly so stray entries like "0" and
	// "Refused" from the Google Sheet never appear in the legend.
	const legendData = $derived.by(() => {
		if (metricIdx === -1) return [];

		const translations = metricTranslations[metric];
		if (!translations) return [];

		const items = Object.entries(translations)
			.map(([label, numericValue]) => ({
				numericValue: Number(numericValue),
				label: getChartLabel(metric, label) ?? label,
				color: getColor(Number(numericValue))
			}))
			.filter(
				(item) =>
					item.numericValue >= minMetric && item.numericValue <= maxMetric
			)
			.filter(
				(item, _, arr) =>
					arr
						.filter((x) => x.numericValue === item.numericValue)
						.sort((a, b) => a.label.length - b.label.length)[0].label ===
					item.label
			)
			.sort((a, b) => {
				if (negToEnd) {
					const negA = a.numericValue < 0;
					const negB = b.numericValue < 0;
					if (negA && !negB) return 1;
					if (!negA && negB) return -1;
				}
				return a.numericValue - b.numericValue;
			});

		return iconReverse ? items.reverse() : items;
	});

	// --- Sort Logic ---
	const sortedData = $derived.by(() => {
		if (sortIdx === -1) {
			if (metricIdx === -1) return [...data].sort((a, b) => a.id - b.id);
			return [...data].sort((a, b) => {
				const metricA = translateMetric(metric, a[wave]?.[metricIdx]);
				const metricB = translateMetric(metric, b[wave]?.[metricIdx]);
				if (metricA == null && metricB == null) return 0;
				if (metricA == null) return 1;
				if (metricB == null) return -1;
				const numA = Number(metricA);
				const numB = Number(metricB);
				if (negToEnd) {
					const negA = numA < 0;
					const negB = numB < 0;
					if (negA && !negB) return 1;
					if (!negA && negB) return -1;
				}
				return numA - numB;
			});
		}

		const sortOrder = metricTranslations[sortVar]
			? Object.keys(metricTranslations[sortVar])
			: [];

		return [...data].sort((a, b) => {
			const rawA = a[sortWave]?.[sortIdx];
			const rawB = b[sortWave]?.[sortIdx];

			const strA = rawA == null ? null : String(rawA);
			const strB = rawB == null ? null : String(rawB);

			if (strA !== strB) {
				if (strA == null) return 1;
				if (strB == null) return -1;

				const orderA = sortOrder.indexOf(strA);
				const orderB = sortOrder.indexOf(strB);

				if (orderA !== -1 && orderB !== -1) return orderA - orderB;
				if (orderA !== -1) return -1;
				if (orderB !== -1) return 1;

				return strA.localeCompare(strB);
			}

			if (metricIdx !== -1) {
				const rawMetricA = a[wave]?.[metricIdx];
				const rawMetricB = b[wave]?.[metricIdx];

				const metricA = translateMetric(metric, rawMetricA);
				const metricB = translateMetric(metric, rawMetricB);

				if (metricA == null && metricB == null) return 0;
				if (metricA == null) return 1;
				if (metricB == null) return -1;

				const numA = Number(metricA);
				const numB = Number(metricB);
				if (negToEnd) {
					const negA = numA < 0;
					const negB = numB < 0;
					if (negA && !negB) return 1;
					if (!negA && negB) return -1;
				}
				return numA - numB;
			}

			return a.id - b.id;
		});
	});

	// --- Grouping Logic ---
	const groupedData = $derived.by(() => {
		const groups = [];
		let currentGroupRaw = undefined;
		let currentGroup = null;

		for (const item of sortedData) {
			const rawVal = sortIdx !== -1 ? item[sortWave]?.[sortIdx] : null;

			if (rawVal !== currentGroupRaw || !currentGroup) {
				currentGroupRaw = rawVal;

				let textLabel;
				if (rawVal === null || rawVal === undefined) {
					textLabel = "N/A";
				} else if (typeof rawVal === "string") {
					textLabel = getChartLabel(sortVar, rawVal) ?? rawVal;
				} else {
					textLabel = getTextLabel(sortVar, rawVal);
				}

				currentGroup = {
					value: rawVal,
					label: String(textLabel),
					items: []
				};
				groups.push(currentGroup);
			}
			currentGroup.items.push(item);
		}
		return iconReverse ? groups.reverse() : groups;
	});

	// --- Layout Logic ---
	const layout = $derived.by(() => {
		const posMap = new Map();
		const labelPositions = [];
		let currentY = 0;

		if (sortIdx === -1) {
			const n = sortedData.length;
			const numCols = Math.min(cols, n);
			const baseRows = Math.floor(n / numCols);
			const extraItems = n % numCols;
			let itemIndex = 0;
			for (let col = 0; col < numCols; col++) {
				const rowsInThisCol = baseRows + (col < extraItems ? 1 : 0);
				for (let row = 0; row < rowsInThisCol; row++) {
					posMap.set(sortedData[itemIndex].id, {
						x: col * personSize,
						y: row * personSize * 2
					});
					itemIndex++;
				}
			}
			return { positions: posMap, labels: [] };
		}

		for (const group of groupedData) {
			labelPositions.push({ text: group.label, x: 0, y: currentY });

			currentY += labelHeight;

			const numItems = group.items.length;
			const numCols = Math.min(cols, numItems);
			const baseRows = Math.floor(numItems / numCols);
			const extraItems = numItems % numCols;

			let itemIndex = 0;

			for (let col = 0; col < numCols; col++) {
				const rowsInThisCol = baseRows + (col < extraItems ? 1 : 0);

				for (let row = 0; row < rowsInThisCol; row++) {
					const p = group.items[itemIndex];
					posMap.set(p.id, {
						x: col * personSize,
						y: currentY + row * personSize * 2
					});
					itemIndex++;
				}
			}

			const totalRows = baseRows + (extraItems > 0 ? 1 : 0);
			currentY += totalRows * personSize * 2 + groupPadding;
		}

		return { positions: posMap, labels: labelPositions };
	});

	const isCovid = $derived(copy.story[stepIndex]?.addclass === "covid");

	const covidPositions = $derived.by(() => {
		if (!isCovid || !containerWidth || !containerHeight) return null;

		const posMap = new Map();

		// 9 groups summing to 20, sizes 1–3
		const groupSizes = [3, 1, 2, 3, 2, 1, 3, 2, 3];

		// Variation offsets within each cell (as fraction of cell size)
		// so groups don't all sit in the same corner
		const offsets = [
			[0.1, 0.2],
			[0.5, 0.3],
			[0.2, 0.55],
			[0.35, 0.15],
			[0.55, 0.45],
			[0.1, 0.6],
			[0.4, 0.25],
			[0.2, 0.4],
			[0.6, 0.15]
		];

		const gridCols = 3;
		const gridRows = 3;
		const availW = containerWidth - canvasPadding * 2;
		const availH = containerHeight - legendHeight - canvasPadding * 2;
		const cellW = availW / gridCols;
		const cellH = availH / gridRows;

		let personIdx = 0;

		for (let g = 0; g < groupSizes.length; g++) {
			const row = Math.floor(g / gridCols);
			const col = g % gridCols;
			const [ox, oy] = offsets[g];
			const cx = canvasPadding + col * cellW + ox * cellW;
			const cy = legendHeight + canvasPadding + row * cellH + oy * cellH;

			for (let p = 0; p < groupSizes[g]; p++) {
				const person = sortedData[personIdx++];
				if (!person) break;
				posMap.set(person.id, { x: cx + p * personSize * 1.6, y: cy });
			}
		}

		// Send everyone else off the top at varied x positions, matching
		// how the zoom effect scatters non-focused people off-screen.
		for (let i = personIdx; i < sortedData.length; i++) {
			const person = sortedData[i];
			const spreadX = ((person.id % 60) / 60) * containerWidth;
			posMap.set(person.id, { x: spreadX, y: -containerHeight - 100 });
		}

		return posMap;
	});

	const positions = $derived(
		isCovid && covidPositions ? covidPositions : layout.positions
	);
	const labels = $derived(isCovid ? [] : layout.labels);

	// If a step specifies null_value, use it to color people with missing data
	// e.g. Single people have null for w1_q34 but should get palette[0]
	const nullValue = $derived(
		copy.story[stepIndex]?.null_value !== undefined
			? Number(copy.story[stepIndex].null_value)
			: null
	);

	const personColors = $derived.by(() => {
		const m = new Map();
		for (const person of data) {
			const rawMetric = metricIdx !== -1 ? person[wave]?.[metricIdx] : null;
			const metricValue = translateMetric(metric, rawMetric);
			const colorValue =
				metricValue == null && nullValue !== null ? nullValue : metricValue;
			m.set(person.id, getColor(colorValue));
		}
		return m;
	});

	let innerHeight = $state(0);
	const triggerOffset = $derived(innerHeight * 0.1);

	let clickedPersonId = $state(null);

	const waveYear = { w1: "2017", w2: "2020", w3: "2022" };
	const currentYear = $derived(waveYear[wave] ?? null);
	let debugFast = $state(false);
	const fastMode = $derived(!!(debugSortVar || debugMetric || debugFast));
</script>

<div class="debug">
	step: {value} | sort: {sortVar} (wave: {sortWave}, idx: {sortIdx}) | metric: {metric}
	(wave: {wave}, idx: {metricIdx}) | min: {minMetric}, max: {maxMetric},
	reverse: {metricReverse} | zoom_sprite: {zoomSprite}
</div>

<svelte:window bind:innerHeight />

<section id="scrolly">
	<div
		class="visualContainer"
		bind:clientWidth={containerWidth}
		bind:clientHeight={containerHeight}
	>
		{#if containerWidth > 0}
			<Canvas
				{data}
				{positions}
				{personColors}
				{personSize}
				{zoomId}
				{zoomLabel}
				{labels}
				sort_varpadding={canvasPadding}
				topPadding={legendHeight + canvasPadding}
				w={containerWidth}
				h={containerHeight}
				onpersonclick={(id) => {
					clickedPersonId = id;
				}}
				{fastMode}
				introMode={!metric && !sortVar}
				{zoomSprite}
			/>

			<!-- {#if currentYear}
				<div class="yearLabel">{currentYear}</div>
			{/if} -->

			{#if legendData.length > 0}
				<div class="legendContainer">
					{#if chartTitle}
						<div class="chartTitle">{chartTitle}</div>
					{/if}
					<Legend items={legendData} />
				</div>
			{/if}
		{/if}
	</div>
	<div class="scrollyContainer">
		<Scrolly increments={100} top={triggerOffset} showLine={true} bind:value>
			{#each copy.story as stage, i}
				{@const active = stepIndex === i}
				<div class="step {stage.addclass ?? ''}" class:active>
					<Text copy={stage.text} />
				</div>
			{/each}
		</Scrolly>
	</div>
</section>

<div class="headlineContainer">
	<h1 class="hed">{copy.hed}</h1>
	<h2 class="byline">
		by <a href="https://pudding.cool/author/alvin-chang/">alvin chang</a>
	</h2>
</div>

<div class="methods">
	<h4>Methodology</h4>
	<p>TKTKT TKTK TKTKT KTKTK TKTKTKTK</p>
	<Text copy={copy.methods} />
</div>

<Modal
	{data}
	lookup={panelData.lookup}
	{clickedPersonId}
	onclose={() => {
		clickedPersonId = null;
	}}
/>

<div class="debugControls">
	<button
		class="fastBtn"
		class:active={debugFast}
		onclick={() => (debugFast = !debugFast)}
	>
		⚡ fast mode
	</button>
	<label>
		sort_var
		<select bind:value={debugSortVar}>
			<option value="">— story</option>
			{#each Object.entries(panelData.lookup) as [waveKey, vars]}
				<optgroup label={waveKey}>
					{#each vars as v}
						{#if v}
							<option value={v}>{varDescriptions[v] ?? v}</option>
						{/if}
					{/each}
				</optgroup>
			{/each}
		</select>
	</label>
	<label>
		metric
		<select bind:value={debugMetric}>
			<option value="">— story</option>
			{#each Object.entries(panelData.lookup) as [waveKey, vars]}
				<optgroup label={waveKey}>
					{#each vars as v}
						{#if v}
							<option value={v}>{varDescriptions[v] ?? v}</option>
						{/if}
					{/each}
				</optgroup>
			{/each}
		</select>
	</label>
</div>

<style>
	.headlineContainer {
		width: 90%;
		max-width: 800px;
		color: white;
		position: absolute;
		left: 50%;
		top: 25%;
		text-align: center;
		transform: translate(-50%, -50%);
		text-transform: lowercase;
		transition: all 1500ms cubic-bezier(0, 1.02, 0.435, 1); /* custom */
		transition-timing-function: cubic-bezier(0, 1.02, 0.435, 1); /* custom */
	}
	.headlineContainer h1 {
		font-size: 27px;
		line-height: 0px;
	}
	.headlineContainer .byline {
		font-size: 15px;
		color: #b58ab1;
		margin-top:20px;
	}
	.headlineContainer .byline a {
		color: #ff70d4;
	}
	.debugControls {
		position: fixed;
		bottom: 16px;
		right: 16px;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 6px;
		background: rgba(0, 0, 0, 0.75);
		padding: 8px 10px;
		border-radius: 6px;
		font-size: 11px;
		color: white;
	}
	.debugControls label {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.fastBtn {
		font-size: 13px;
		font-weight: bold;
		padding: 6px 12px;
		border-radius: 4px;
		border: 2px solid #555;
		background: #222;
		color: #aaa;
		cursor: pointer;
		letter-spacing: 0.02em;
	}
	.fastBtn.active {
		background: #f59e0b;
		border-color: #f59e0b;
		color: black;
	}
	.debugControls select {
		font-size: 11px;
		background: #222;
		color: white;
		border: 1px solid #555;
		border-radius: 3px;
		padding: 2px 4px;
	}

	.yearLabel {
		position: absolute;
		top: 12px;
		right: 16px;
		font-size: 1.4rem;
		font-weight: bold;
		color: white;
		z-index: 10;
		pointer-events: none;
	}

	.chartTitle {
		font-family: var(--font-mono);
		font-size: 18px;
		font-weight: bold;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		line-height: 1;
		margin-bottom: 4px;
	}
</style>
