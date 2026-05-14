class Message {
	static #messages = {};

	static #createUser(userId) {
		if (!this.#messages[userId]) {
			this.#messages[userId] = [];
		}
	}

	static success(userId, msg) {
		this.#createUser(userId);
		this.#messages[userId].push({ tag: "success", message: String(msg), });
	}

	static error(userId, msg) {
		this.#createUser(userId);
		this.#messages[userId].push({ tag: "error", message: String(msg), });
	}

	static warning(userId, msg) {
		this.#createUser(userId);
		this.#messages[userId].push({ tag: "warning", message: String(msg), });
	}

	static getMessages(userId) {
		this.#createUser(userId);
		const temp = [...this.#messages[userId]];
		this.#messages[userId] = [];
		return temp;
	}
}

module.exports = Message;