import { redirect } from "next/navigation";

// The novel reader is now embedded at the bottom of the homepage
export default function NovelPage() {
  redirect("/#novel");
}
