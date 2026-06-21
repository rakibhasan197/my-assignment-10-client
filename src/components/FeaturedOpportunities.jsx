
import { getFeaturedOpportunities } from "@/lib/server/featuredStartup";
import OpportunityCard from "./OpportunityCard";

const FeaturedOpportunities = async () => {
  const opportunities = await getFeaturedOpportunities();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">
            Featured Opportunities
          </h2>
          <p className="text-gray-500 mt-2">
            Find your dream role in startups
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities?.map((op) => (
            <OpportunityCard key={op._id} opportunity={op} />
          ))}
        </div>
         
      </div>
    </section>
  );
};

export default FeaturedOpportunities;