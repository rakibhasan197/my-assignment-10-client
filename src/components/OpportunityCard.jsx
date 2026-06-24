import Image from "next/image";
import Link from "next/link";

const OpportunityCard = ({ opportunity }) => {
  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition bg-white">

      {/* Image */}
      <div className="relative w-full h-40">
        <Image
          src={opportunity.image}
          alt={opportunity.role_title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="text-xl font-bold text-gray-800">
          {opportunity.role_title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Startup:{" "}
          <span className="font-medium text-gray-700">
            {opportunity.startup_name}
          </span>
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Skills:{" "}
          <span className="text-gray-700">
            {opportunity.required_skills}
          </span>
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Work Type: {opportunity.work_type}
        </p>

        <p className="text-sm text-red-500 font-medium mt-1">
          Deadline: {opportunity.deadline}
        </p>

        <Link
          href={`/opportunities/${opportunity._id}`}
          className="mt-4 inline-block w-full text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition"
        >
          View Details
        </Link>

      </div>
    </div>
  );
};

export default OpportunityCard;