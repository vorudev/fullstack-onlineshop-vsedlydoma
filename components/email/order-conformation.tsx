import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Tailwind,

  Button,
} from '@react-email/components';
import type { OrderItem } from '@/db/schema';



interface OrderConfirmationEmailProps {
  sku: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export const OrderConfirmationEmail = ({
  sku,
  customerName,
  items,
  total,
  createdAt,
}: OrderConfirmationEmailProps) => (
  <Html lang="ru" dir="ltr">
      <Head />
      <Preview>Заказ {sku} успешно оформлен!</Preview>
      <Tailwind>
        <Body className="bg-white py-10 font-sans">
          <Container className="mx-auto px-10 py-10 rounded-lg max-w-[600px]">
            {/* Logo */}
            <Section className="text-center mb-8">
           <Text className="text-3xl text-blue-900 font-bold mb-4 mt-0">
              Все для дома
           </Text>
            </Section> 
  
            {/* Header */}
            <Section className="text-center">
              <Heading className="text-3xl text-black font-bold mb-4 mt-0">
                 Спасибо за заказ!
              </Heading>
            </Section>
  
            {/* Main Content */}
            <Section className="mb-9">
              <Text className="text-base text-center text-gray-600 leading-relaxed  mt-0">
                Здравствуйте, {customerName}! Ваш заказ успешно создан и принят в обработку.
              </Text>
     <Text className="text-base text-center text-black font-semibold   mt-0">
      Номер заказа: <strong>{sku}</strong>
     </Text>
    <Text className="text-base text-center text-black leading-relaxed  mt-0">Дата: {new Date(createdAt).toLocaleString('ru-RU')}</Text>
    </Section>
 <Hr  className="mb-6" />
    <Heading className="text-xl mb-6 text-center text-black font-semibold   mt-0">Детали заказа</Heading>
             <Section>
           {items.map((item, index) => (
            <Row className="border-b-2 border-gray-200   " key={index }>
            <Column className="text-black ">
            <Text className="text-lg font-semibold">
             {item.title}
            </Text>
            <Text className="text-md ">
            Количество: {item.quantity} x {item.price.toFixed(2)} руб
            </Text>
            </Column>
            <Column align="right">
             <Text className="text-black font-semibold text-lg"> {(item.quantity * item.price).toFixed(2)} руб </Text>
            </Column>
                          </Row>))}  
              
              <Text className="text-right text-xl text-black font-semibold mb-6 ">Итого: {total.toFixed(2)} руб</Text> 

              <Text className="text-gray-600 text-sm text-center leading-5 mb-6 mt-0">
                Мы свяжемся с вами в ближайшее время для подтверждения заказа.
              </Text>
  
              <Text className="text-gray-600 text-sm text-center leading-5 mb-6 mt-0">
               С уважением, <br />
 Комманда Все для дома
              </Text>
              </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
);
export default OrderConfirmationEmail;
