class Configuration {
  static async get() {
    const response = await fetch('config/config.json');
    return await response.json();
  }
}

export { Configuration };