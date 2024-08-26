const text =
	"hello world, this is a longer text that will exceed 512 bits to ensure proper handling.";

function textToHexEditorFormat(txt) {
	const ROW_WIDTH = 4;
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

function calculateConstants() {
	const primes = [
		2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
		71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139,
		149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223,
		227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293,
		307, 311, 313,
	];

	const h = primes
		.slice(0, 8)
		.map((p) => Math.floor((Math.sqrt(p) % 1) * 2 ** 32).toString(16));

	const k = primes
		.slice(0, 64)
		.map((p) => Math.floor((Math.cbrt(p) % 1) * 2 ** 32).toString(16));

	return { h, k };
}

console.log(textToHexEditorFormat(text));

const { h, k } = calculateConstants();

console.log(
	"\nh Constants:\n" +
		h
			.map((val, i) => `0x${val}`)
			.reduce((acc, val, i) => {
				return acc + val + (i % 4 === 3 ? "\n" : "\t");
			}, "")
);

console.log(
	"\nk Constants:\n" +
		k
			.map((val, i) => `0x${val}`)
			.reduce((acc, val, i) => {
				return acc + val + (i % 4 === 3 ? "\n" : "\t");
			}, "")
);
