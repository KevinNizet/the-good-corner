import { Layout } from "@/components/Layout";
import { RecentAds } from "@/components/RecentAds";
import { useRouter } from "next/router";

export default function Tags() {
    const router = useRouter();
    const tagId = Number(router.query.id);

    console.log("tagId:", tagId);
    
    return (
    <Layout title="Category">
        <RecentAds tagId={tagId} />
      </Layout>
    )
}