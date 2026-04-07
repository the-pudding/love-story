<script>
    // 1. Added 'color' to the props
    // 2. Removed maxMetric and metricReverse as they are no longer needed here
    let { 
        p, 
        x = 0, 
        y = 0, 
        personSize, 
        sortValue = null, 
        metricValue = null, 
        color = '#fc8d59' // Default fallback/bad color
    } = $props();

    const fillPercent = 100;
</script>

<div class="person" style="transform: translate({x}px, {y}px); width: {personSize}px; height: {personSize}px;">
    <div class="fill" style="height: {fillPercent}%; background: {color};"></div>
    
    <div class="value">{metricValue !== null ? metricValue : ''}</div>
</div>

<style>
.person {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    border: 1px solid #000;
    background: #eee;
    /* This transition keeps your smooth sliding animations! */
    transition: transform 1000ms cubic-bezier(0.250, 0.100, 0.250, 1.000);
}

.fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    /* Smooth background transitions when the color prop changes */
    transition: height 500ms ease-out, background 500ms ease-out;
}

.value {
    position: absolute;
    z-index: 1000;
    /* Optional: Center the text in the box */
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-family: sans-serif;
    color: #000; /* You can change this or mix-blend-mode if contrast is low */
}
</style>