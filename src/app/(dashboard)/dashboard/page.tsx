import { authOptions } from "@/lib/auth";
import { FC } from "react";
import { getServerSession } from "next-auth";

interface DashboardPropsProps {}

const DashboardProps: FC<DashboardPropsProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  return <pre>{JSON.stringify(session)}</pre>;
};

export default DashboardProps;
