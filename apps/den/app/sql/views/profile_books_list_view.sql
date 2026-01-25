CREATE OR REPLACE VIEW den.profile_books_list_view AS
SELECT
    pb.*,
    b.isbn,
    b.title,
    b.author,
    b.cover,
    b.description
FROM den.profile_books AS pb
JOIN den.books AS b ON pb.book_id = b.id;
