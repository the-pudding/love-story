<script>
	let { copy } = $props();

	function convertToHTML(text) {
		if (!text || typeof text !== 'string') return '';

		let finalText = [];
		let inList = false;
		let lines = text.split(/\n/);

		for (let line of lines) {
			// Image lines: >> alt text | svgName  (or "filler")
			if (/^>>\s*/.test(line.trim())) {
				const content = line.trim().replace(/^>>\s*/, '');
				const pipeIdx = content.indexOf('|');
				const altText = (pipeIdx !== -1 ? content.slice(0, pipeIdx) : content).trim();
				const imageName = (pipeIdx !== -1 ? content.slice(pipeIdx + 1) : '').trim();
				if (!imageName || imageName.toLowerCase() === 'filler') {
					finalText.push(`<div class="chartFiller" role="img" aria-label="${altText}"><span class="chartFillerLabel">${altText}</span></div>`);
				} else {
					finalText.push(`<div class="chartWrap"><picture>` +
						`<source media="(max-width: 620px)" srcset="/charts/${imageName}-mobile.svg">` +
						`<img src="/charts/${imageName}-desktop.svg" alt="${altText}" class="chartImg">` +
						`</picture></div>`);
				}
				continue;
			}

			// Markdown links [text](url)
			line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

			// Bold **text**
			line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

			// Italic *text*
			line = line.replace(/\*([^*]+)\*/g, '<em>$1</em>');

			// Bullet points
			if (/^\s*[-*]\s+/.test(line)) {
				if (!inList) {
					finalText.push('<ul>');
					inList = true;
				}
				line = line.replace(/^\s*[-*]\s+(.*)/, '<li>$1</li>');
				finalText.push(line);
				continue;
			} else if (inList) {
				finalText.push('</ul>');
				inList = false;
			}

			// Blockquotes
			if (/^>\s+/.test(line)) {
				line = line.replace(/^>\s+(.*)/, '<blockquote>$1</blockquote>');
			}

			// Only add lines with content
			if (/[A-Za-z0-9]/.test(line)) {
				finalText.push(line);
			}
		}

		if (inList) finalText.push('</ul>');

		return wrapInPTags(finalText);
	}

	function wrapInPTags(arr) {
		return arr
			.map(item => {
				if (/<\/?(ul|li|blockquote|div)(\s|>|$)/.test(item)) return item;
				if (item.trim()) return `<p>${item}</p>`;
				return '';
			})
			.filter(Boolean)
			.join('');
	}
</script>

<div class="textContainer">
	{@html convertToHTML(copy)}
</div>

<style>
	:global(.chartFiller) {
		width: 600px;
		max-width: 100%;
		height: 280px;
		background: rgba(130, 108, 145, 0.25);
		border: 1px solid rgba(130, 108, 145, 0.5);
		margin: 12px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	:global(.chartFillerLabel) {
		color: rgba(130, 108, 145, 0.9);
		font-size: 13px;
		font-style: italic;
		text-align: center;
		padding: 0 16px;
	}
	:global(.chartWrap) {
		margin: 12px 0;
	}
	:global(.chartImg) {
		width: 600px;
		max-width: 100%;
		height: auto;
		display: block;
	}
	@media (max-width: 620px) {
		:global(.chartFiller) {
			width: 400px;
			height: 300px;
		}
		:global(.chartImg) {
			width: 400px;
		}
	}
</style>