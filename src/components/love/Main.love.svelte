<script>
	import { fade, fly } from 'svelte/transition';
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Canvas from "$components/love/Main.canvas.love.svelte";
	import Text from "$components/love/Text.love.svelte";
	import Legend from "$components/love/Legend.love.svelte";
	import Modal from "$components/love/Modal.love.svelte";
	import panelData from "$data/panel_all3waves.json";
	import copy from "$data/copy.json";
	import metricTranslations from "$data/metricTranslations.json";
	import chartConfig from "$data/chartConfig.json";

	const data = panelData.data;
	const lookup = panelData.lookup;

	// Toggle: true = gaps between icon color groups + null-metric icons off-screen
	//         false = original flat layout, no gaps
	let iconValueGaps = $state(true);
	// Social mode: locks text and legend to 20px for screen recordings / social sharing
	let socialMode = $state(false);
	// Gap between color groups, as a multiple of personSize (e.g. 0.5 = half an icon wide)
	let iconGapRatio = $state(.5);

	let containerWidth = $state(0);
	let containerHeight = $state(0);

	// `value` is the step index output by Scrolly (0, 1, 2, 3...).
	let value = $state(undefined);
	let lastStep = $state(0);
	let hasEnteredStory = $state(false);
	$effect(() => {
		if (value !== undefined) { lastStep = value; hasEnteredStory = true; }
	});
	const stepIndex = $derived(value ?? lastStep);

	// Inject palette colors as CSS custom properties (--color-magenta, --color-pink, etc.)
	// so app.css can reference them via var() — chartConfig.palette is the single source of truth
	$effect(() => {
		const root = document.documentElement;
		for (const [name, hex] of Object.entries(chartConfig.palette ?? {})) {
			root.style.setProperty(`--color-${name}`, hex);
		}
	});

	// Detect prefers-reduced-motion (mirrors the mq store pattern from leftovers)
	let reduceMotion = $state(false);
	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = mq.matches;
		const onChange = () => { reduceMotion = mq.matches; };
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	// Shared padding constants
	const canvasPadding = $derived(containerWidth < 500 ? 8 : 20);
	const baseLegendHeight = 60;
	const chartTitleHeight = 22;
	let legendContainerHeight = $state(baseLegendHeight);

	const chartTitle = $derived(copy.story[stepIndex]?.chart_title ?? null);
	const legendHeight = $derived(
		baseLegendHeight + (chartTitle ? chartTitleHeight : 0)
	);

	// groupPadding shrinks on narrow screens
	const groupPadding = $derived(containerWidth < 500 ? 8 : 20);
	const labelHeight = 30;

	// personSize is stable: always reserve space for MAX_GROUPS so icons
	// don't resize as the user scrolls between steps.
	const MAX_GROUPS = 4;
	const personSize = $derived.by(() => {
		if (!containerWidth || !containerHeight || !data.length) return 10;
		const availW = containerWidth - canvasPadding * 2;
		const availH = containerHeight - legendHeight - canvasPadding * 2;
		const overheadH = MAX_GROUPS * (labelHeight + groupPadding);
		const effectiveH = Math.max(availH - overheadH, availH * 0.5);
		const roughPs = Math.sqrt((availW * effectiveH) / (2.8 * data.length));
		const numGaps = iconValueGaps && sortIdx !== -1 && metricIdx !== -1
			? Math.max(0, sortedMetricValues.length - 1) : 0;
		const ps = Math.sqrt(((availW - numGaps * roughPs * iconGapRatio) * effectiveH) / (2.8 * data.length));
		return Math.max(4, Math.min(40, Math.floor(ps)));
	});

	const cols = $derived.by(() => {
		const numGaps = iconValueGaps && sortIdx !== -1 && metricIdx !== -1
			? Math.max(0, sortedMetricValues.length - 1) : 0;
		return Math.max(1, Math.floor((containerWidth - canvasPadding * 2 - numGaps * personSize * iconGapRatio) / personSize));
	});

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

	// ── Explore mode options ─────────────────────────────────────────────────
	// Edit these arrays to control what appears in the user-facing dropdowns.
	const EXPLORE_SORT_OPTIONS = [
		{ value: "w1_ppgender", label: "Gender",          group: null },
		{ value: "w1_ppethm",   label: "Race / ethnicity", group: null },
		{ value: "w1_partnership_status",           label: "Partnership status",   group: "2017" },
		{ value: "w1_relate_duration_bucket",       label: "Relationship length",  group: "2017" },
		{ value: "w1_rel_qual_bucket",              label: "Relationship quality",  group: "2017" },
		{ value: "w1_ppage",                        label: "Age group",             group: "2017" },
		{ value: "w1_ppincimp",                     label: "Household income",      group: "2017" },
		{ value: "w2_partner_type",                 label: "Partnership status",    group: "2020" },
		{ value: "w2_relationship_duration_bucket", label: "Relationship length",   group: "2020" },
		{ value: "w2_rel_qual_bucket",              label: "Relationship quality",  group: "2020" },
		{ value: "w2_coronavirus_effect_combo",     label: "Pandemic effect",       group: "2020" },
		{ value: "w2_ppage",                        label: "Age group",             group: "2020" },
		{ value: "w2_ppincimp",                     label: "Household income",      group: "2020" },
		{ value: "w3_partner_type",                 label: "Partnership status",    group: "2022" },
		{ value: "w3_relationship_duration_bucket", label: "Relationship length",   group: "2022" },
		{ value: "w3_rel_qual_bucket",              label: "Relationship quality",  group: "2022" },
		{ value: "w3_coronavirus_effect_combo",     label: "Pandemic effect",       group: "2022" },
		{ value: "w3_ppage",                        label: "Age group",             group: "2022" },
		{ value: "w3_ppincimp",                     label: "Household income",      group: "2022" },
	];
	const EXPLORE_METRIC_OPTIONS = [
		{ value: "w1_rel_qual_bucket",       label: "Relationship quality",       group: "2017" },
		{ value: "w1_met_through_friend",    label: "Met through friends",        group: "2017" },
		{ value: "w1_met_through_family",    label: "Met through family",         group: "2017" },
		{ value: "w1_met_as_through_cowork", label: "Met through work",           group: "2017" },
		{ value: "w1_q24_church",            label: "Met through church",         group: "2017" },
		{ value: "w1_no_friend_overlap",     label: "No prior friend overlap",    group: "2017" },
		{ value: "w2_rel_qual_bucket",       label: "Relationship quality",       group: "2020" },
		{ value: "qual_diff_w1_w2_simple",   label: "Relationship change (2017 to 2022)", group: "2020" },
		{ value: "w2_coronavirus_effect_combo", label: "Pandemic effect",         group: "2020" },
		{ value: "w2_fight_bucket",          label: "Arguments with partner",     group: "2020" },
		{ value: "w2_relationship_end",      label: "Relationship ended",         group: "2020" },
		{ value: "w2_met_through_friend",    label: "Met through friends",        group: "2020" },
		{ value: "w2_met_through_family",    label: "Met through family",         group: "2020" },
		{ value: "w2_met_as_through_cowork", label: "Met through work",           group: "2020" },
		{ value: "w2_q24_church",            label: "Met through church",         group: "2020" },
		{ value: "w2_Q32_simple",            label: "Met partner online",         group: "2020" },
		{ value: "w2_no_friend_overlap",     label: "No prior friend overlap",    group: "2020" },
		{ value: "w3_rel_qual_bucket",       label: "Relationship quality",       group: "2022" },
		{ value: "qual_diff_w1_w3_simple",   label: "Relationship change (2017 to 2022)", group: "2022" },
		{ value: "w3_coronavirus_effect_combo", label: "Pandemic effect",         group: "2022" },
		{ value: "w3_fight_bucket",          label: "Arguments with partner",     group: "2022" },
		{ value: "w3_relationship_end_combo", label: "Relationship ended",        group: "2022" },
		{ value: "w3_covid_complete_agree",  label: "COVID safety agreement",     group: "2022" },
		{ value: "w3_met_through_friend",    label: "Met through friends",        group: "2022" },
		{ value: "w3_met_through_family",    label: "Met through family",         group: "2022" },
		{ value: "w3_met_as_through_cowork", label: "Met through work",           group: "2022" },
		{ value: "w3_q24_church",            label: "Met through church",         group: "2022" },
		{ value: "w3_Q32_simple",            label: "Met partner online",         group: "2022" },
		{ value: "w3_no_friend_overlap",     label: "No prior friend overlap",    group: "2022" },
	];
	// ─────────────────────────────────────────────────────────────────────────

	const isExplore = $derived(copy.story[stepIndex]?.addclass === "explore");

	let exploreSortVar = $state(EXPLORE_SORT_OPTIONS[0].value);
	let exploreMetric = $state(EXPLORE_METRIC_OPTIONS[0].value);

	// All story-driven state reads from stepIndex, not value
	const sortVar = $derived(
		isExplore ? exploreSortVar : copy.story[stepIndex]?.sort_var
	);
	const sortWave = $derived(getVarWave(sortVar));
	const sortIdx = $derived(getVarIndex(sortWave, sortVar));

	const metric = $derived(
		isExplore ? exploreMetric : copy.story[stepIndex]?.metric
	);
	const wave = $derived(getVarWave(metric));
	const metricIdx = $derived(getVarIndex(wave, metric));

	const metricReverse = $derived(
		copy.story[stepIndex]?.metric_reverse === "true"
	);
	const iconReverse = $derived(copy.story[stepIndex]?.icon_reverse === "true");
	const zoomId = $derived(
		copy.story[stepIndex]?.zoom_id !== undefined
			? Number(copy.story[stepIndex].zoom_id)
			: null
	);
	const zoomLabel = $derived(copy.story[stepIndex]?.zoom_label ?? null);
	const zoomSprite = $derived(copy.story[stepIndex]?.zoom_sprite ?? null);
	const bgSprite = $derived(
		copy.story[stepIndex]?.bgsprite !== undefined && copy.story[stepIndex]?.bgsprite !== ""
			? Number(copy.story[stepIndex].bgsprite)
			: null
	);
	const hideNoData = $derived(copy.story[stepIndex]?.hideNoData === 1 || copy.story[stepIndex]?.hideNoData === "1");

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
		const match = Object.entries(entry).find(
			([k]) => norm(k) === norm(rawLabel)
		);
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
	const nullColor = chartConfig.palette?.lavender ?? "#826c91";

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
				return Object.fromEntries(
					Object.entries(entry).map(([k, v]) => [k, resolveColor(v[1])])
				);
			}
			return Object.fromEntries(
				Object.entries(entry).map(([k, v]) => [k, resolveColor(v)])
			);
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
				const entry = chartConfig.colors?.[metric];
				if (entry && !Array.isArray(entry)) {
					const keys = Object.keys(entry).map(k => k.toLowerCase());
					const translations = metricTranslations[metric];
					const posOf = (numVal) => {
						const matches = Object.entries(translations ?? {}).filter(([, v]) => Number(v) === numVal);
						if (!matches.length) return 999;
						let best = 999;
						for (const [label] of matches) {
							const pos = keys.indexOf(label.toLowerCase());
							if (pos !== -1 && pos < best) best = pos;
						}
						return best;
					};
					const pa = posOf(a.numericValue);
					const pb = posOf(b.numericValue);
					if (pa !== pb) return pa - pb;
				}
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

	const legendKey = $derived(legendData.map(d => `${d.label}:${d.color}`).join('|'));

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

		const sortOrder = chartConfig.colors[sortVar]
			? Object.keys(chartConfig.colors[sortVar])
			: metricTranslations[sortVar]
				? Object.keys(metricTranslations[sortVar])
				: [];

		// Build metric order from chartConfig key order for within-group sorting
		const metricConfigEntry = chartConfig.colors?.[metric];
		const metricOrderMap = new Map();
		if (metricConfigEntry && !Array.isArray(metricConfigEntry)) {
			const metricKeys = Object.keys(metricConfigEntry).map(k => k.toLowerCase());
			const mTrans = metricTranslations[metric];
			if (mTrans) {
				for (const [label, numVal] of Object.entries(mTrans)) {
					const pos = metricKeys.indexOf(label.toLowerCase());
					if (pos !== -1 && !metricOrderMap.has(Number(numVal))) {
						metricOrderMap.set(Number(numVal), pos);
					}
				}
			}
		}

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

				if (metricOrderMap.size > 0) {
					const posA = metricOrderMap.get(numA) ?? 999;
					const posB = metricOrderMap.get(numB) ?? 999;
					if (posA !== posB) return posA - posB;
				} else {
					if (negToEnd) {
						const negA = numA < 0;
						const negB = numB < 0;
						if (negA && !negB) return 1;
						if (!negA && negB) return -1;
					}
					return numA - numB;
				}
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

		let nullGroup = null;

		function isSingleGroup(value, label = "") {
			if (value === null || value === undefined) return true;
			const checkStr = (String(value) + " " + String(label)).toLowerCase();
			return checkStr.includes("unpartner") || checkStr.includes("never") || checkStr.includes("single");
		}

		function placeGroup(items, groupValue = null, groupLabel = "") {
			// Move null-metric items off-screen right, but keep them if the sort group
			// itself represents unpartnered/single people (they legitimately have no data)
			let validItems = items;
			if (iconValueGaps && hideNoData && !isSingleGroup(groupValue, groupLabel) && metricIdx !== -1) {
				validItems = [];
				for (const item of items) {
					const rawVal = item[wave]?.[metricIdx];
					if (rawVal === null || rawVal === undefined || rawVal === "Single") {
						posMap.set(item.id, { x: Infinity, y: 0 });
					} else {
						validItems.push(item);
					}
				}
			}

			const numItems = validItems.length;
			if (numItems === 0) return 0;

			const numCols = Math.min(cols, numItems);
			const baseRows = Math.floor(numItems / numCols);
			const extraItems = numItems % numCols;
			const totalRows = baseRows + (extraItems > 0 ? 1 : 0);

			// Build color-group index map (order of first appearance, items are pre-sorted by color)
			let colorGroupMap = null;
			if (iconValueGaps) {
				colorGroupMap = new Map();
				let nextIdx = 0;
				for (const item of validItems) {
					const color = personColors.get(item.id);
					if (!colorGroupMap.has(color)) colorGroupMap.set(color, nextIdx++);
				}
			}

			// Same column-major layout for both modes; gaps mode nudges each item right
			// by its color-group index × gapRatio × personSize — layout otherwise identical
			let itemIndex = 0;
			for (let col = 0; col < numCols; col++) {
				const rowsInThisCol = baseRows + (col < extraItems ? 1 : 0);
				for (let row = 0; row < rowsInThisCol; row++) {
					const item = validItems[itemIndex++];
					const nudge = colorGroupMap
						? (colorGroupMap.get(personColors.get(item.id)) ?? 0) * iconGapRatio * personSize
						: 0;
					posMap.set(item.id, {
						x: col * personSize + nudge,
						y: currentY + row * personSize * 2
					});
				}
			}
			return totalRows;
		}

		for (const group of groupedData) {
			if (group.value === null || group.value === undefined) {
				nullGroup = group;
				continue;
			}

			labelPositions.push({ text: group.label, x: 0, y: currentY });
			currentY += labelHeight;

			const totalRows = placeGroup(group.items, group.value, group.label);
			currentY += totalRows * personSize * 2 + groupPadding;
		}

		// Place null-sort group last, labeled "Single" — always show all icons
		if (nullGroup) {
			labelPositions.push({ text: "Single", x: 0, y: currentY });
			currentY += labelHeight;
			placeGroup(nullGroup.items, null);
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

	const nullSortIds = $derived.by(() => {
		if (sortIdx === -1) return new Set();
		const nullGroup = groupedData.find(g => g.value === null || g.value === undefined);
		return new Set(nullGroup?.items.map(p => p.id) ?? []);
	});

	const singleSortIds = $derived.by(() => {
		const values = copy.story[stepIndex]?.single_sort_values;
		if (!values || sortIdx === -1) return new Set();
		const valueSet = new Set(values.map(Number));
		return new Set(data.filter(p => {
			const raw = p[sortWave]?.[sortIdx];
			const numeric = translateMetric(sortVar, raw);
			return valueSet.has(Number(numeric));
		}).map(p => p.id));
	});

	const isNoColor = $derived(copy.story[stepIndex]?.addclass === "nocolor");

	const nullIconColor = $derived(nullValue !== null ? getColor(nullValue) : null);

	// Resolve the "Single" color from chartConfig for the current sort variable.
	// Null-sorted people (unpartnered/Single group) always get this color regardless
	// of the active metric palette.
	const singleSortColor = $derived.by(() => {
		const entry = chartConfig.colors?.[sortVar];
		if (!entry || Array.isArray(entry)) return null;
		const singleEntry = Object.entries(entry).find(([k]) => k.toLowerCase() === "single");
		if (!singleEntry) return null;
		const colorRef = Array.isArray(singleEntry[1]) ? singleEntry[1][1] : singleEntry[1];
		return chartConfig.palette?.[colorRef] ?? colorRef;
	});

	const personColors = $derived.by(() => {
		const m = new Map();
		for (const person of data) {
			if (isNoColor || metricIdx === -1) { m.set(person.id, nullColor); continue; }
			const rawMetric = person[wave]?.[metricIdx];
			const metricValue = translateMetric(metric, rawMetric);
			const isNullSort = nullSortIds.has(person.id) || singleSortIds.has(person.id);
			const isNull = isNullSort || metricValue == null;
			if (isNullSort && singleSortColor) { m.set(person.id, singleSortColor); continue; }
			if (isNull && nullIconColor) { m.set(person.id, nullIconColor); continue; }
			const colorValue = isNull && nullValue !== null ? nullValue : metricValue;
			m.set(person.id, getColor(colorValue));
		}
		return m;
	});

	let innerHeight = $state(0);
	let windowScrollY = $state(0);
	const triggerOffset = $derived(innerHeight * 0.1);

	let clickedPersonId = $state(null);

	const waveYear = { w1: "2017", w2: "2020", w3: "2022" };
	const currentYear = $derived(waveYear[wave] ?? null);
</script>

<!-- <div class="debug">
	step: {value} | sort: {sortVar} (wave: {sortWave}, idx: {sortIdx}) | metric: {metric}
	(wave: {wave}, idx: {metricIdx}) | min: {minMetric}, max: {maxMetric},
	reverse: {metricReverse} | zoom_sprite: {zoomSprite}
</div> -->

<svelte:window bind:innerHeight bind:scrollY={windowScrollY} />

<section id="scrolly" class:social-mode={socialMode}>
	<div
		class="visualContainer"
		bind:clientWidth={containerWidth}
		bind:clientHeight={containerHeight}
	>
		<Canvas
			{data}
			{positions}
			{personColors}
			{personSize}
			zoomId={isCovid ? null : zoomId}
			zoomLabel={isCovid ? null : zoomLabel}
			selectedId={clickedPersonId}
			{labels}
			sort_varpadding={canvasPadding}
			topPadding={legendContainerHeight + canvasPadding * 2 + 20}
			w={containerWidth}
			h={containerHeight}
			onpersonclick={(id) => {
				clickedPersonId = id;
			}}
			introMode={!metric && !sortVar}
			zoomSprite={isCovid ? null : zoomSprite}
			bgSprite={windowScrollY > 50 && (value !== undefined || (hasEnteredStory && lastStep !== 0)) ? bgSprite : null}
			snapMode={reduceMotion}
			gapRatio={iconGapRatio}
			{socialMode}
		/>

		{#if containerWidth > 0}
			{#if chartTitle || legendData.length > 0}
				<div class="legendContainer" bind:clientHeight={legendContainerHeight}>
					{#if chartTitle}
						{#key chartTitle}
							<div class="chartTitle" out:fade={{ duration: 0 }} in:fly={{ y: 6, duration: 1200 }}>{chartTitle}</div>
						{/key}
					{/if}
					{#if legendData.length > 0}
						{#key legendKey}
							<div out:fade={{ duration: 0 }} in:fly={{ y: 6, duration: 1200 }}>
								<Legend items={legendData} />
							</div>
						{/key}
					{/if}
				</div>
			{/if}
		{/if}

		<div class="headlineContainer" class:hidden={windowScrollY > 50 && (value !== undefined || (hasEnteredStory && lastStep !== 0))}>
			<h1 class="hed">{copy.hed}</h1>
			<h2 class="byline">
				by <a href="https://pudding.cool/author/alvin-chang/">alvin chang</a>
			</h2>
		</div>

		<div class="scrollCue" class:hidden={windowScrollY > 50 && (value !== undefined || (hasEnteredStory && lastStep !== 0))}>
			<span>scroll down</span>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</div>

		{#if isExplore}
			<div class="exploreControls">
				<label class="exploreLabel">
					<span class="exploreHed">group by</span>
					<select bind:value={exploreSortVar}>
						{#each EXPLORE_SORT_OPTIONS.filter(o => !o.group) as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
						{#each ["2017", "2020", "2022"] as yr}
							<optgroup label={yr}>
								{#each EXPLORE_SORT_OPTIONS.filter(o => o.group === yr) as opt}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</optgroup>
						{/each}
					</select>
				</label>
				<label class="exploreLabel">
					<span class="exploreHed">color by</span>
					<select bind:value={exploreMetric}>
						{#each ["2017", "2020", "2022"] as yr}
							<optgroup label={yr}>
								{#each EXPLORE_METRIC_OPTIONS.filter(o => o.group === yr) as opt}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</optgroup>
						{/each}
					</select>
				</label>
			</div>
		{/if}
	</div>
	<div class="scrollyContainer">
		<Scrolly increments={100} top={triggerOffset} showLine={true} bind:value>
			{#each copy.story as stage, i}
				{@const active = stepIndex === i}
				<div
					class="step {stage.addclass ?? ''}"
					class:active
					class:has-chart={stage.text?.includes('>>')}
				>
					<Text copy={stage.text} />
				</div>
			{/each}
		</Scrolly>
	</div>
</section>

<div class="methods">
	<h5>Methodology</h5>
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
	.headlineContainer.hidden {
		opacity: 0;
		pointer-events: none;
	}
	.scrollCue {
		position: absolute;
		bottom: 14vh;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		color: #b58ab1;
		font-size: 16px;
		text-transform: lowercase;
		letter-spacing: 0.08em;
		pointer-events: none;
		transition: opacity 800ms ease;
	}
	.scrollCue.hidden {
		opacity: 0;
	}
	.scrollCue svg {
		width: 30px;
		height: 30px;
		animation: scrollBounce 1.4s ease-in-out infinite;
	}
	@keyframes scrollBounce {
		0%, 100% { transform: translateY(0); opacity: 0.5; }
		50% { transform: translateY(6px); opacity: 1; }
	}
	.headlineContainer h1 {
		font-size: 27px;
		line-height: 0px;
	}
	.headlineContainer .byline {
		font-size: 15px;
		color: #b58ab1;
		margin-top: 20px;
	}
	.headlineContainer .byline a {
		color: #ff70d4;
	}
	.exploreControls {
		/* width: 600px; */
		max-width: 98%;
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		gap: 16px;
		background: rgba(0, 0, 0, 0.7);
		padding: 12px 16px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		z-index: 10000;
	}
	@media (max-width: 620px) {
		.exploreControls {
			flex-direction: column;
			gap: 12px;
			width: calc(100% - 40px);
			left: 20px;
			transform: none;
		}
		.exploreControls select {
			min-width: 0;
			width: 100%;
		}
	}
	.exploreLabel {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.exploreHed {
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.5);
	}
	.exploreControls select {
		font-family: var(--font-mono);
		font-size: 12px;
		background-color: transparent;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='3' viewBox='0 0 4 3'%3E%3Cpath d='M0 0l2 3 2-3z' fill='rgba(255,255,255,0.5)'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 8px center;
		appearance: none;
		-webkit-appearance: none;
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		padding: 4px 28px 4px 10px;
		cursor: pointer;
		outline: none;
		min-width: 200px;
		border-radius: 0px !important;
	}
	.exploreControls select:focus {
		/* border: 1px solid rgba(255, 255, 255, 1); */
	}
	.exploreControls option {
		background: #1a1a1a;
		color: white;
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
		margin-bottom: 9px;
	}
	@media (max-width: 620px) {
		.chartTitle {
			font-size: 17px;
		}
	}
	@media (max-width: 520px) {
		.chartTitle {
			font-size: 16px;
		}
	}
	@media (max-width: 420px) {
		.chartTitle {
			font-size: 15px;
		}
	}

	/* Social mode: fixed sizes at all breakpoints */
	:global(.social-mode .textContainer) {
		font-size: 20px !important;
	}
	:global(.social-mode .label) {
		font-size: 24px !important;
	}
	.social-mode .chartTitle {
		font-size: 22px !important;
	}
	
</style>
