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
        gap: 8px;
    }
    
    .legend-row {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .swatch {
        width: 16px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid rgba(0,0,0,0.1);
    }

    .label {
        font-family: sans-serif;
        font-size: 13px;
        color: #333;
    }
</style>