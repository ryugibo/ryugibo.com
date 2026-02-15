-- Custom SQL migration file, put your code below! --

-- 0. 'den' 스키마 생성
CREATE SCHEMA IF NOT EXISTS den; --> statement-breakpoint

-- 1. 'den' 스키마를 사용할 수 있는 권한 부여
GRANT USAGE ON SCHEMA den TO anon, authenticated, service_role; --> statement-breakpoint

-- 2. 'den' 스키마 내의 현재 존재하는 모든 테이블에 대해 조회(SELECT) 권한 부여
GRANT SELECT ON ALL TABLES IN SCHEMA den TO anon, authenticated, service_role; --> statement-breakpoint

-- 3. 데이터 생성, 수정, 삭제 권한도 부여
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA den TO anon, authenticated, service_role; --> statement-breakpoint

-- 4. 앞으로 'den' 스키마에 새로 생성될 테이블들도 자동으로 권한이 부여되도록 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA den GRANT ALL ON TABLES TO anon, authenticated, service_role; --> statement-breakpoint
