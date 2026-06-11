## 🚀 How to Run the App (macOS & Windows)

This project is set up as a monorepo. Follow these steps to install and start the application locally.

### 📋 Prerequisites
Make sure you have **Node.js** and **npm** installed on your machine:
* **macOS**: Install via [Node.js Official Installer](https://nodejs.org/).
* **Windows**: Install via [Node.js Official Installer](https://nodejs.org/) (ensure you check the box to add Node to PATH during installation).

Verify they are installed by running:
```bash
node -v
npm -v

## 🛠️ Setup & Running

### 1. Install Dependencies
Open your terminal (macOS) or Command Prompt/PowerShell (Windows) in the root of the **RozzaExpress** directory and run:

> **TERMINAL**
> ```bash
> npm install
> ```

---

### 2. Build the Shared Package
Compile the shared validation library so the frontends and backend can access the Zod schemas:

> **TERMINAL**
> ```bash
> npm run build:shared
> ```

---

### 3. Start the Backend Server (Terminal Tab 1)
Start the Express API server:

> **TERMINAL (TAB 1)**
> ```bash
> npm run dev:server
> ```
> *(The server will run on http://localhost:4000)*

---

### 4. Start the Student Application (Terminal Tab 2)
Open a new terminal window/tab, navigate back to the root directory, and run:

> **NEW TERMINAL (TAB 2)**
> ```bash
> npm run dev:user
> ```
> *(The student app will spin up on http://localhost:5173)*

---

## 🔑 Test Credentials

Use the following inputs on the Login screen to pass Zod schema validations:

### 📋 Email:
```text
22235@rosmini.school.nz
