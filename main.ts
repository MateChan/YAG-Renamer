const MISSKEY_HOSTNAME = Deno.env.get("MISSKEY_HOSTNAME");
const MISSKEY_TOKEN = Deno.env.get("MISSKEY_TOKEN");
const NAME = Deno.env.get("NAME");
const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE") ?? "0 * * * *";

console.log({
  MISSKEY_HOSTNAME,
  MISSKEY_TOKEN: "SET",
  NAME,
  CRON_SCHEDULE,
});

function randomChar(text: string): string {
  return text.charAt(Math.floor(text.length * Math.random()));
}

function randomStringFromSet(text: string): string {
  return [...new Array(text.length)].map((_) => {
    return randomChar(text);
  }).join("");
}

function changeName(name: string) {
  const base = `https://${MISSKEY_HOSTNAME}`;
  const url = new URL("api/i/update", base);
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ name, i: MISSKEY_TOKEN }),
  }).then((res) => {
    if (res.ok) {
      console.log({ name });
    } else {
      console.log("request failed");
      console.log(res);
    }
  });
}

Deno.cron("change name", CRON_SCHEDULE, () => {
  if (!NAME || !MISSKEY_HOSTNAME || !MISSKEY_TOKEN) return;
  const name = randomStringFromSet(NAME);
  changeName(name);
});
