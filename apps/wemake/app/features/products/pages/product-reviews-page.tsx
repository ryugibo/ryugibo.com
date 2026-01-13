export const meta = () => {
  return [{ title: "Product Reviews" }, { name: "description", content: "Product Reviews" }];
};

export default function ProductReviewsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold">Product Reviews Page</h1>
    </div>
  );
}
