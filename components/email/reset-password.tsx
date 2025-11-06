import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface ForgotPasswordEmailProps {
  username: string;
  resetUrl: string;
  userEmail: string
}
const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Reset your password - Action required</Preview>
      <Tailwind>
        <Body className="bg-black py-[40px] font-sans">
          <Container className="bg-[#151516] mx-auto px-[40px] py-[40px] rounded-[8px] max-w-[600px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-white text-[28px] font-bold mb-[16px] mt-0">
                Reset Your Password
              </Heading>
              <Text className="text-gray-300 text-[16px] mb-0 mt-0">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-gray-200 text-[16px] leading-[24px] mb-[24px] mt-0">
                Hello, {props.username}
              </Text>
              <Text className="text-gray-200 text-[16px] leading-[24px] mb-[24px] mt-0">
                Someone requested a password reset for your account at {props.userEmail}. If this was you, click the button below to reset your password. This link will expire in 24 hours for security reasons.
              </Text>
              <Text className="text-gray-200 text-[16px] leading-[24px] mb-[32px] mt-0">
                If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-[32px]">
                <Button 
                href={props.resetUrl}
                  className="bg-blue-600  text-white font-semibold py-[12px] px-[24px] rounded-[6px] text-[16px] no-underline box-border"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-gray-300 text-[14px] leading-[20px] mb-[24px] mt-0">
                Or copy and paste this link into your browser:
              </Text>
              <Text className="text-blue-400 text-[14px] leading-[20px] mb-[24px] mt-0 break-all">
                {props.resetUrl}
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="border-t border-gray-700 pt-[24px] mb-[32px]">
              <Text className="text-gray-300 text-[14px] leading-[20px] mb-[16px] mt-0">
                <strong>Security Tips:</strong>
              </Text>
              <Text className="text-gray-400 text-[14px] leading-[20px] mb-[8px] mt-0">
                • Never share your password with anyone
              </Text>
              <Text className="text-gray-400 text-[14px] leading-[20px] mb-[8px] mt-0">
                • Use a strong, unique password
              </Text>
              <Text className="text-gray-400 text-[14px] leading-[20px] mb-0 mt-0">
                • Enable two-factor authentication when available
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-700 pt-[24px] text-center">
              <Text className="text-gray-400 text-[12px] leading-[16px] mb-[8px] mt-0">
                Need help? Contact our support team at{' '}
                <Link href="mailto:support@example.com" className="text-blue-400 no-underline">
                  support@example.com
                </Link>
              </Text>
              <Text className="text-gray-500 text-[12px] leading-[16px] mb-[8px] mt-0 m-0">
                Example Company, 123 Business Street, City, State 12345
              </Text>
              <Text className="text-gray-500 text-[12px] leading-[16px] mb-0 mt-0">
                <Link href="https://example.com/unsubscribe" className="text-gray-500 no-underline">
                  Unsubscribe
                </Link>
                {' • '}
                © 2025 Example Company. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;