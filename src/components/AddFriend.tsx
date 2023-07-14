import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validate/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendProps {}

const AddFriend: FC<AddFriendProps> = ({}) => {
  // making formData of addFriendValidator Model
  type FormData = z.infer<typeof addFriendValidator>;
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });
  const addFriendHandler = async (email: string) => {
    try {
      /// take care of the syntax here
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", { email: validatedEmail.email });

      setShowSuccessState(true);
    } catch (err) {
      // if error is occured.
      if (err instanceof z.ZodError) {
        // if error is occured.
        setError("email", {
          message: err.message,
        });

        return;
      }
      if (err instanceof AxiosError) {
        // if error is occured.
        setError("email", {
          message: err.response?.data,
        });
        return;
      }

      setError("email", {
        message: "Something went wrong",
      });
    }
  };

  const submitAction = (data: FormData) => {
    addFriendHandler(data.email);
  };

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(submitAction)}>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add Friend via Email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
          {...register("email")}
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-600">Friend Added</p>
      )}
    </form>
  );
};

export default AddFriend;
