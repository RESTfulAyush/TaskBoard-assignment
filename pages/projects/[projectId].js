import { useRouter } from "next/router";
import Task from "@/components/Task";

export default function ProjectDetailPage() {
  const router = useRouter();
  const { projectId } = router.query;

  if (!projectId) return <p>Loading...</p>;

  return <Task projectId={projectId} />;
}
