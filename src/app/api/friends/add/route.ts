import { fetchRediis } from "@/helper/redix";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validate/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

/**
 * @typedef {import("next").NextApiRequest} Request
 *
 * @export
 * @param {Request} req
 * @return {*}
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    const { email: emailToAdd } = addFriendValidator.parse({ email });

    console.log(emailToAdd);

    const idToAdd = (await fetchRediis("get", `user:email:${emailToAdd}`)) as
      | string
      | null;

    if (!idToAdd) {
      return new Response("This person does not exist", { status: 404 });
    }
    // const RESTResponse = await fetch(
    //   `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    //     },
    //     cache: "no-store",
    //   }
    // );

    // const data = (await RESTResponse.json()) as { result: string } | null;
    // if (data === null) {
    //   return new Response("Not Found", { status: 404 });
    // }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (session && idToAdd === session.user.id) {
      return new Response("Bad Request: Cannot add yourself as friend", {
        status: 400,
      });
    }

    /// check if user already added this friend
    const isAlreadyFriendResponse = (await fetchRediis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyFriendResponse) {
      return new Response(
        "Unable to send request as this friend is already added.",
        {
          status: 400,
        }
      );
    }

    /// check if user already added this friend
    const isAlreadyFriends = (await fetchRediis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response("Bad Request: Already added this user", {
        status: 400,
      });
    }

    // Valid request, add friend
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("OK");
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid Request payload", { status: 400 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
