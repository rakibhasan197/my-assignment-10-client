import OpportunityCard from '@/components/OpportunityCard';
import { getAllOpportunities } from '@/lib/server/featuredStartup';
import React from 'react';

const FeaturedOpportunity = async () => {
    const opportunities = await getAllOpportunities()
  
  return (
    <div className='my-10 container mx-auto'>
      <h2 className='text-3xl text-center my-5 font-bold'>Featured All Opportunity</h2>
       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities?.map((opportunity) => (
            <OpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
            />
          ))}
        </div>
    </div>
  );
};

export default FeaturedOpportunity;