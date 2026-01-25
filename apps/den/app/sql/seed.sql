do $$
declare
    v_profile_id uuid := 'a00e9af2-116b-42c8-bec5-e44ab7fd4402';
    v_book_id bigint;
    v_source text;
    v_sources text[] := array['kyobo', 'aladin', 'yes24', 'ridibooks'];
    v_read_states text[] := array['reading', 'toread', 'completed'];
    v_book_data jsonb;
    v_book record;
    v_read_state text;
begin
    -- Define the 30 books data
    v_book_data := '[
        {"title": "Clean Code", "author": "Robert C. Martin", "description": "A Handbook of Agile Software Craftsmanship"},
        {"title": "The Pragmatic Programmer", "author": "Andrew Hunt", "description": "Your Journey to Mastery"},
        {"title": "Refactoring", "author": "Martin Fowler", "description": "Improving the Design of Existing Code"},
        {"title": "Design Patterns", "author": "Erich Gamma", "description": "Elements of Reusable Object-Oriented Software"},
        {"title": "The Mythical Man-Month", "author": "Frederick Brooks", "description": "Essays on Software Engineering"},
        {"title": "Introduction to Algorithms", "author": "Thomas H. Cormen", "description": "Comprehensive guide to algorithms"},
        {"title": "Code Complete", "author": "Steve McConnell", "description": "A Practical Handbook of Software Construction"},
        {"title": "Head First Design Patterns", "author": "Eric Freeman", "description": "A Brain-Friendly Guide"},
        {"title": "You Don''t Know JS", "author": "Kyle Simpson", "description": "Deep dive into JavaScript core mechanisms"},
        {"title": "Effective Java", "author": "Joshua Bloch", "description": "Best practices for the Java platform"},
        {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "description": "The story of the mysteriously wealthy Jay Gatsby"},
        {"title": "1984", "author": "George Orwell", "description": "Dystopian social science fiction novel and cautionary tale"},
        {"title": "To Kill a Mockingbird", "author": "Harper Lee", "description": "A novel about the serious issues of rape and racial inequality"},
        {"title": "Pride and Prejudice", "author": "Jane Austen", "description": "Romantic novel of manners"},
        {"title": "The Catcher in the Rye", "author": "J.D. Salinger", "description": "A story about teenage angst and alienation"},
        {"title": "The Hobbit", "author": "J.R.R. Tolkien", "description": "Fantasy novel and children''s book"},
        {"title": "Fahrenheit 451", "author": "Ray Bradbury", "description": "Dystopian novel about a future American society"},
        {"title": "Brave New World", "author": "Aldous Huxley", "description": "Dystopian novel set in a futuristic World State"},
        {"title": "The Lord of the Rings", "author": "J.R.R. Tolkien", "description": "High fantasy novel widely considered one of the greatest"},
        {"title": "Harry Potter and the Sorcerer''s Stone", "author": "J.K. Rowling", "description": "Fantasy novel about a young wizard"},
        {"title": "Sapiens", "author": "Yuval Noah Harari", "description": "A Brief History of Humankind"},
        {"title": "Atomic Habits", "author": "James Clear", "description": "An Easy & Proven Way to Build Good Habits & Break Bad Ones"},
        {"title": "The Alchemist", "author": "Paulo Coelho", "description": "A novel about following your dreams"},
        {"title": "Thinking, Fast and Slow", "author": "Daniel Kahneman", "description": "The two systems that drive the way we think"},
        {"title": "The Power of Habit", "author": "Charles Duhigg", "description": "Why We Do What We Do in Life and Business"},
        {"title": "Deep Work", "author": "Cal Newport", "description": "Rules for Focused Success in a Distracted World"},
        {"title": "Digital Minimalism", "author": "Cal Newport", "description": "Choosing a Focused Life in a Noisy World"},
        {"title": "Zero to One", "author": "Peter Thiel", "description": "Notes on Startups, or How to Build the Future"},
        {"title": "Steve Jobs", "author": "Walter Isaacson", "description": "Biography of the Apple co-founder"},
        {"title": "Elon Musk", "author": "Walter Isaacson", "description": "Biography of the tech entrepreneur"}
    ]';

    -- Loop through the JSON array
    for v_book in select * from jsonb_to_recordset(v_book_data) as x(title text, author text, description text)
    loop
        -- 1. Insert Book
        insert into den.books (title, author, description, created_at, updated_at)
        values (
            v_book.title,
            v_book.author,
            v_book.description,
            now(),
            now()
        )
        returning id into v_book_id;

        -- 2. Select Random Source and Read State
        v_source := v_sources[1 + floor(random() * array_length(v_sources, 1))::int];
        v_read_state := v_read_states[1 + floor(random() * array_length(v_read_states, 1))::int];

        -- 3. Insert Profile Book Link
        insert into den.profile_books (profile_id, book_id, source, read_state, comment, created_at, updated_at)
        values (
            v_profile_id,
            v_book_id,
            v_source::den.book_sources,
            v_read_state::den.read_state,
            'Reading log for ' || v_book.title,
            now(),
            now()
        );
    end loop;
end;
$$;
