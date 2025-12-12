import { Html } from "@react-email/components";
import { Head } from "@react-email/components";
import { Preview } from "@react-email/components";
import { Tailwind } from "@react-email/components";
import { Body } from "@react-email/components";
import { Container,  } from "@react-email/components";
import { Section } from "@react-email/components";
import { Heading } from "@react-email/components";
import { Text } from "@react-email/components";
import { Button } from "@react-email/components";
import Image from "next/image";
import Link from "next/link";
export default function PreviewPage() {
    return (
        <Html lang="ru" dir="ltr">
        <Head />
       
        <Preview>Подтверждение регистрации</Preview>
        <div className="flex justify-center items-center"> <Image src="/logo.webp" alt="All for Home" width={150} height={150} /></div>
        <Tailwind>
          <Body className="bg-white py-[40px] font-sans">
            
            <Container className=" mx-auto px-[40px] py-[40px] rounded-[8px] max-w-[600px]">
                
              {/* Header */}
              <Section className="text-center ">
                <Heading className="text-[28px] text-black font-bold mb-[16px] mt-0">
                  Подтверждение регистрации 
                </Heading>
             
              </Section>
  
              {/* Main Content */}
              <Section className="mb-[36px]">
                <Text className="t text-[16px] text-center text-gray-600 leading-[26px] mb-[24px] mt-0">
                   Для подтверждения регистрации нажмите на кнопку ниже.
                </Text>
             
                 <Button className="bg-blue-500 text-white mb-[16px] h-[48px] rounded-md flex items-center justify-center max-w-[200px] mx-auto" href="https://all-for-home.by/verify-email?token=1234567890"> Подтвердить email</Button>
                <Text className="text-gray-600 text-[14px] text-center leading-[20px]  mt-0">
                  Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:
                </Text>
                <Text className="text-blue-400 text-center  text-[14px] leading-[20px] mb-[24px] mt-0 break-all">
                   https://all-for-home.by/verify-email?token=1234567890
                </Text>
                <Text className="text-gray-600 text-[14px] text-center leading-[20px] mb-[24px] mt-0">
                 Если вы не регистрировались на сайте, пожалуйста, проигнорируйте это письмо.
                </Text>
              </Section>
   
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
}