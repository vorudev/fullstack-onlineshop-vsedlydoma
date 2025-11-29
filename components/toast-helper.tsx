// lib/error-messages.ts
import { toast } from "sonner"

export const errorMessages: Record<string, string> = {
  // Auth errors
  "User already exists. Use another email.": "Пользователь с таким email уже существует",
  "User already exists": "Пользователь уже существует",
  "Invalid email or password": "Неверный email или пароль",
  "Invalid credentials": "Неверные учетные данные",
  "Email already in use": "Email уже используется",
  "Unauthorized": "Неавторизован",
  "Access denied": "Доступ запрещен",
  "Session expired": "Сессия истекла",
  "Invalid token": "Недействительный токен",
  "Password too weak": "Слишком слабый пароль",
  "Passwords do not match": "Пароли не совпадают",
  "Email not verified": "Email не подтвержден",
  "Account disabled": "Аккаунт отключен",
  "Too many requests": "Слишком много запросов",
  
  // Category errors
  "Failed to delete category": "Не удалось удалить категорию",
  "Failed to create category": "Не удалось создать категорию",
  "Failed to update category": "Не удалось обновить категорию",
  "Category not found": "Категория не найдена",
  "Category already exists": "Категория уже существует",
  "Cannot delete category with products": "Невозможно удалить категорию с товарами",
  
  // Product errors
  "Failed to delete product": "Не удалось удалить товар",
  "Failed to create product": "Не удалось создать товар",
  "Failed to update product": "Не удалось обновить товар",
  "Product not found": "Товар не найден",
  "Product out of stock": "Товар закончился",
  "Invalid product data": "Неверные данные товара",
  
  // Order errors
  "Failed to create order": "Не удалось создать заказ",
  "Order not found": "Заказ не найден",
  "Cannot cancel order": "Невозможно отменить заказ",
  "Payment failed": "Ошибка оплаты",
  
  // Network errors
  "Network error": "Ошибка сети",
  "Server error": "Ошибка сервера",
  "Connection timeout": "Время ожидания истекло",
  "Something went wrong": "Что-то пошло не так",
  "Failed to fetch": "Не удалось загрузить данные",
  
  // Validation errors
  "Invalid email": "Неверный email",
  "Invalid phone number": "Неверный номер телефона",
  "Required field": "Обязательное поле",
  "Field is required": "Поле обязательно для заполнения",
  "Invalid format": "Неверный формат",
  "Value too long": "Значение слишком длинное",
  "Value too short": "Значение слишком короткое",
  
  // File upload errors
  "File too large": "Файл слишком большой",
  "Invalid file type": "Неверный тип файла",
  "Upload failed": "Не удалось загрузить файл",
  
  // Generic
  "Not found": "Не найдено",
  "Forbidden": "Запрещено",
  "Bad request": "Неверный запрос",
}

export function translateError(message: string): string {
  // Попробовать найти точное совпадение
  if (errorMessages[message]) {
    return errorMessages[message]
  }
  
  // Попробовать найти частичное совпадение
  const partialMatch = Object.keys(errorMessages).find(key => 
    message.toLowerCase().includes(key.toLowerCase())
  )
  
  if (partialMatch) {
    return errorMessages[partialMatch]
  }
  
  // Вернуть оригинальное сообщение, если перевод не найден
  return message
}

export function showError(message: string) {
  const translatedMessage = translateError(message)
  toast.error(translatedMessage)
}