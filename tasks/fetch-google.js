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

// Manual overrides applied after the Google Sheet fetch.
// The sheet uses abbreviated or incorrect labels that don't match the actual
// Stata output values. These are the authoritative translations — do not remove.
const MANUAL_OVERRIDES = {
	w1_ppincimp: { "<$40K": 1, "$40K-$75K": 2, "$75K-$125K": 3, ">$125K": 4 },
	w2_ppincimp: { "<$40K": 1, "$40K-$75K": 2, "$75K-$125K": 3, ">$125K": 4 },
	w3_ppincimp: { "<$40K": 1, "$40K-$75K": 2, "$75K-$125K": 3, ">$125K": 4 },
	w1_ppwork: { "Working": 1, "Not working": 2, "Retired/Disabled": 3 },
	w2_ppwork: { "Working": 1, "Not working": 2, "Retired/Disabled": 3 },
	w3_ppwork: { "Working": 1, "Not working": 2, "Retired/Disabled": 3 },
	w1_ppeduc: { "HS diploma or less": 1, "Some college or Associate degree": 2, "Bachelor's degree": 3, "Master's or Professional/Doctorate": 4 },
	w2_ppeduc: { "HS diploma or less": 1, "Some college or Associate degree": 2, "Bachelor's degree": 3, "Master's or Professional/Doctorate": 4 },
	w3_ppeduc: { "HS diploma or less": 1, "Some college or Associate degree": 2, "Bachelor's degree": 3, "Master's or Professional/Doctorate": 4 },
	w1_ppage: { "18 to 35": 1, "36 to 50": 2, "51 to 65": 3, "65+": 4 },
	w2_ppage: { "18 to 35": 1, "36 to 50": 2, "51 to 65": 3, "65+": 4 },
	w3_ppage: { "18 to 35": 1, "36 to 50": 2, "51 to 65": 3, "65+": 4 },
	// Partnership status: sheet has abbreviated labels; data has verbose Stata output
	w1_partnership_status: { "married": 1, "partnered, not married": 2, "unpartnered, has had past partner": 3, "never had a partner": 4 },
	w2_partner_type: { "married": 1, "in unmarried partnership": 2, "unpartnered": 3, "never partnered": 4 },
	w3_partner_type: { "married": 1, "in unmarried partnership": 2, "unpartnered": 3, "never partnered": 4 },
	w1_q21a_year: { "Before 1980": 1, "1980–1989": 2, "1990–1999": 3, "2000–2009": 4, "2010–2017": 5 },
	w3_Q32: {
		"No, I did NOT meet [Partner_Name] through the Internet": 1,
		"Yes, a social networking site (like Facebook or Myspace)": 2,
		"Yes, an Internet dating or matchmaking site (like eHarmony or match.com)": 3,
		"Yes, an Internet classified advertising site (like Craigslist)": 4,
		"Yes, an Internet chat room": 5,
		"Yes, an app on my phone (like Tinder or Grindr)": 6,
		"Yes, a different kind of Internet service": 7
	},
	qual_diff_w1_w2: { "Much worse": -4, "Worse": -3, "Slightly worse": -2, "A little worse": -1, "No change": 0, "A little better": 1, "Slightly better": 2, "Better": 3, "Much better": 4 },
	qual_diff_w1_w3: { "Much worse": -4, "Worse": -3, "Slightly worse": -2, "A little worse": -1, "No change": 0, "A little better": 1, "Slightly better": 2, "Better": 3, "Much better": 4 },
	qual_diff_w1_w2_simple: { "Worse": 1, "No change": 2, "Better": 3, "Single": 4 },
	qual_diff_w1_w3_simple: { "Worse": 1, "No change": 2, "Better": 3, "Single": 4 },
	// w2/w3 rel_qual: null values are recoded to "Single" (unpartnered) — override
	// "Refused" label from the sheet to match w1_q34's "Single" for -1.
	w2_rel_qual_combo: { "Single": -1, "Excellent": 1, "Good": 2, "Fair": 3, "Poor": 4, "Very Poor": 5 },
	w3_rel_qual:       { "Single": -1, "Excellent": 1, "Good": 2, "Fair": 3, "Poor": 4, "Very Poor": 5 },
	w2_Q32_simple: { "No": 1, "Yes": 2, "Single": -1 },
	w3_Q32_simple: { "No": 1, "Yes": 2, "Single": -1 },
	// Relationship quality bucket: computed in notebook, not in the sheet
	w1_rel_qual_bucket: { "Single": -1, "Excellent": 1, "Good": 2, "Fair or worse": 3 },
	w2_rel_qual_bucket: { "Single": -1, "Excellent": 1, "Good": 2, "Fair or worse": 3 },
	w3_rel_qual_bucket: { "Single": -1, "Excellent": 1, "Good": 2, "Fair or worse": 3 },
	// Duration buckets: computed in notebook, not in the sheet
	w1_relate_duration_bucket: { "Single": -1, "0–5": 1, "5–10": 2, "10–20": 3, "20+": 4 },
	w2_relationship_duration_bucket: { "Single": -1, "0–5": 1, "5–10": 2, "10–20": 3, "20+": 4 },
	w3_relationship_duration_bucket: { "Single": -1, "0–5": 1, "5–10": 2, "10–20": 3, "20+": 4 },
	// Fight frequency buckets: computed in notebook, not in the sheet
	w2_fight_bucket: { "Single": -1, "0": 1, "1-3": 2, "4+": 3 },
	w3_fight_bucket: { "Single": -1, "0": 1, "1-3": 2, "4+": 3 },
	// Pandemic income change buckets: computed in notebook, not in the sheet
	w2_pandemic_income_bucket: { "Much worse": 1, "Worse": 2, "No change": 3, "Better": 4, "Much better": 5 },
	w3_pandemic_income_bucket: { "Worse": 1, "No change": 2, "Better": 3 },
	// Q23 earner classification: computed in notebook, not in the sheet
	w1_q23_earner: { "Single": -1, "Same-sex couple": 0, "Man earns more": 1, "Woman earns more": 2 },
	w2_Q23_earner: { "Single": -1, "Same-sex couple": 0, "Man earns more": 1, "Woman earns more": 2 },
	w3_Q23_earner: { "Single": -1, "Same-sex couple": 0, "Man earns more": 1, "Woman earns more": 2 },
	// Pandemic effect: null recoded to "Single" in notebook
	w2_coronavirus_effect_combo: { "Single": -1, "better rel than before": 1, "no change": 2, "worse rel than before": 3 },
	w3_coronavirus_effect_combo: { "Single": -1, "Our relationship is better than before": 1, "No change": 2, "Our relationship is worse than before": 3 },
	// Otherdate: null recoded to "In a relationship" in notebook
	w3_otherdate: { "In a relationship": -1, "no": 0, "yes": 1 },
	w2_otherdate_combo: { "In a relationship": -1, "No, I have not met anyone for dating, romance, or sex  in the past year": 1, "Yes, I have met at least one person for dating, romance, or sex  in the past year.": 2 },
	// Raw variables added to export — lock sort order so gdoc can't override with stale sheet values
	w3_vaccine_same: { "yes": 1, "no": 2 },
	w3_COVID_agreement: {
		"Partner and I have been in complete agreement about how to be safe during the pandemic": 1,
		"Partner and I have mostly agreed about how to be safe during the pandemic": 2,
		"Partner and I have mostly Disagreed about how to be safe during the pandemic": 3,
		"Partner and I have Completely disagreeded about how to be safe during the pandemic": 4,
	},
	w2_p_monogamy: {
		"Yes, I expect that [xnamep] will only have sex with me": 1,
		"No, I expect [xnamep] to have sex with other people besides me": 2,
	},
	w3_p_monogamy: {
		"yes, I expect partner will only have sex with me": 1,
		"No, i expect partner to have sex with others": 2,
	},
	w3_monogamy: {
		"Yes, I expect to have sex only with partner": 1,
		"No, I expect to have sex with others besides Partner": 2,
	},
	w3_government_response: {
		"Individuals should have free choice about whether to be vaccinated and the government should play no role.": 1,
		"The government should persuade eligible people to be vaccinated against COVID-19": 2,
		"The government should mandate that all eligible people be vaccinated against COVID-19": 3,
	},
	// Party ID scale (respondent + partner, all waves) — computed/filled in notebook
	w1_partyid7: { "Strong Democrat": 1, "Not Strong Democrat": 2, "Leans Democrat": 3, "Undecided/Independent/Other": 4, "Leans Republican": 5, "Not Strong Republican": 6, "Strong Republican": 7 },
	w1_q12:        { "Strong Democrat": 1, "Not Strong Democrat": 2, "Leans Democrat": 3, "Undecided/Independent/Other": 4, "Leans Republican": 5, "Not Strong Republican": 6, "Strong Republican": 7 },
	w2_Q12_filled: { "Strong Democrat": 1, "Not Strong Democrat": 2, "Leans Democrat": 3, "Undecided/Independent/Other": 4, "Leans Republican": 5, "Not Strong Republican": 6, "Strong Republican": 7 },
	w3_Q12_filled: { "Strong Democrat": 1, "Not Strong Democrat": 2, "Leans Democrat": 3, "Undecided/Independent/Other": 4, "Leans Republican": 5, "Not Strong Republican": 6, "Strong Republican": 7 },
	// Political alignment: computed in notebook, not in the sheet
	w1_political_alignment: { "Same": 1, "Similar": 2, "Different": 3, "Very different": 4 },
	w2_political_alignment: { "Same": 1, "Similar": 2, "Different": 3, "Very different": 4 },
	w3_political_alignment: { "Same": 1, "Similar": 2, "Different": 3, "Very different": 4 },
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

		// Apply manual overrides — these take precedence over the sheet
		Object.assign(translations, MANUAL_OVERRIDES);

		return JSON.stringify(translations, null, 2);
	} catch (err) {
		throw new Error(err);
	}
};


(async () => {
	// Fetch regular docs
	for (let d of docs) {
		try {
			let str = await fetchGoogle(d);
			// Patch copy.json colors after fetch
			if (d.filepath === "src/data/copy.json") {
				const parsed = JSON.parse(str);
				if (!parsed.colors) parsed.colors = {};
				// ArchieML [.key] produces [{k:v}, ...] instead of {k:v}.
				// Flatten any array-of-objects palette to a single plain object.
				// Also normalize underscore-separated keys to spaces, since ArchieML
				// doesn't support spaces in keys (e.g. No_change → "No change").
				for (const key of Object.keys(parsed.colors)) {
					const val = parsed.colors[key];
					if (Array.isArray(val) && val.length > 0 && val.every(item => item && typeof item === "object" && !Array.isArray(item))) {
						parsed.colors[key] = Object.assign({}, ...val);
					}
					if (parsed.colors[key] && typeof parsed.colors[key] === "object" && !Array.isArray(parsed.colors[key])) {
						const normalized = {};
						for (const [k, v] of Object.entries(parsed.colors[key])) {
							normalized[k.replace(/_/g, " ")] = v;
						}
						parsed.colors[key] = normalized;
					}
				}
				str = JSON.stringify(parsed, null, 2);
			}
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