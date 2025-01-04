# Rarely

Welcome to the Rarely project! This is a Next.js application designed for managing diary entries.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up the project, you'll need to have [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) installed. Follow these steps:

1. **Install NVM**:
   Run the following command to install NVM:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   ```

2. **Load NVM**:
   Add the following lines to your shell configuration file (e.g., `~/.bashrc`, `~/.zshrc`, or `~/.profile`):

   ```bash
   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
   ```

   Then, run:

   ```bash
   source ~/.bashrc  # or source ~/.zshrc or source ~/.profile, depending on your shell
   ```

3. **Install Node.js**:
   Use NVM to install Node.js version 20:

   ```bash
   nvm install 20
   ```

4. **Install Dependencies**:
   Navigate to the project directory (/my-app) and install the required npm packages:

   ```bash
   npm install
   ```

## Usage

To start the development server, run:
 ```bash
   npm run dev
   ```



You can then access the application at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.