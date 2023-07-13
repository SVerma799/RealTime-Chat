import Image from "next/image";
import Button from "./components/ui/Button";

export default function Home() {
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
