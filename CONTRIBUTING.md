# 🤝 Contributing to focus-ninja

Thanks for your interest in improving `focus-ninja`! 🚀  
We welcome all kinds of contributions — bug reports, feature suggestions, documentation tweaks, or script improvements.

---

## 🧠 How You Can Help

- 🐞 Report bugs or unexpected behavior
- 💡 Suggest new features or improvements
- 🛠 Improve or refactor existing scripts
- 📚 Fix typos or clarify documentation
- 🔍 Help triage issues or review pull requests

---

## ✅ Before Opening a Pull Request

Please make sure to:

- [ ] Run `npm run build` and ensure no errors
- [ ] Run `npm test` and make sure all tests pass
- [ ] Run the linter: `npm run lint`
- [ ] Keep your changes focused — one topic per PR is ideal
- [ ] Add or update tests if applicable
- [ ] Update documentation or examples if the public API changes
- [ ] Clearly describe _what_ you changed and _why_

---

## 🧪 Testing

This project uses [Jest](https://jestjs.io) for testing, with full support for TypeScript.

### ✅ Run all tests with coverage

Use this in the terminal:

```sh
# First time: Install dependencies
npm i
```

```sh
npm run test
```

This will

- remove the lib folder and compile the code
- run eslint
- run depcheck to check for any unused dependencies
- run all tests _with coverage_.

---

### 🐞 Debug tests in VS Code

Press F5 to run all tests with debugging and _no coverage_ for better speed.

If you want to debug a single tests or test suites, modify the args in [launch.json](.vscode/launch.json):

```json
"args": ["--runInBand", "--config", "jest.config.js", "--no-cache", "--testNamePattern", "put test name here"]
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as this project — [MIT](LICENSE).

---

## 💬 Questions?

Open an issue — we’re happy to help!
