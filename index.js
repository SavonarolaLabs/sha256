const text = "hello world";

function textToHexEditorFormat(txt) {
	const ROW_WIDTH = 4;
	let result = "";
	let charLine = "";
	let binaryLine = "";

	for (let i = 0; i < txt.length; i++) {
		const char = txt[i];
		const binary = char.charCodeAt(0).toString(2).padStart(8, "0");

		charLine += `${char} `;
		binaryLine += `${binary} `;

		if ((i + 1) % ROW_WIDTH === 0 || i === txt.length - 1) {
			result += `${charLine.padEnd(
				ROW_WIDTH * 2,
				" "
			)} | ${binaryLine.trim()}\n`;
			charLine = "";
			binaryLine = "";
		}
	}

	return result;
}

console.log(textToHexEditorFormat(text));
