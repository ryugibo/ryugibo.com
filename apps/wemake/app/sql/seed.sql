-- Seed Data for wemake schema
-- Profile ID used for all entries: a00e9af2-116b-42c8-bec5-e44ab7fd4402

-- 1. Categories
INSERT INTO "wemake"."categories" ("name", "description") VALUES
('SaaS', 'Software as a Service products'),
('AI Tools', 'Artificial Intelligence powered tools'),
('Developer Tools', 'Tools for software developers'),
('Design', 'Design resources and tools'),
('Productivity', 'Apps to boost productivity');

-- 2. Topics
INSERT INTO "wemake"."topics" ("name", "slug") VALUES
('General Discussion', 'general-discussion'),
('Show HN', 'show-hn'),
('Ask HN', 'ask-hn'),
('Launch Day', 'launch-day'),
('Feedback Request', 'feedback-request');

-- 3. Jobs
INSERT INTO "wemake"."jobs" ("position", "overview", "responsibilities", "qualifications", "benefits", "skills", "company_name", "company_logo", "company_location", "apply_url", "job_type", "location", "salary_range") VALUES
('Senior Frontend Engineer', 'Lead our frontend team building the next gen UI.', 'Build and maintain React components.', '5+ years experience with React.', 'Remote work, equity, health insurance.', 'React, TypeScript, CSS', 'TechCorp', 'https://github.com/facebook.png', 'San Francisco, CA', 'https://techcorp.com/jobs/1', 'full-time', 'remote', '$150,000 - $250,000'),
('Backend Developer', 'Scale our API services.', 'Optimize database queries and API endpoints.', 'Experience with Node.js and PostgreSQL.', 'Competitive salary.', 'Node.js, PostgreSQL, Redis', 'DataSystems', 'https://github.com/google.png', 'New York, NY', 'https://datasystems.com/jobs/backend', 'full-time', 'hybrid', '$120,000 - $150,000'),
('Product Designer', 'Design beautiful interfaces for our users.', 'Create mockups and prototypes.', 'Portfolio demonstrating UI/UX skills.', 'Flexible hours.', 'Figma, Sketch, Adobe XD', 'DesignStudio', 'https://github.com/apple.png', 'Remote', 'https://designstudio.com/careers', 'contract', 'remote', '$70,000 - $100,000'),
('Marketing Manager', 'Grow our user base.', 'Run ad campaigns and manage social media.', 'Experience in digital marketing.', 'Performance bonuses.', 'SEO, SEM, Social Media', 'GrowthHacks', 'https://github.com/twitter.png', 'Austin, TX', 'https://growthhacks.com/hiring', 'full-time', 'in-person', '$100,000 - $120,000'),
('DevOps Engineer', 'Maintain our infrastructure.', 'Manage AWS resources and CI/CD pipelines.', 'AWS certification preferred.', 'Stock options.', 'AWS, Docker, Kubernetes', 'CloudInfra', 'https://github.com/amazon.png', 'Seattle, WA', 'https://cloudinfra.com/jobs/devops', 'full-time', 'remote', '$150,000 - $250,000');

-- 4. Teams
INSERT INTO "wemake"."teams" ("team_size", "equity_split", "roles", "product_name", "product_stage", "product_description") VALUES
(3, 33, 'Developer, Designer, Marketer', 'SuperApp', 'mvp', 'An app that does everything.'),
(2, 50, 'Developer, Developer', 'CodeTool', 'prototype', 'A tool for writing better code.'),
(5, 20, '2 Developers, 1 Designer, 2 Sales', 'SalesBot', 'production', 'AI bot for sales automation.'),
(1, 100, 'Solo Founder', 'IndieProduct', 'idea', 'A niche product for hobbyists.'),
(4, 25, 'Developer, Designer, PM, Marketer', 'CollabPlatform', 'mvp', 'Platform for remote collaboration.');

-- 5. Message Rooms
INSERT INTO "wemake"."message_rooms" DEFAULT VALUES;
INSERT INTO "wemake"."message_rooms" DEFAULT VALUES;
INSERT INTO "wemake"."message_rooms" DEFAULT VALUES;
INSERT INTO "wemake"."message_rooms" DEFAULT VALUES;
INSERT INTO "wemake"."message_rooms" DEFAULT VALUES;

