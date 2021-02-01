/**
 * makes base64 strings to avoid invalid string stuff withkv stores
 * @param {object} obj object to compress
 * @return {string} as base64
 */

const Compress = (() => {

  /**
   *
   * @param {string} str b64 string to decompress
   * @return {object} original object
   */
  const decompress = (str) => {
    return JSON.parse(decompressString(str));
  };
  /**
   *
   * @param {string} str b64 string to decompress
   * @return {string}
   */
  const decompressString = (str) => {
    const lz = LZString;
    return lz.decompressFromBase64(str);
  };
  return {
    decompress
  };
})();
