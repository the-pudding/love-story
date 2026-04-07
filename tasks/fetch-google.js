import fs from "fs";
import archieml from "archieml";
import docs from "../google.config.js";

const CWD = process.cwd();

const fetchGoogle = async ({ id, gid }) => {
	console.log(`fetching...${id}`);

	const base = "https://docs.google.com";
	const post = gid
		? `spreadsheets/u/1/d/${id}/export?format=csv&id=${id}&gid=${gid}`
		: `document/d/${id}/export?format=txt`;
	const url = `${base}/${post}`;

	try {
		const response = await fetch(url);
		const text = await response.text();

		if (gid) return text;

		const parsed = archieml.load(text);
		const str = JSON.stringify(parsed, null, 2);
		return str;
	} catch (err) {
		throw new Error(err);
	}
};

const parseCSV = (text) => {
	const rows = [];
	let currentRow = [];
	let currentCell = "";
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const nextChar = text[i + 1];

		if (char === '"' && inQuotes && nextChar === '"') {
			currentCell += '"';
			i++;
		} else if (char === '"') {
			inQuotes = !inQuotes;
		} else if (char === ',' && !inQuotes) {
			currentRow.push(currentCell);
			currentCell = "";
		} else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
			currentRow.push(currentCell);
			if (currentRow.some(cell => cell.trim())) {
				rows.push(currentRow);
			}
			currentRow = [];
			currentCell = "";
			if (char === '\r') i++;
		} else if (char !== '\r') {
			currentCell += char;
		}
	}

	if (currentCell || currentRow.length) {
		currentRow.push(currentCell);
		if (currentRow.some(cell => cell.trim())) {
			rows.push(currentRow);
		}
	}

	return rows;
};

const parsePythonDict = (dictStr) => {
	// Parse strings like: {0.0: '(0) No', 1.0: '(1) Yes'}
	if (!dictStr || !dictStr.startsWith('{')) return null;

	const translations = {};

	// Match patterns like: 0.0: '(0) No' or -1.0: '(-1) Refused'
	const regex = /(-?\d+\.?\d*):\s*'([^']+)'/g;
	let match;

	while ((match = regex.exec(dictStr)) !== null) {
		const numericValue = parseFloat(match[1]);
		const fullLabel = match[2];
		
		// Extract label without numeric prefix, e.g. "(1) Excellent" -> "Excellent"
		const shortLabel = fullLabel.replace(/^\(-?\d+\)\s*/, '').trim();
		
		// Store both versions for flexibility
		translations[fullLabel] = numericValue;
		if (shortLabel && shortLabel !== fullLabel) {
			translations[shortLabel] = numericValue;
		}
	}

	return Object.keys(translations).length > 0 ? translations : null;
};

const fetchMetricTranslations = async () => {
	console.log("fetching metric translations...");

	const id = "1h_6ZnHYh5Oq2EpMboacEo07k-937G70tH0ZyEG3qY4w";
	const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=0`;

	try {
		const response = await fetch(url);
		const text = await response.text();

		const rows = parseCSV(text);
		if (rows.length === 0) return "{}";

		// Find column indices from header row
		const header = rows[0].map(h => h.trim().toLowerCase());
		const columnIdx = header.indexOf("column");
		const valuesIdx = header.indexOf("values");

		if (columnIdx === -1 || valuesIdx === -1) {
			console.log("Could not find 'column' or 'values' headers");
			console.log("Found headers:", header);
			return "{}";
		}

		const translations = {};

		for (let i = 1; i < rows.length; i++) {
			const row = rows[i];
			const metric = row[columnIdx]?.trim();
			const valuesStr = row[valuesIdx]?.trim();

			if (!metric || !valuesStr || valuesStr === "numeric") continue;

			const parsed = parsePythonDict(valuesStr);
			if (parsed) {
				translations[metric] = parsed;
			}
		}

		return JSON.stringify(translations, null, 2);
	} catch (err) {
		throw new Error(err);
	}
};

(async () => {
	// Fetch regular docs
	for (let d of docs) {
		try {
			const str = await fetchGoogle(d);
			const file = `${CWD}/${d.filepath}`;
			fs.writeFileSync(file, str);
		} catch (err) {
			console.log(err);
		}
	}

	// Fetch metric translations
	try {
		const translations = await fetchMetricTranslations();
		const file = `${CWD}/src/data/metricTranslations.json`;
		fs.writeFileSync(file, translations);
		console.log("wrote metricTranslations.json");
	} catch (err) {
		console.log("error fetching translations:", err);
	}
})();