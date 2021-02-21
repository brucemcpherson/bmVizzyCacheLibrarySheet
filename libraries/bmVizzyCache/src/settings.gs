const QueryDefinition = {

  gistId: "9daba5fb20a97d020431fe4a114011c7",
  get gistApi() {
    return `https://api.github.com/gists/${this.gistId}`;
  }
};
