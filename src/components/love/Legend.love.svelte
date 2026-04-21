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
        width: 16px;
        height: 16px;
        border: 1px solid rgba(255,255,255,0.1);
    }

    .label {
        font-family: var(--font-sans);
        font-size: 17px;
        color: var(--textColor);
    }
</style>