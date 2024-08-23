const text =
	"hello world, this is a longer text that will exceed 512 bits to ensure proper handling.";

function textToHexEditorFormat(txt) {
	const ROW_WIDTH = 8;
	const BLOCK_SIZE = 64;
	const PADDING_BYTE = {
		char: ".",
		hex: "\x1b[32m80\x1b[0m",
		binary: "10000000",
	};
	let result = "";

	let dataArray = [...txt].map((char) => {
		const charCode = char.charCodeAt(0);
		return {
			char: charCode >= 32 && charCode <= 126 ? char : ".",
			hex: charCode.toString(16).padStart(2, "0"),
			binary: charCode.toString(2).padStart(8, "0"),
		};
	});

	const totalBitsLength = txt.length * 8;

	dataArray.push(PADDING_BYTE);

	while (dataArray.length % BLOCK_SIZE !== BLOCK_SIZE - 8) {
		dataArray.push({
			char: ".",
			hex: "00",
			binary: "00000000",
		});
	}

	const lengthHex = totalBitsLength
		.toString(16)
		.padStart(16, "0")
		.match(/.{2}/g);
	const lengthBinary = totalBitsLength
		.toString(2)
		.padStart(64, "0")
		.match(/.{8}/g);

	lengthHex.forEach((hex, i) =>
		dataArray.push({
			char:
				parseInt(hex, 16) >= 32 && parseInt(hex, 16) <= 126
					? String.fromCharCode(parseInt(hex, 16))
					: ".",
			hex: `\x1b[33m${hex}\x1b[0m`,
			binary: lengthBinary[i],
		})
	);

	for (
		let blockStart = 0;
		blockStart < dataArray.length;
		blockStart += BLOCK_SIZE
	) {
		const block = dataArray.slice(blockStart, blockStart + BLOCK_SIZE);
		for (let i = 0; i < block.length; i += ROW_WIDTH) {
			const chunk = block.slice(i, i + ROW_WIDTH);
			const charLine = chunk
				.map((data) => data.char)
				.join("")
				.padEnd(ROW_WIDTH, " ");
			const hasColor = chunk.some((data) => data.hex.includes("\x1b"));
			const hexLine =
				chunk.map((data) => data.hex).join(" ") + (hasColor ? " " : "");
			const binaryLine = chunk.map((data) => data.binary).join(" ");

			result += `${charLine} | ${hexLine.padEnd(
				ROW_WIDTH * 3 + (hasColor ? 1 : 0),
				" "
			)} | ${binaryLine}\n`;
		}
		result += "\n";
	}

	return result.trim();
}

console.log(textToHexEditorFormat(text));
