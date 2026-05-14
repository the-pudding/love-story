<script>
    let { items = [] } = $props();
</script>

<div class="legend">
    {#each items as item}
        <div class="legend-row">
            <div class="swatch" style="background-color: {item.color};"></div>
            <span class="label">{item.label}</span>
        </div>
    {/each}
</div>

<style>
    .legend {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
    
    .legend-row {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .swatch {
        width: 13px;
        height: 13px;
        border: 1px solid rgba(255,255,255,0.1);
    }

    .label {
        font-family: var(--font-mono);
        font-size: 15px;
        color: var(--textColor);
        letter-spacing: -0.03em;
    }
</style>