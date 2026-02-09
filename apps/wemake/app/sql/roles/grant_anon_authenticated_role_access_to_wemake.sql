-- 1. anon(비로그인)과 authenticated(로그인 유저)에게 'wemake' 스키마를 사용할 수 있는 권한 부여
GRANT USAGE ON SCHEMA wemake TO anon, authenticated;--> statement-breakpoint

-- 2. 'wemake' 스키마 내의 현재 존재하는 모든 테이블에 대해 조회(SELECT) 권한 부여
GRANT SELECT ON ALL TABLES IN SCHEMA wemake TO anon, authenticated;--> statement-breakpoint

-- 3. (필요한 경우) 데이터 생성, 수정, 삭제 권한도 부여
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA wemake TO anon, authenticated;--> statement-breakpoint

-- 4. 앞으로 'wemake' 스키마에 새로 생성될 테이블들도 자동으로 권한이 부여되도록 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA wemake GRANT ALL ON TABLES TO anon, authenticated;--> statement-breakpoint
