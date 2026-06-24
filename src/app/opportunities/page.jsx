import FeaturedOpportunityClient from "@/components/FeaturedOpportunityClient";
import { getAllOpportunities } from "@/lib/server/featuredStartup";

const FeaturedOpportunity = async ({ searchParams }) => {
  const params = await searchParams;

  const data = await getAllOpportunities(params?.page);

  return (
    <FeaturedOpportunityClient
      opportunities={data?.opportunities || []}
      totalPages={data?.totalPages || 1}
      currentPage={data?.currentPage || 1}
    />
  );
};

export default FeaturedOpportunity;