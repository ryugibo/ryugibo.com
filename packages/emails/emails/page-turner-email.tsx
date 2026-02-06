import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface PageTurnerEmailProps {
  username: string;
  book_title: string;
  url: string;
  coverUrl: string;
}

export const PageTurnerEmail = ({ username, book_title, url, coverUrl }: PageTurnerEmailProps) => {
  const previewText = `${username}님, ${book_title} 독서는 어떠신가요?`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="w-full h-full mx-auto my-auto bg-white font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] p-[20px] text-center">
            <Img
              src={coverUrl}
              width="160"
              height="240"
              className="mx-auto rounded my-5"
              alt={book_title}
            />
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              독서의 <strong>즐거움</strong>을 잊지 마세요!
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              안녕하세요, <strong>{username}</strong>님.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{book_title}</strong> 책을 읽기 시작하신 지 벌써 일주일이 지났습니다.
              <br />
              혹시 바쁜 일상 속에서 잠시 책을 덮어두고 계시진 않나요?
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              지금 다시 책장을 넘겨 그 이야기 속으로 빠져보세요.
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-black px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={url}
              >
                계속 읽기
              </Button>
            </Section>

            <Hr className="border-[#eaeaea] my-[26px]" />

            <Text className="text-[#666] text-[12px] leading-[24px]">
              이 메일은 {username}님의 독서 활동을 응원하기 위해 발송되었습니다.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PageTurnerEmail.PreviewProps = {
  username: "독서왕",
  book_title: "해리포터와 마법사의 돌",
  url: "https://ryugibo.com/read/123",
  coverUrl: "https://github.com/ryugibo.png",
} as PageTurnerEmailProps;

export default PageTurnerEmail;
