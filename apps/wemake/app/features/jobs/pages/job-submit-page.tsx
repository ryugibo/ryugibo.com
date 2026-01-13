export const meta = () => {
  return [{ title: "Post a Job | wemake" }, { name: "description", content: "Post a job" }];
};

export default function JobSubmitPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Post a Job</h1>
      <p className="text-muted-foreground">Reach the best developers.</p>
    </div>
  );
}
