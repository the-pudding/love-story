<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Person from "$components/love/Person.love.svelte";
	import Text from "$components/love/Text.love.svelte";
	import Legend from "$components/love/Legend.love.svelte";

	import panelData from "$data/panel_all3waves.json";
	import copy from "$data/copy.json";
	import metricTranslations from "$data/metricTranslations.json";

	const data = panelData.data;
	const lookup = panelData.lookup;

	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let value = $state(0);

	const personSize = 20;
	const cols = $derived(Math.floor(containerWidth / personSize) || 1);
	const rows = $derived(Math.floor(containerHeight / personSize) || 1);

	const sortGroupVar = $derived(copy.story[value]?.sortgroup_var);
	const sortVar = $derived(copy.story[value]?.sort_var);
	const sortIdx = $derived(getVarIndex(sortGroupVar, sortVar));

	const wave = $derived(copy.story[value]?.wave);
	const metric = $derived(copy.story[value]?.metric);
	const metricIdx = $derived(getVarIndex(wave, metric));

	const maxMetric = $derived(parseFloat(copy.story[value]?.max_metric) || 5);
	const metricReverse = $derived(copy.story[value]?.metric_reverse === "true");

	function getVarIndex(group, varName) {
		if (!group || !varName || !lookup[group]) return -1;
		return lookup[group].indexOf(varName);
	}

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

		// Loop through the translation dictionary to find the matching text key
		for (const [textKey, mappedValue] of Object.entries(translations)) {
			if (Number(mappedValue) === Number(targetNumber)) {
				return textKey;
			}
		}

		return targetNumber;
	}

	// --- Color Scale Logic ---
	const nullColor = "#e2e8f0"; // Keep a static gray for null/N/A values

	const palette = $derived.by(() => {
		const rawColors = copy.story[value]?.colors;
		console.log(rawColors);
		// Fallback palette just in case a stage is missing the colors property
		const fallback = [
			"#f0fdfa",
			"#a5f3fc",
			"#38bdf8",
			"#3b82f6",
			"#1d4ed8",
			"#1e3a8a"
		];
		if (!rawColors) return fallback;

		try {
			// Parse the stringified array from the JSON ("[\"#fff\", ...]")
			return typeof rawColors === "string" ? JSON.parse(rawColors) : rawColors;
		} catch (e) {
			console.error("Failed to parse colors array:", e);
			return fallback;
		}
	});

	const minMetric = $derived.by(() => {
		if (!metric || !metricTranslations[metric]) return 1;
		const hasZero = Object.values(metricTranslations[metric]).includes(0);
		return hasZero ? 0 : 1;
	});

	const getColor = $derived.by(() => {
		// Capture current palette in closure
		const currentPalette = palette;
		const currentMinMetric = minMetric;
		const currentMaxMetric = maxMetric;
		const currentReverse = metricReverse;

		return (val) => {
			if (val == null) return nullColor;

			const numVal = Number(val);
			if (isNaN(numVal) || numVal < 0) return nullColor;

			let index = Math.max(
				currentMinMetric,
				Math.min(numVal, currentMaxMetric)
			);

			if (currentReverse) {
				index = currentMaxMetric - index + currentMinMetric;
			}

			return currentPalette[index] || nullColor;
		};
	});

	// --- Legend Data Generator ---
	const legendData = $derived.by(() => {
		if (metricIdx === -1) return [];

		const items = [];
		// Loop now starts at our dynamic minMetric (0 or 1)
		for (let i = minMetric; i <= maxMetric; i++) {
			items.push({
				numericValue: i,
				label: getTextLabel(metric, i),
				color: getColor(i)
			});
		}
		return items;
	});

	// --- Sort Logic ---
	const sortedData = $derived.by(() => {
		if (sortIdx === -1) {
			return [...data].sort((a, b) => a.id - b.id);
		}

		// Get the sort order from metricTranslations keys (preserves the order they were defined)
		const sortOrder = metricTranslations[sortVar]
			? Object.keys(metricTranslations[sortVar])
			: [];

		return [...data].sort((a, b) => {
			const rawA = a[sortGroupVar]?.[sortIdx];
			const rawB = b[sortGroupVar]?.[sortIdx];

			// For string values, use the order from metricTranslations
			const strA = rawA == null ? null : String(rawA);
			const strB = rawB == null ? null : String(rawB);

			// Primary sort: by group variable using translation key order
			if (strA !== strB) {
				if (strA == null) return 1;
				if (strB == null) return -1;

				const orderA = sortOrder.indexOf(strA);
				const orderB = sortOrder.indexOf(strB);

				// If both are in the sortOrder, use that order
				if (orderA !== -1 && orderB !== -1) {
					return orderA - orderB;
				}
				// If only one is found, put the unknown one at the end
				if (orderA !== -1) return -1;
				if (orderB !== -1) return 1;

				// Fallback to string comparison
				return strA.localeCompare(strB);
			}

			// Secondary sort: by metric value WITHIN the same group
			if (metricIdx !== -1) {
				const rawMetricA = a[wave]?.[metricIdx];
				const rawMetricB = b[wave]?.[metricIdx];

				const metricA = translateMetric(metric, rawMetricA);
				const metricB = translateMetric(metric, rawMetricB);

				if (metricA == null && metricB == null) return 0;
				if (metricA == null) return 1;
				if (metricB == null) return -1;

				const numMetA = Number(metricA);
				const numMetB = Number(metricB);

				return numMetA - numMetB;
			}

			// Tertiary sort: stable by ID
			return a.id - b.id;
		});
	});

	// --- Grouping and Layout Logic ---
	const groupedData = $derived.by(() => {
		const groups = [];
		let currentGroupRaw = undefined; // Use undefined so null can be a valid group
		let currentGroup = null;

		for (const item of sortedData) {
			const rawVal = sortIdx !== -1 ? item[sortGroupVar]?.[sortIdx] : null;

			// Group by the RAW value, not the translated value
			if (rawVal !== currentGroupRaw || !currentGroup) {
				currentGroupRaw = rawVal;

				// Get display label - use raw value directly if it's a string, otherwise reverse lookup
				let textLabel;
				if (rawVal === null || rawVal === undefined) {
					textLabel = "N/A";
				} else if (typeof rawVal === "string") {
					textLabel = rawVal; // Already a readable string like "Less than $50,000"
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

	const groupPadding = 40;
	const labelHeight = 30;

	const layout = $derived.by(() => {
    const posMap = new Map();
    const labelPositions = [];
    let currentY = 0;

    if (sortIdx === -1) {
        sortedData.forEach((p, i) => {
            posMap.set(p.id, {
                x: (i % cols) * personSize,
                y: Math.floor(i / cols) * personSize
            });
        });
        return { positions: posMap, labels: [] };
    }

    for (const group of groupedData) {
        labelPositions.push({
            text: group.label,
            x: 0,
            y: currentY
        });

        currentY += labelHeight;

        const numItems = group.items.length;
        
        // How many columns do we need? Use full width, but not more than we have items
        const numCols = Math.min(cols, numItems);
        
        // Base rows per column (some columns may have one extra)
        const baseRows = Math.floor(numItems / numCols);
        const extraItems = numItems % numCols; // This many columns get an extra row

        let itemIndex = 0;
        
        for (let col = 0; col < numCols; col++) {
            // Left columns get the extra row
            const rowsInThisCol = baseRows + (col < extraItems ? 1 : 0);
            
            for (let row = 0; row < rowsInThisCol; row++) {
                const p = group.items[itemIndex];
                posMap.set(p.id, {
                    x: col * personSize,
                    y: currentY + row * personSize
                });
                itemIndex++;
            }
        }

        // Total rows is the max height (the columns with extra items)
        const totalRows = baseRows + (extraItems > 0 ? 1 : 0);
        currentY += totalRows * personSize + groupPadding;
    }

    return { positions: posMap, labels: labelPositions };
});

	const positions = $derived(layout.positions);
	const labels = $derived(layout.labels);

	let innerHeight = $state(0);
	const triggerOffset = $derived(innerHeight * 0.85);
	
</script>

<div class="debug">
	{sortGroupVar}, {sortVar}, {sortIdx} | {wave}, {metric}, {metricIdx} | max: {maxMetric},
	reverse: {metricReverse}
</div>

<svelte:window bind:innerHeight />

<section id="scrolly">
	<div
		class="visualContainer"
		bind:clientWidth={containerWidth}
		bind:clientHeight={containerHeight}
	>
		{#if containerWidth > 0}
			{#if legendData.length > 0}
				<div class="legendContainer">
					<Legend items={legendData} />
				</div>
			{/if}

			{#each labels as label}
				<div
					class="groupLabel"
					style="transform: translate({label.x}px, {label.y}px)"
				>
					{label.text}
				</div>
			{/each}

			{#each data as p (p.id)}
				{@const pos = positions.get(p.id)}
				{@const sortValue = sortIdx !== -1 ? p[sortGroupVar]?.[sortIdx] : null}
				{@const rawMetric = metricIdx !== -1 ? p[wave]?.[metricIdx] : null}
				{@const metricValue = translateMetric(metric, rawMetric)}
				{@const personColor = getColor(metricValue)}

				<Person
					{p}
					x={pos.x}
					y={pos.y}
					{personSize}
					{sortValue}
					{metricValue}
					{maxMetric}
					{metricReverse}
					color={personColor}
				/>
			{/each}
		{/if}
	</div>
	<div class="scrollyContainer">
		<Scrolly increments={100} top={triggerOffset} showLine={true} bind:value>
			{#each copy.story as stage, i}
				{@const active = value === i}
				<div class="step" class:active>
					<Text copy={stage.text} />
				</div>
			{/each}
		</Scrolly>
	</div>
</section>

<style>
	.step {
		pointer-events: auto;
		min-height: 100vh;
	}

	.step:first-child {
		margin-top: 90vh;
	}

	.step:last-child {
		margin-bottom: 50vh;
	}

	.groupLabel {
		position: absolute;
		top: 0;
		left: 0;
		font-family: sans-serif;
		font-weight: bold;
		font-size: 14px;
		color: #333;
		transition: transform 0.5s ease;
		pointer-events: none;
	}
</style>
