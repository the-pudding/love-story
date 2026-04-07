<script>
	let { copy } = $props();

	function convertToHTML(text) {
		if (!text || typeof text !== 'string') return '';

		let finalText = [];
		let inList = false;
		let lines = text.split(/\n/);

		for (let line of lines) {
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