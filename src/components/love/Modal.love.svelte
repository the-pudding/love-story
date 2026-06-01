<script>
	import { varDescriptions } from "$utils/varDescriptions.js";

	let { data, lookup, clickedPersonId, onclose } = $props();

	function getVal(person, wave, varName) {
		if (!person?.[wave]) return null;
		const idx = (lookup[wave] ?? []).indexOf(varName);
		if (idx === -1) return null;
		const v = person[wave][idx];
		return v === null || v === undefined ? null : v;
	}

	function genderNoun(g) {
		return g === "Male" ? "man" : g === "Female" ? "woman" : (g?.toLowerCase() ?? "");
	}

	function formatRace(r) {
		return (
			{
				"White, Non-Hispanic": "white, non-Hispanic",
				"Black, Non-Hispanic": "Black, non-Hispanic",
				Hispanic: "Hispanic",
				"2+ Races, Non-Hispanic": "multiracial, non-Hispanic"
			}[r] ??
			r ??
			""
		);
	}

	function buildDemoSentence(age, race, gender) {
		const g = genderNoun(gender);
		const isOther = race === "Other, Non-Hispanic";
		const raceStr = formatRace(race);
		const ageStr = age != null ? `${age}-year-old` : null;
		if (isOther) {
			if (ageStr) return `This is a ${w(ageStr)} ${w(g)} of ${w("another non-Hispanic background")} (in 2022).`;
			return `This is a ${w(g)} of ${w("another non-Hispanic background")}.`;
		}
		if (ageStr) return `This is a ${w(ageStr)} ${w(raceStr)} ${w(g)} (in 2022).`;
		return `This is a ${w(raceStr)} ${w(g)}.`;
	}

	const w = (t) => `<span class="dataVal">${t}</span>`;

	const SINGLE_STATUSES = new Set([
		"unpartnered, has had past partner",
		"never had a partner",
		"unpartnered",
		"never partnered"
	]);
	function isSingle(s) { return !s || SINGLE_STATUSES.has(s); }
	function isSameSexVal(v) { return v === "same_sex_couple" || v === "yes"; }

	function formatRelStatus(s) {
		return (
			{
				married: "married",
				"partnered, not married": "partnered but not married",
				"in unmarried partnership": "in an unmarried partnership",
				"unpartnered, has had past partner": "unpartnered",
				"never had a partner": "never partnered",
				unpartnered: "unpartnered",
				"never partnered": "never partnered"
			}[s] ??
			s ??
			""
		);
	}

	function formatPolitical(v) {
		return (
			{ Same: "the same", Similar: "similar", Different: "different", "Very different": "very different" }[v] ??
			v?.toLowerCase() ??
			""
		);
	}

	function roundYears(yrs) {
		const n = Number(yrs);
		return !yrs || isNaN(n) || n <= 0 ? null : Math.round(n);
	}

	function householdSentence(children, adults) {
		const nc = Number(children);
		const na = Number(adults);
		const cStr = isNaN(nc) ? null : `${w(nc === 0 ? "no" : nc)} ${nc === 1 ? "child" : "children"} under 18`;
		const aStr = isNaN(na) ? null : `${w(na)} ${na === 1 ? "adult" : "adults"} 18 or older`;
		if (!cStr && !aStr) return null;
		const parts = [cStr, aStr].filter(Boolean);
		return `They had ${parts.join(" and ")} in the household.`;
	}

	function formatPartyPhrase(v) {
		return (
			{
				"Strong Democrat": "a strong Democrat",
				"Not Strong Democrat": "a moderate Democrat",
				"Leans Democrat": "leaning Democrat",
				"Strong Republican": "a strong Republican",
				"Not Strong Republican": "a moderate Republican",
				"Leans Republican": "leaning Republican",
				"Undecided/Independent/Other": "independent or undecided"
			}[v] ?? v?.toLowerCase() ?? ""
		);
	}

	function formatCOVIDAgreement(v) {
		return (
			{
				"Partner and I have been in complete agreement about how to be safe during the pandemic":
					"in complete agreement about COVID safety",
				"Partner and I have mostly agreed about how to be safe during the pandemic":
					"mostly in agreement about COVID safety",
				"Partner and I have mostly Disagreed about how to be safe during the pandemic":
					"mostly in disagreement about COVID safety",
				"Partner and I have Completely disagreeded about how to be safe during the pandemic":
					"in complete disagreement about COVID safety"
			}[v] ??
			v ??
			""
		);
	}

	function buildRelNarrative(year, status, sameSexRaw, years, living, metOnlineRaw, earner, political) {
		const single = isSingle(status);
		if (single) {
			const isNever = status === "never had a partner" || status === "never partnered";
			return isNever
				? `In ${year}, this person ${w("had never been in a relationship")}.`
				: `In ${year}, this person was ${w("unpartnered")}.`;
		}

		const sameSex = isSameSexVal(sameSexRaw);
		let s = `In ${year}, this person was ${w(formatRelStatus(status))} in a ${w(sameSex ? "same-sex" : "heterosexual")} relationship.`;
		if (years) s += ` They had been in this relationship for ${w(years + " " + (years === 1 ? "year" : "years"))}.`;
		if (living === "Yes") s += ` They ${w("lived with")} their partner.`;
		else if (living === "No") s += ` They ${w("did not live with")} their partner.`;
		const metOnlineLower = metOnlineRaw?.toLowerCase();
		if (metOnlineLower === "yes") s += ` They met their partner ${w("online")}.`;
		else if (metOnlineLower === "no") s += ` They did not meet their partner online.`;
		if (!sameSex && earner === "Man earns more") s += ` The ${w("man")} earned more in this relationship.`;
		else if (!sameSex && earner === "Woman earns more") s += ` The ${w("woman")} earned more in this relationship.`;
		const pol = formatPolitical(political);
		if (pol) s += ` They had ${w(pol)} political views as their partner.`;
		return s;
	}

	function formatStatVal(varName, val) {
		if (varName === "w2_coronavirus_effect_combo" || varName === "w3_coronavirus_effect_combo") {
			return (
				{
					"better rel than before": "Better",
					"no change": "Same",
					"worse rel than before": "Worse",
					"Our relationship is better than before": "Better",
					"No change": "Same",
					"Our relationship is worse than before": "Worse"
				}[val] ?? val
			);
		}
		return val;
	}

	function statRows(person, waveKey, varNames) {
		return varNames.map((varName) => {
			const val = getVal(person, waveKey, varName);
			const missing = val === null || val === undefined || val === "Single";
			return {
				label: varDescriptions[varName] ?? varName,
				value: missing ? "--" : formatStatVal(varName, String(val))
			};
		});
	}

	const W1_STATS = ["w1_q34", "w1_sex_frequency", "w1_ppmsacat", "w1_ppincimp", "w1_ppwork", "w1_ppeduc"];
	const W2_STATS = ["w2_rel_qual_combo", "w2_sex_frequency", "w2_ppmsacat", "w2_ppincimp", "w2_ppwork", "w2_ppeduc", "w2_coronavirus_effect_combo", "w2_fight_bucket"];
	const W3_STATS = ["w3_rel_qual", "w3_sex_frequency", "w3_ppmsacat", "w3_ppincimp", "w3_ppwork", "w3_ppeduc", "w3_coronavirus_effect_combo", "w3_fight_bucket"];

	const person = $derived(
		clickedPersonId != null ? (data.find((p) => p.id === clickedPersonId) ?? null) : null
	);
	const open = $derived(clickedPersonId != null);
