<script>
	let { items = [] } = $props();
</script>

<div class="legend">
	{#each items as item}
		<div class="legend-row">
			<!-- <div class="swatch" style="background-color: {item.color};"></div> -->
			<span class="label" style="background-color: {item.color};">{item.label}</span>
		</div>
	{/each}
</div>

<style>
	.legend {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: clamp(4px, 1.5vw, 10px);
		overflow: hidden;
	}

	.legend-row {
		display: flex;
		align-items: center;
		gap: 3px;
		flex-shrink: 1;
		min-width: 0;
	}

	.swatch {
		width: clamp(10px, 1.5vw, 14px);
		height: clamp(10px, 1.5vw, 14px);
		flex-shrink: 0;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.label {
		font-family: var(--font-mono);
		font-size: clamp(10px, 2.2vw, 15px);
		line-height: 1.3;
		color: var(--textColor);
		letter-spacing: 0em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0px 4px;
		text-shadow:
  -1px -1px 2px rgba(0,0,0,0.3),
   1px -1px 2px rgba(0,0,0,0.3),
  -1px  1px 2px rgba(0,0,0,0.3),
   1px  1px 2px rgba(0,0,0,0.3),
   0 0 8px rgba(0,0,0,0.3);
	}
</style>
