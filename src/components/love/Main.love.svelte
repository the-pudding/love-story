<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Canvas from "$components/love/Main.canvas.love.svelte";
	import Text from "$components/love/Text.love.svelte";
	import Legend from "$components/love/Legend.love.svelte";

	import panelData from "$data/panel_all3waves.json";
	import copy from "$data/copy.json";
	import metricTranslations from "$data/metricTranslations.json";

	const data = panelData.data;
	const lookup = panelData.lookup;

	let containerWidth = $state(0);
	let containerHeight = $state(0);

	// `value` is the step index output by Scrolly (0, 1, 2, 3...).
	// We alias it as stepIndex so all derivations read from a clearly named variable.
	let value = $state(0);
	const stepIndex = $derived(value ?? 0);

	// Shared padding constants
	const canvasPadding = 20;
	const legendHeight = 60;

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

	const cols = $derived(Math.floor((containerWidth - canvasPadding * 2) / personSize) || 1);

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

	// All story-driven state reads from stepIndex, not value
	const sortVar = $derived(copy.story[stepIndex]?.sort_var);
	const sortWave = $derived(getVarWave(sortVar));
	const sortIdx = $derived(getVarIndex(sortWave, sortVar));

	const metric = $derived(copy.story[stepIndex]?.metric);
	const wave = $derived(getVarWave(metric));
	const metricIdx = $derived(getVarIndex(wave, metric));

	const metricReverse = $derived(copy.story[stepIndex]?.metric_reverse === "true");
	const zoomId = $derived(
		copy.story[stepIndex]?.zoom_id !== undefined
			? Number(copy.story[stepIndex].zoom_id)
			: null
	);
	const zoomLabel = $derived(copy.story[stepIndex]?.zoom_label ?? null);

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
	function getTextLabel(metricName, targetNumber) {
		const translations = metricTranslations[metricName];
		if (!translations) return targetNumber;

		for (const [textKey, mappedValue] of Object.entries(translations)) {
			if (Number(mappedValue) === Number(targetNumber)) {
				return textKey;
			}
		}

		return targetNumber;
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

		// 1. Prefer copy.colors keyed by metric name
		if (copy.colors?.[metric]) return copy.colors[metric];

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
		const vals = [...new Set(Object.values(translations).map(Number))].sort((a, b) => a - b);
		return vals;
	});

	const getColor = $derived.by(() => {
		const currentPalette = palette;
		const currentValues = sortedMetricValues;
		const currentReverse = metricReverse;

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

		return Object.entries(translations)
			.map(([label, numericValue]) => ({
				numericValue: Number(numericValue),
				label,
				color: getColor(Number(numericValue))
			}))
			.filter(item => item.numericValue >= minMetric && item.numericValue <= maxMetric)
			.filter((item, _, arr) =>
				arr.filter(x => x.numericValue === item.numericValue).sort((a, b) => a.label.length - b.label.length)[0].label === item.label
			)
			.sort((a, b) => a.numericValue - b.numericValue);
	});

	// --- Sort Logic ---
	const sortedData = $derived.by(() => {
		if (sortIdx === -1) {
			return [...data].sort((a, b) => a.id - b.id);
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

				return Number(metricA) - Number(metricB);
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
					textLabel = rawVal;
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
		return groups;
	});

	// --- Layout Logic ---
	const layout = $derived.by(() => {
		const posMap = new Map();
		const labelPositions = [];
		let currentY = 0;

		if (sortIdx === -1) {
			sortedData.forEach((p, i) => {
				posMap.set(p.id, {
					x: (i % cols) * personSize,
					y: Math.floor(i / cols) * personSize * 2
				});
			});
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

	const positions = $derived(layout.positions);
	const labels = $derived(layout.labels);

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
			const colorValue = metricValue == null && nullValue !== null ? nullValue : metricValue;
			m.set(person.id, getColor(colorValue));
		}
		return m;
	});

	let innerHeight = $state(0);
	const triggerOffset = $derived(innerHeight * 0.85);
</script>

<div class="debug">
	sort: {sortVar} (wave: {sortWave}, idx: {sortIdx}) | metric: {metric} (wave: {wave}, idx: {metricIdx}) | min: {minMetric}, max: {maxMetric}, reverse: {metricReverse}
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
				padding={canvasPadding}
				topPadding={legendHeight + canvasPadding}
				w={containerWidth}
				h={containerHeight}
			/>

			{#if legendData.length > 0}
				<div class="legendContainer">
					<Legend items={legendData} />
				</div>
			{/if}
		{/if}
	</div>
	<div class="scrollyContainer">
		<Scrolly increments={100} top={triggerOffset} showLine={true} bind:value>
			{#each copy.story as stage, i}
				{@const active = stepIndex === i}
				<div class="step" class:active>
					<Text copy={stage.text} />
				</div>
			{/each}
		</Scrolly>
	</div>
</section>

<style>
	
</style>