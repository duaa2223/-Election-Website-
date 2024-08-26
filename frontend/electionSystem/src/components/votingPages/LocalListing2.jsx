import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LocalListing2() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState({});

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4026/api/local-listings2/struggling-members2"
      );
      setListings(response.data);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while fetching data");
      setLoading(false);
      console.error("Error fetching listings:", err);
    }
  };

  const handleListingToggle = (listingName) => {
    setSelectedListing(listingName === selectedListing ? null : listingName);
  };

  const handleMemberToggle = (listingName, memberName) => {
    setSelectedMembers((prev) => ({
      ...prev,
      [`${listingName}-${memberName}`]: !prev[`${listingName}-${memberName}`],
    }));
  };

  const handleVote = async () => {
    if (!selectedListing) {
      toast.error("Please select a listing to vote for.");
      return;
    }

    const selectedMembersList = Object.entries(selectedMembers)
      .filter(([key, value]) => value && key.startsWith(selectedListing))
      .map(([key]) => key.split("-")[1]);

    if (selectedMembersList.length === 0) {
      toast.error("Please select at least one member to vote for.");
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to change your vote after submitting.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "Cancel",
    });

    if (isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:4026/api/submit-vote",
          {
            selectedListing,
            selectedMembers: selectedMembersList,
          }
        );

        if (response.data.success) {
          toast.success("Your vote has been submitted successfully!");
          // Reset selections
          setSelectedListing(null);
          setSelectedMembers({});
          // Refresh listings
          fetchListings();
        } else {
          toast.error("Failed to submit vote. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting vote:", error);
        toast.error(
          "An error occurred while submitting your vote. Please try again."
        );
      }
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center">
        Local Listings with Struggling Members
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id={`listing-${index}`}
                checked={selectedListing === listing.listingName}
                onChange={() => handleListingToggle(listing.listingName)}
                className="mr-2"
              />
              <h2 className="text-xl font-semibold">{listing.listingName}</h2>
            </div>
            <h3 className="mb-2 text-lg font-medium">Struggling Members:</h3>
            <ul>
              {listing.strugglingMembers.map((member, memberIndex) => (
                <li key={memberIndex} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`member-${index}-${memberIndex}`}
                    checked={
                      selectedMembers[`${listing.listingName}-${member}`] ||
                      false
                    }
                    onChange={() =>
                      handleMemberToggle(listing.listingName, member)
                    }
                    className="mr-2"
                    disabled={selectedListing !== listing.listingName}
                  />
                  <label htmlFor={`member-${index}-${memberIndex}`}>
                    {member}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleVote}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Submit Vote
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LocalListing2;
