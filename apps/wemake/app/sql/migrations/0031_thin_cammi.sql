-- Custom SQL migration file, put your code below! --

-- 1. wemake 스키마 자체에 대한 접근 권한 부여
GRANT USAGE ON SCHEMA wemake TO service_role;

-- 2. 스키마 내의 모든 테이블에 대한 권한 부여 (INSERT, SELECT, UPDATE 등)
GRANT ALL ON ALL TABLES IN SCHEMA wemake TO service_role;

-- 3. 앞으로 만들어질 테이블에도 자동으로 권한 부여 (선택 사항이지만 권장)
ALTER DEFAULT PRIVILEGES IN SCHEMA wemake GRANT ALL ON TABLES TO service_role;

-- 4. 만약 시퀀스(ID 자동 생성 등)를 사용한다면 시퀀스 권한도 필요
GRANT ALL ON ALL SEQUENCES IN SCHEMA wemake TO service_role;
