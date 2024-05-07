import { datetime } from "https://deno.land/x/ptera@v1.0.2/mod.ts";

const MISSKEY_HOSTNAME = Deno.env.get("MISSKEY_HOSTNAME");
const MISSKEY_TOKEN = Deno.env.get("MISSKEY_TOKEN");
const NAME = Deno.env.get("NAME");
const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE") ?? "0 * * * *";

type NameData = {
  count: number;
  latest: string;
};

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
    headers: {
      "Content-Type": "application/json",
    },
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

const kv = await Deno.openKv();

async function incrementCount(name: string) {
  const key = ["name", name];
  const nameData = await kv.get<NameData>(key);
  const count = (nameData.value?.count ?? 0) + 1;
  const latest = datetime().toZonedTime("Asia/Tokyo").format(
    "YYYY-MM-dd HH:mm",
  );
  kv.set(key, { count, latest });
}

Deno.cron("change name", CRON_SCHEDULE, () => {
  if (!NAME || !MISSKEY_HOSTNAME || !MISSKEY_TOKEN) return;
  const name = randomStringFromSet(NAME);
  changeName(name);
  incrementCount(name);
});

Deno.serve(async () => {
  const list = kv.list<NameData>({ prefix: ["name"] });
  const nameDataEntries = await Array.fromAsync(list);
  nameDataEntries.sort((a, b) => b.value.count - a.value.count);
  const body = {
    total: nameDataEntries.length,
    names: nameDataEntries.map((nameDataEntry) => {
      return {
        name: nameDataEntry.key.at(-1),
        ...nameDataEntry.value,
      };
    }),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
});
