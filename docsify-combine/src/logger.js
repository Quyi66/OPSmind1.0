require("colors");

class Logger {
  static success(text) {
    console.log(`[SUCCESS] ${text}`.green);
  }
  static info(text) {
    console.log(`[INFO] ${text}`.blue);
  }
  static warn(text, error) {
    console.warn(`[WARNING] ${text}`.yellow);

    if (error) {
      console.error(JSON.stringify(error, null, 2).yellow);
      console.error("\n");
    }
  }
  static err(text, error) {
    console.error(`[ERROR] ${text}`.red);

    if (error) {
      console.error(error.toString().red);
      console.error("\n");
    }
  }
}

module.exports = Logger;
