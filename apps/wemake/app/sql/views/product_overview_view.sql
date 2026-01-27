CREATE OR REPLACE VIEW wemake.product_overview_view AS
SELECT
  p.id,
  p.name,
  p.tagline,
  p.description,
  p.how_it_works,
  p.icon,
  p.url,
  p.stats->>'upvotes' AS upvotes,
  p.stats->>'views' AS views,
  p.stats->>'reviews' AS reviews,
  AVG(r.rating) AS average_rating
FROM wemake.products AS p
LEFT JOIN wemake.reviews AS r ON p.id = r.product_id
GROUP BY p.id;
