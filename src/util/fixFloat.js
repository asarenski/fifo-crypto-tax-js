const fixFloat = float => parseFloat(parseFloat(float).toPrecision(15));
export default fixFloat;