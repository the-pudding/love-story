<script>
	let { copy } = $props();

	function convertToHTML(text) {
		if (!text || typeof text !== 'string') return '';

		let finalText = [];
		let inList = false;
		let lines = text.split(/\n/);

		for (let line of lines) {
			// Chart lines: >> title | alt text | svg filename | source | source link (optional) | note (optional)
			if (/^>>\s*/.test(line.trim())) {
				const content = line.trim().replace(/^>>\s*/, '');
				const parts = content.split('|').map(s => s.trim());
				const [title = '', altText = '', svgFile = '', source = '', sourceLink = '', note = ''] = parts;
				if (content.toLowerCase().includes('filler')) {
					finalText.push(`<div class="chartFiller" role="img" aria-label="${title}"><span class="chartFillerLabel">${title}</span></div>`);
				} else {
					const srcAttr = sourceLink
						? `<a href="${sourceLink}" target="_blank" rel="noopener">${source}</a>`
						: source;
					const sourceStr = source
						? `Source: ${srcAttr}${note ? ` | ${note}` : ''}`
						: note || '';
					finalText.push(
						`<div class="chartWrap">` +
						(title ? `<p class="chartTitle">${title}</p>` : '') +
						`<picture>` +
						`<source media="(max-width: 499px)" srcset="assets/love_charts/${svgFile.replace(/\.svg$/i, '')}_mobile.svg">` +
						`<img src="assets/love_charts/${svgFile}.svg" alt="${altText}" class="chartImg">` +
						`</picture>` +
						(sourceStr ? `<p class="chartSource">${sourceStr}</p>` : '') +
						`</div>`
					);
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
		margin: 30px 0 10px 0px;
	}
	:global(.longcopy .chartWrap) {
		margin: 40px 0 40px 0px;
	}
	:global(.chartTitle) {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--chartColor);
		margin: 0 0 8px 0;
	}
	:global(.chartImg) {
		width: 100%;
		height: auto;
		display: block;
	}
	:global(.chartSource) {
		font-family: var(--font-mono);
		font-size: 11px;
		line-height: 15px;
		color: var(--chartColor);
		margin: 12px 0 0;
		font-style: italic;
	}
	:global(.chartSource a) {
		color: rgba(232, 207, 219, 0.55);
		text-decoration: none;
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
