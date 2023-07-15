const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Commands = "zrange" | "sismember" | "get" | "smembers";

/**
 *
 *
 * @export
 * @param {Commands} command
 * @param {(...(string | number)[])} args
 */
export async function fetchRediis(
  command: Commands,
  ...args: (string | number)[]
) {
  const url = `${upstashRedisUrl}/${command}/${args.join("/")}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}
