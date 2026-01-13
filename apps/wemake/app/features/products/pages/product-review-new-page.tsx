export const meta = () => {
  return [{ title: "New Review" }, { name: "description", content: "Write a new review" }];
};

export default function ProductReviewNewPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold">New Review Page</h1>
    </div>
  );
}