-- 6. Ideas
INSERT INTO "wemake"."ideas" ("idea", "views", "claimed_by") VALUES
('A social network for cats', 150, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
('Uber for dog walking', 200, NULL),
('AI generated recipes', 350, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
('Blockchain voting system', 500, NULL),
('VR meditation app', 120, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402');

-- 7. Products (Assuming Category IDs 1-5 exist)
INSERT INTO "wemake"."products" ("name", "tagline", "description", "how_it_works", "icon", "url", "profile_id", "category_id") VALUES
('RocketLaunch', 'Launch your startups fast', 'A comprehensive boilerplate for SaaS.', 'Clone repo, configure, deploy.', 'https://github.com/shadcn.png', 'https://rocketlaunch.io', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 1),
('MagicWriter', 'Write better with AI', 'AI assistant that helps you write content.', 'Type a prompt, get text.', 'https://github.com/openai.png', 'https://magicwriter.ai', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 2),
('DevDash', 'All your metrics in one place', 'Dashboard for developers to track stats.', 'Connect APIs, see graphs.', 'https://github.com/vercel.png', 'https://devdash.com', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 3),
('PixelPerfect', 'Design assets for free', 'High quality icons and illustrations.', 'Download and use.', 'https://github.com/figma.png', 'https://pixelperfect.design', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 4),
('TaskMaster', 'Get things done', 'A simple yet powerful todo list.', 'Add tasks, check them off.', 'https://github.com/todoist.png', 'https://taskmaster.app', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 5);

-- 8. Posts (Assuming Topic IDs 1-5 exist)
INSERT INTO "wemake"."posts" ("title", "content", "topic_id", "profile_id") VALUES
('Hello World', 'This is my first post on this platform.', 1, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
('Check out my new app', 'I just launched RocketLaunch, looking for feedback.', 2, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
('How to scale Postgres?', 'I am facing some performance issues with my DB.', 3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
('Launched MagicWriter today!', 'After months of work, it is finally live.', 4, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
('What is the best way to handle auth?', 'JWT vs Sessions?', 3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402');

-- 9. Reviews (Assuming Product IDs 1-5 exist)
INSERT INTO "wemake"."reviews" ("product_id", "profile_id", "rating", "comment") VALUES
(1, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 5, 'Amazing product, saved me tons of time.'),
(2, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 4, 'Very useful but needs some UI polish.'),
(3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 5, 'Exactly what I needed for my side projects.'),
(4, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 3, 'Good resources but limited selection.'),
(5, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 5, 'Simple and effective.');

-- 10. Post Replies (Assuming Post IDs 1-5 exist)
INSERT INTO "wemake"."post_replies" ("content", "post_id", "profile_id", "parent_id") VALUES
('Welcome to the community!', 1, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', NULL),
('Looks great, congrats on the launch!', 2, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', NULL),
('Have you tried indexing your columns?', 3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', NULL),
('Congrats! Upvoted on PH.', 4, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', NULL),
('I personally prefer sessions for simple apps.', 5, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', NULL);

-- 11. Messages (Assuming Message Room IDs 1-5 exist)
INSERT INTO "wemake"."messages" ("message_room_id", "profile_id", "content", "seen") VALUES
(1, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'Hey, are you interested in a collab?', true),
(2, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'Did you see my latest PR?', false),
(3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'Lets meet tomorrow at 10am.', true),
(4, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'Thanks for the feedback!', true),
(5, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'Can you share the Figma file?', false);

-- 12. Notifications (Self notifications for testing)
INSERT INTO "wemake"."notifications" ("id", "target_id", "source_id", "type", "product_id", "post_id") VALUES
(gen_random_uuid(), 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'follow', NULL, NULL),
(gen_random_uuid(), 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'review', 1, NULL),
(gen_random_uuid(), 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'reply', NULL, 3),
(gen_random_uuid(), 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'mention', NULL, 5),
(gen_random_uuid(), 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'review', 2, NULL);

-- 13. Product Upvotes
INSERT INTO "wemake"."product_upvotes" ("product_id", "profile_id") VALUES
(1, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(2, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(4, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(5, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402');

-- 14. Idea Likes
INSERT INTO "wemake"."idea_likes" ("idea_id", "profile_id") VALUES
(1, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(2, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(4, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(5, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402');

-- 15. Post Upvotes
INSERT INTO "wemake"."post_upvotes" ("post_id", "profile_id") VALUES
(1, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(2, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(4, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(5, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402');

-- 16. Message Room Members (Self membership)
INSERT INTO "wemake"."message_room_members" ("message_room_id", "profile_id") VALUES
(1, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(2, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(3, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(4, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402'),
(5, 'a00e9af2-116b-42c8-bec5-e44ab7fd4402');

-- 17. Follows (Self follow)
INSERT INTO "wemake"."follows" ("follower_id", "following_id") VALUES
('a00e9af2-116b-42c8-bec5-e44ab7fd4402', 'a00e9af2-116b-42c8-bec5-e44ab7fd4402');
