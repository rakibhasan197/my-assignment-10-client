import { getFeaturedStartups } from "@/lib/server/featuredStartup";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import ViewAllButton from "./ViewAllButton";

const FeaturedStartups = async () => {
  const startups = await getFeaturedStartups();
  console.log(startups)

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Featured Startups</h2>
          <p className="text-gray-500 mt-2">
            Discover the latest startup teams looking for collaborators.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {startups?.map((startup) => (
           <div
  key={startup._id}
  className="border rounded-xl p-5 shadow-sm hover:shadow-lg transition bg-white"
>
  <Image
    src={startup.logo}
    alt={startup.startup_name}
    height={300}
    width={300}
    className="w-full h-48 object-cover rounded-lg"
  />

  <h3 className="text-xl font-semibold mt-4">
    {startup.startup_name}
  </h3>

  <p className="text-sm text-gray-500 mt-2">
    <span className="font-medium text-gray-700">Industry:</span>{" "}
    {startup.industry}
  </p>

  <p className="text-sm text-gray-500">
    <span className="font-medium text-gray-700">Founder:</span>{" "}
    {startup.founder_email}
  </p>

  <p className="mt-3 text-sm text-gray-600 line-clamp-3">
    {startup.description}
  </p>

  <Link
    href={`/startup/${startup._id}`}
    className="mt-4 block text-center bg-blue-500 text-white py-2 rounded-md hover:bg-gray-800 transition"
  >
    View Details
  </Link>
</div>
          ))}
        </div>

        {/* View All Button */}
       <ViewAllButton></ViewAllButton>
      </div>
    </section>
  );
};

export default FeaturedStartups;