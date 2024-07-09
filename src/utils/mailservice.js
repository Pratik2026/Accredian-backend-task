import { google } from "googleapis";
import fs from "fs";
import readline from "readline";

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const TOKEN_PATH = "token.json";

function loadCredentials() {
  const content = fs.readFileSync("credentials.json");
  return JSON.parse(content);
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  } else {
    getAccessToken(oAuth2Client, callback);
  }
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      callback(oAuth2Client);
    });
  });
}

function sendEmail(auth, email) {
  const gmail = google.gmail({ version: "v1", auth });
  const encodedMessage = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  gmail.users.messages.send(
    {
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    },
    (err, res) => {
      if (err) {
        console.error("Error sending email:", err);
        return;
      }
      console.log("Email sent:", res.data);
    }
  );
}

export function sendReferralEmail(to, subject, message) {
  const credentials = loadCredentials();
  authorize(credentials, (auth) => {
    const email = [
      `To: ${to}`,
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${subject}`,
      "",
      message,
    ].join("\n");

    sendEmail(auth, email);
  });
}