</script>

<div class="shelf" class:shelfopen={open} role="dialog" aria-label="Person details" tabindex="-1" onclick={(e) => e.stopPropagation()} onmousedown={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
	<button class="detailsClose" onclick={onclose}>Click to close</button>
	<div class="modalData">
		{#if person}
			{@const age = getVal(person, "d", "w3_ppage_raw")}
			{@const gender = getVal(person, "d", "w1_ppgender")}
			{@const race = getVal(person, "d", "w1_ppethm")}
			{@const partyId = getVal(person, "w1", "w1_partyid7")}
			{@const demoSentence = buildDemoSentence(age, race, gender)}

			<p class="narrative">{@html demoSentence} {#if partyId}They identified politically as {@html w(formatPartyPhrase(partyId))}.{/if}</p>

			<!-- Wave 1 -->
			<div class="waveHed">2017</div>

			{@const w1Status = getVal(person, "w1", "w1_partnership_status")}
				{@const w1Narrative = buildRelNarrative(
				"2017",
				w1Status,
				getVal(person, "w1", "w1_same_sex_couple"),
				roundYears(getVal(person, "w1", "w1_relate_duration_in2017_years")),
				getVal(person, "w1", "w1_q19"),
				getVal(person, "w1", "w1_either_internet_adjusted"),
				getVal(person, "w1", "w1_q23_earner"),
				getVal(person, "w1", "w1_political_alignment")
			)}
			{@const w1Household = householdSentence(
				getVal(person, "w1", "w1_children_under_18"),
				getVal(person, "w1", "w1_PPT18OV")
			)}
			{@const w1Stats = statRows(person, "w1", W1_STATS)}

			<p class="narrative">{@html w1Narrative}</p>
			{#if w1Household}<p class="narrative">{@html w1Household}</p>{/if}
			{#each w1Stats as stat}
				<div class="stat">
					<span class="statLabel">{stat.label}</span>
					<span class="statValue">{stat.value}</span>
				</div>
			{/each}

			<!-- Wave 2 -->
			<div class="waveHed">2020</div>

			{@const w2RelEnd = getVal(person, "w2", "w2_relationship_end")}
			{@const w2SameRel = w2RelEnd === "no report of breakup or partner death" && !isSingle(w1Status)}
			{@const w2Status = getVal(person, "w2", "w2_partner_type")}
			{@const w2Narrative = w2SameRel
				? "In 2020, this person was in the same relationship from before."
				: buildRelNarrative(
						"2020",
						w2Status,
						getVal(person, "w2", "w2_same_sex_couple"),
						roundYears(getVal(person, "w2", "w2_relationship_duration")),
						null,
						getVal(person, "w2", "w2_Q32_simple"),
						getVal(person, "w2", "w2_Q23_earner"),
						getVal(person, "w2", "w2_political_alignment")
					)}
			{@const w2Household = householdSentence(
				getVal(person, "w2", "w2_children_under_18"),
				getVal(person, "w2", "w2_PPT18OV")
			)}
			{@const w2Stats = statRows(person, "w2", W2_STATS)}

			<p class="narrative">{@html w2Narrative}</p>
			{#if w2Household && !w2SameRel}<p class="narrative">{@html w2Household}</p>{/if}
			{#each w2Stats as stat}
				<div class="stat">
					<span class="statLabel">{stat.label}</span>
					<span class="statValue">{stat.value}</span>
				</div>
			{/each}

			<!-- Wave 3 -->
			<div class="waveHed">2022</div>

			{@const w3RelEnd = getVal(person, "w3", "w3_relationship_end_combo")}
			{@const w2Status2 = getVal(person, "w2", "w2_partner_type")}
			{@const w3SameRel = w3RelEnd === "no report of breakup or partner death" && !isSingle(w2Status2)}
			{@const w3Status = getVal(person, "w3", "w3_partner_type")}
			{@const w3Single = isSingle(w3Status)}
				{@const w3Narrative = w3SameRel
				? "In 2022, this person was in the same relationship from before."
				: buildRelNarrative(
						"2022",
						w3Status,
						getVal(person, "w3", "w3_same_sex_couple"),
						roundYears(getVal(person, "w3", "w3_relationship_duration_yrs")),
						null,
						getVal(person, "w3", "w3_Q32_simple"),
						getVal(person, "w3", "w3_Q23_earner"),
						getVal(person, "w3", "w3_political_alignment")
					)}
			{@const w3Household = householdSentence(
				getVal(person, "w3", "w3_children_under_18"),
				getVal(person, "w3", "w3_PPT18OV")
			)}
			{@const w3Vaccine = getVal(person, "w3", "w3_vaccine_same")}
			{@const w3Covid = getVal(person, "w3", "w3_COVID_agreement")}
			{@const w3VaccineSentence =
				!w3Single && (w3Vaccine || w3Covid)
					? [
							w3Vaccine === "yes"
								? `They had ${w("the same vaccination status")}`
								: w3Vaccine === "no"
									? `They had ${w("different vaccination statuses")}`
									: null,
							w3Covid ? `were ${w(formatCOVIDAgreement(w3Covid))}` : null
						]
							.filter(Boolean)
							.join(" and ") + "."
					: null}
			{@const w3Stats = statRows(person, "w3", W3_STATS)}

			<p class="narrative">{@html w3Narrative}</p>
			{#if w3Household && !w3SameRel}<p class="narrative">{@html w3Household}</p>{/if}
			{#if w3VaccineSentence}<p class="narrative">{@html w3VaccineSentence}</p>{/if}
			{#each w3Stats as stat}
				<div class="stat">
					<span class="statLabel">{stat.label}</span>
					<span class="statValue">{stat.value}</span>
				</div>
			{/each}
		{/if}
	</div>
	<div class="fixed_spacer"></div>
	<div class="spacer"></div>
</div>

<style>
	.shelf {
		display: block;
		position: fixed;
		left: -360px;
		top: 0px;
		width: 360px;
		max-width: 100%;
		height: 100%;
		background: black;
		z-index: 999999;
		transition: left 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
		overflow-y: scroll;
		pointer-events: auto;
		scrollbar-color: #3d2840 black;
		scrollbar-width: thin;
	}
	.shelf::-webkit-scrollbar {
		width: 5px;
	}
	.shelf::-webkit-scrollbar-track {
		background: black;
	}
	.shelf::-webkit-scrollbar-thumb {
		background: #3d2840;
		border-radius: 3px;
	}
	.shelf.shelfopen {
		left: 0px;
	}
	.detailsClose {
		font-size: 15px;
		display: block;
		cursor: pointer;
		color: black;
		font-weight: bold;
		background: var(--hltextcolor);
		padding: 10px 5px;
		border: 5px solid #000;
		border-top: 10px solid #000;
		border-radius: 0;
		text-align: center;
		position: sticky;
		top: 0px;
		width: 100%;
		box-sizing: border-box;
		opacity: 0.9;
	}
	.detailsClose:hover {
		text-decoration: underline;
		opacity: 1;
	}
	.modalData {
		padding: 20px;
		box-sizing: border-box;
	}
	.waveHed {
		font-size: 1rem;
		margin: 20px 0 8px;
		font-weight: bold;
		color: var(--hltextcolor);
		border-bottom: 2px solid var(--hltextcolor);
	}
	.narrative {
		font-size: 0.82rem;
		line-height: 1.4;
		color:  rgba(255, 255, 255, 1);
		margin: 0 0 10px;
	}
	:global(.dataVal) {
		color:  rgba(255, 255, 255, 1);
	}
	.stat {
		display: block;
		margin-bottom: 10px;
		font-size: 0.78rem;
		line-height: 1.3;
	}
	.statLabel {
		display: block;
		color: rgba(255, 255, 255, 0.5);
	}
	.statValue {
		display: block;
		color: rgba(255, 255, 255, 1);
	}
	.fixed_spacer {
		position: sticky;
		bottom: 0px;
		left: 0px;
		height: 120px;
		background: linear-gradient(180deg, rgba(40, 33, 47, 0) 0%, rgba(0, 0, 0, 1) 79%);
		width: 100%;
	}
	.spacer {
		height: 100px;
		display: block;
	}
</style>
