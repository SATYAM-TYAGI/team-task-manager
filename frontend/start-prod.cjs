// simple script so railway PORT works on windows too (not only linux $PORT)
const { spawn } = require("child_process");
const path = require("path");

const port = process.env.PORT || 3000;
const serveCmd = path.join(__dirname, "node_modules", ".bin", "serve");

// paths with spaces break on windows if we dont use shell + quotes
if (process.platform === "win32") {
  const quoted = `"${serveCmd}.cmd"`;
  spawn(`${quoted} -s dist -l ${port}`, {
    stdio: "inherit",
    cwd: __dirname,
    shell: true,
  }).on("exit", (code) => process.exit(code ?? 0));
} else {
  spawn(serveCmd, ["-s", "dist", "-l", String(port)], {
    stdio: "inherit",
    cwd: __dirname,
  }).on("exit", (code) => process.exit(code ?? 0));
}
