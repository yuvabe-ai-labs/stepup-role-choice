import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ListTodo,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Offer } from "@/types/myOffers.types";
import { useUpdateOfferDecision } from "@/hooks/useMyOffers";
import { useState } from "react";

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const updateDecision = useUpdateOfferDecision();
  const navigate = useNavigate();

  const formattedAppliedDate = offer.applied_date
    ? format(new Date(offer.applied_date), "MMM dd, yyyy")
    : "Unknown";

  const handleDecision = async (decision: "accepted" | "rejected") => {
    setIsProcessing(true);
    try {
      await updateDecision.mutateAsync({
        applicationId: offer.application_id,
        decision,
      });
    } catch (error) {
      console.error("Error updating decision:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = offer.offer_decision === "pending";
  const isAccepted = offer.offer_decision === "accepted";

  const handleViewTasks = () => {
    navigate(`/my-tasks/${offer.application_id}`);
  };

  return (
    <div className="w-full bg-white border border-gray-300 shadow rounded-3xl px-7 py-6 mb-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <img
            src={offer.internship.company_profile.unit.avatar_url}
            alt={offer.internship.company_profile.unit.unit_name}
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="font-semibold text-xl text-gray-800">
              {offer.internship.company_profile.unit.unit_name}
            </h2>
            <p className="text-gray-600 text-base">{offer.internship.title}</p>
          </div>
        </div>

        {/* View Tasks Button for Accepted Offers */}
        {isAccepted && (
          <button
            onClick={handleViewTasks}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors"
          >
            <ListTodo size={18} />
            View Tasks
          </button>
        )}
      </div>

      {/* Details */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={18} className="text-gray-500" />
          <span className="text-sm">
            <span className="font-medium">Duration:</span>{" "}
            {offer.internship.duration}
          </span>
        </div>

        <div className="text-sm text-gray-600 leading-relaxed mt-3">
          <p className="line-clamp-2">{offer.internship.description}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {isPending && (
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={() => handleDecision("rejected")}
            disabled={isProcessing}
            className="px-4 py-2 border-[1.5px] border-red-500 text-red-600 text-sm font-medium rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Reject Internship"}
          </button>

          <button
            onClick={() => handleDecision("accepted")}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Accept Internship"}
          </button>
        </div>
      )}

      {/* Status Message */}
      {!isPending && (
        <div className="mt-4 text-center py-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {offer.offer_decision === "accepted"
              ? "You have accepted this internship offer"
              : "You have declined this internship offer"}
          </p>
        </div>
      )}
    </div>
  );
}