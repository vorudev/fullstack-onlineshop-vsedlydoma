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
  <Html>
    <Head />
    <Preview>Ваш заказ {sku} успешно оформлен</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Спасибо за заказ!</Heading>
        
        <Text style={text}>
          Здравствуйте, {customerName}!
        </Text>
        
        <Text style={text}>
          Ваш заказ <strong>{sku}</strong> успешно создан и принят в обработку.
        </Text>

        <Section style={orderInfo}>
          <Text style={orderInfoText}>
            <strong>Номер заказа:</strong> {sku}
          </Text>
          <Text style={orderInfoText}>
            <strong>Дата:</strong> {new Date(createdAt).toLocaleString('ru-RU')}
          </Text>
        </Section>

        <Hr style={hr} />

        <Heading as="h2" style={h2}>Детали заказа</Heading>

        {items.map((item, index) => (
          <Section key={index} style={itemSection}>
            <Row>
              <Column>
                <Text style={itemTitle}>{item.title}</Text>
                <Text style={itemDetails}>
                  Количество: {item.quantity} × {item.price.toFixed(2)} ₽
                </Text>
              </Column>
              <Column align="right">
                <Text style={itemPrice}>
                  {(item.quantity * item.price).toFixed(2)} ₽
                </Text>
              </Column>
            </Row>
          </Section>
        ))}

        <Hr style={hr} />

        <Section style={totalSection}>
          <Row>
            <Column>
              <Text style={totalLabel}>Итого:</Text>
            </Column>
            <Column align="right">
              <Text style={totalPrice}>{total.toFixed(2)} ₽</Text>
            </Column>
          </Row>
        </Section>

        <Text style={text}>
          Мы свяжемся с вами в ближайшее время для подтверждения заказа.
        </Text>

        <Text style={footer}>
          С уважением,<br />
          Команда вашего магазина
        </Text>
      </Container>
    </Body>
  </Html>
);

// Стили
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 20px',
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
  padding: '0 20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 20px',
};

const orderInfo = {
  padding: '0 20px',
  margin: '16px 0',
};

const orderInfoText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const itemSection = {
  padding: '12px 20px',
};

const itemTitle = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 4px',
};

const itemDetails = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
};

const itemPrice = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
};

const totalSection = {
  padding: '20px',
  backgroundColor: '#f6f9fc',
};

const totalLabel = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const totalPrice = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '0 20px',
  marginTop: '32px',
};

export default OrderConfirmationEmail;
