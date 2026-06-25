
import GetAllStartup from '@/components/GetAllStartup';
import { getAllStartups } from '@/lib/server/featuredStartup';
import React from 'react';

const FeaturedStartupPage = async () => {
  const startups = await getAllStartups()
  console.log(startups)
  return (
    <div>
      <h2>Featured Startup page</h2>
      <GetAllStartup startups={startups}></GetAllStartup>
    </div>
  );
};

export default FeaturedStartupPage;
