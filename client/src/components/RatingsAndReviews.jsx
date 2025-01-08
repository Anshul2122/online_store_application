
const reviewsData = {
  overallRating: 4.2,
  totalRatings: 121106,
  totalReviews: 5412,
  ratingBreakdown: {
    5: 63555,
    4: 32142,
    3: 14093,
    2: 4975,
    1: 6341,
  },
  metrics: [
    { name: "Quality", value: 4.0 },
    { name: "Design & Finish", value: 4.0 },
    { name: "Size", value: 3.9 },
    { name: "Air Tight", value: 3.8 },
  ],
  review: [
    {
      image: "img",
      comment: "this was good product",
      rating: "5",
      user: "anshul",
    },
    {
      image: "",
      comment: "dajfniaunwe",
      rating: "1",
      user: "anl",
    },
  ],
  additionalImages: 612,
};

const RatingsAndReviews = () => {
  const {
    overallRating,
    totalRatings,
    totalReviews,
    ratingBreakdown,
    metrics,
    review,
    additionalImages,
  } = reviewsData;

  return (
    <div className=" w-1/2 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      {/* Overall Rating and Reviews */}
      <div className="flex justify-between items-start mb-6 ">
        <div>
          <h2 className="text-4xl font-semibold">{overallRating}★</h2>
          <p className="text-gray-600">
            {totalRatings.toLocaleString()} Ratings &{" "}
            {totalReviews.toLocaleString()} Reviews
          </p>
        </div>
        <button className="px-4 py-2 bg-gray-400 hover:bg-gray-200 rounded-md">
          Rate Product
        </button>
      </div>

      {/* Star Rating Breakdown */}
      <div className="mb-6">
        {Object.entries(ratingBreakdown).map(([star, count]) => (
          <div key={star} className="flex items-center gap-4 mb-2">
            <span className="w-10 text-right text-gray-600">{star} ★</span>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${(count / totalRatings) * 100}%`,
                }}
              ></div>
            </div>
            <span className="w-12 text-gray-600">{count.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Metrics Section */}
      <div className="flex justify-between mb-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="text-center">
            <div className="relative w-12 h-12 mx-auto mb-2">
              <svg className="w-full h-full text-gray-300">
                <circle
                  cx="50%"
                  cy="50%"
                  r="18"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="18"
                  strokeWidth="4"
                  fill="none"
                  className="text-green-500"
                  strokeDasharray="113"
                  strokeDashoffset={`${113 - (metric.value / 5) * 113}`} // Adjust for circular progress
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-semibold text-sm">
                {metric.value.toFixed(1)}
              </div>
            </div>
            <p className="text-sm text-gray-600">{metric.name}</p>
          </div>
        ))}
      </div>

      {/* Review Images */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {review.slice(0, 6).map((reviewItem, index) => (
          <div key={index}>
            {reviewItem.image /* Only render the image if it exists */ && (
              <img
                src={reviewItem.image}
                alt={`Review ${index}`}
                className="w-16 h-16 rounded-md object-cover"
              />
            )}
            {/* Displaying the rating */}
          </div>
        ))}
        {additionalImages > 0 && (
          <div className="w-16 h-16 flex items-center justify-center bg-gray-400 rounded-md">
            +{additionalImages}
          </div>
        )}
      </div>
      {review.slice(0, 6).map((reviewItem, index) => (
        <div key={index} className="my-2 border-b-2 p-1">
          <section className="flex gap-2 justify-between">
            <section className="flex gap-3">
              <p className="bg-green-500 text-white w-fit rounded-sm">
                {reviewItem.rating} ★
              </p>
              <p>{reviewItem.comment}</p>
            </section>
            <span className="flex justify-end text-gray-500 text-sm font-semibold mt-1">
              {" "}
              {reviewItem.user}
            </span>
          </section>
          {/* Displaying the rating */}
        </div>
      ))}
    </div>
  );
};

export default RatingsAndReviews;
