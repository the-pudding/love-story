<script>
	import { varDescriptions } from "$utils/varDescriptions.js";

	let { data, lookup, clickedPersonId, onclose } = $props();

	const waves = ["d", "w1", "w2", "w3"];
	const waveLabels = {
		d: "Demographics",
		w1: "Wave 1 (2017)",
		w2: "Wave 2 (2020)",
		w3: "Wave 3 (2022)"
	};

	function getWaveRows(person, wave) {
		if (!person?.[wave]) return [];
		return (lookup[wave] ?? [])
			.map((varName, i) => ({
				label: varName ? (varDescriptions[varName] ?? varName) : null,
				value: person[wave][i]
			}))
			.filter((row) => row.label && row.value !== null && row.value !== undefined);
	}

	const person = $derived(clickedPersonId != null ? data.find((p) => p.id === clickedPersonId) ?? null : null);
	const open = $derived(clickedPersonId != null);
</script>

<div class="shelf" class:shelfopen={open}>
	<button class="detailsClose" onclick={onclose}>Click to close</button>
	<div class="modalData">
		{#if person}
			<div class="personId">Person #{person.id}</div>
			{#each waves as wave}
				{@const rows = getWaveRows(person, wave)}
				{#if rows.length > 0}
					<div class="modalHed">{waveLabels[wave]}</div>
					{#each rows as row}
						<div class="modalItem">
							<div class="modalItemHed">{row.label}</div>
							<div class="modalItemValue">{row.value}</div>
						</div>
					{/each}
				{/if}
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
		left: -300px;
		top: 0px;
		width: 300px;
		height: 100%;
		background: black;
		z-index: 999999;
		transition: left 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
		overflow-y: scroll;
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
		background: var(--color-pinkpurple, #c084fc);
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
		font-size: 0.8rem;
		line-height: 0.9rem;
	}
	.personId {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.4);
		margin-bottom: 10px;
	}
	.modalHed {
		font-size: 0.9rem;
		margin: 20px 0 10px;
		font-weight: bold;
		color: white;
	}
	.modalItem {
		margin-bottom: 10px;
	}
	.modalItemHed {
		color: white;
	}
	.modalItemValue {
		color: rgba(255, 255, 255, 0.7);
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
