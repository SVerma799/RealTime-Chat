import Image from "next/image";
import { db } from "@/lib/db";
import Button from "@/components/ui/Button";

export default async function Home() {
  await db.set("Hello from the server!", "hello");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Button variant="default" size="default">
        Default
      </Button>
      <Button variant="ghost" size="default">
        Ghost
      </Button>
      <Button variant="default" size="sm">
        Default
      </Button>
      <Button variant="ghost" size="sm">
        Ghost
      </Button>
    </div>
  );
}
