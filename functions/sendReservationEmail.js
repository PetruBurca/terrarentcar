const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

// Инициализация Firebase Admin
admin.initializeApp();

// Настройка SendGrid API ключа
sgMail.setApiKey(functions.config().sendgrid.key);

// Функция отправки email о резервации
exports.sendReservationEmail = functions.https.onRequest(async (req, res) => {
  // Включаем CORS для веб-запросов
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Обработка preflight запросов
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const { email, reservationData, status } = req.body;

    if (!email || !reservationData) {
      return res
        .status(400)
        .json({ error: "Email и данные резервации обязательны" });
    }

    // Определяем тему письма в зависимости от статуса
    const subject =
      status === "отклонена"
        ? "Резервация отклонена"
        : "Резервация подтверждена";

    // Генерируем HTML письма
    const htmlContent = generateEmailHTML(reservationData, status);

    const msg = {
      to: email,
      from: {
        email: "petruburca133@gmail.com",
        name: "TerraRentCar",
      },
      subject: subject,
      html: htmlContent,
    };

    await sgMail.send(msg);

    console.log(`Email отправлен на ${email} со статусом: ${status}`);
    res.json({ success: true, message: "Email отправлен успешно" });
  } catch (error) {
    console.error("Ошибка отправки email:", error);
    res.status(500).json({
      error: "Ошибка отправки email",
      details: error.message,
    });
  }
});

// Функция генерации HTML письма
function generateEmailHTML(data, status) {
  const isRejected = status === "отклонена";

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${
          isRejected ? "Резервация отклонена" : "Резервация подтверждена"
        }</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px;
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px; 
                text-align: center; 
                border-radius: 10px 10px 0 0;
            }
            .content { 
                background: #f9f9f9; 
                padding: 30px; 
                border-radius: 0 0 10px 10px;
            }
            .status-badge { 
                display: inline-block; 
                padding: 8px 16px; 
                border-radius: 20px; 
                font-weight: bold; 
                margin-bottom: 20px;
            }
            .status-confirmed { 
                background: #d4edda; 
                color: #155724; 
                border: 1px solid #c3e6cb;
            }
            .status-rejected { 
                background: #f8d7da; 
                color: #721c24; 
                border: 1px solid #f5c6cb;
            }
            .details-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
                border: 2px solid #333;
            }
            .details-table td { 
                padding: 12px; 
                border: 1px solid #333; 
                background: #fff;
            }
            .details-table tr:first-child td { 
                background: #f8f9fa; 
                font-weight: bold;
            }
            .payment-table { 
                width: auto; 
                min-width: 300px; 
                border-collapse: collapse; 
                margin: 20px 0; 
                border: 2px solid #333;
            }
            .payment-table td { 
                padding: 8px 12px; 
                border: 1px solid #333; 
                background: #fff;
            }
            .payment-table tr:first-child td { 
                background: #f8f9fa; 
                font-weight: bold;
            }
            .payment-table td:last-child { 
                text-align: right; 
                font-weight: bold;
            }
            .contact-section { 
                background: #e9ecef; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0;
            }
            .social-links { 
                text-align: center; 
                margin: 30px 0;
            }
            .social-links h3 { 
                margin: 10px 0; 
                font-size: 14px;
            }
            .social-links a { 
                display: inline-flex; 
                align-items: center; 
                margin: 0 10px; 
                text-decoration: none; 
                color: #333;
            }
            .social-links img { 
                width: 20px; 
                height: 20px; 
                margin-right: 5px;
            }
            .footer { 
                text-align: center; 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 1px solid #ddd; 
                color: #666; 
                font-size: 12px;
            }
            .highlight { 
                background: #fff3cd; 
                padding: 15px; 
                border-radius: 5px; 
                border-left: 4px solid #ffc107;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${
              isRejected ? "Резервация отклонена" : "Резервация подтверждена"
            }</h1>
            <div class="status-badge ${
              isRejected ? "status-rejected" : "status-confirmed"
            }">
                ${isRejected ? "❌ ОТКЛОНЕНА" : "✅ ПОДТВЕРЖДЕНА"}
            </div>
        </div>
        
        <div class="content">
            ${
              isRejected
                ? `
                <div class="highlight">
                    <strong>К сожалению, ваша резервация была отклонена.</strong><br>
                    Пожалуйста, свяжитесь с нами для уточнения деталей.
                </div>
            `
                : `
                <p>Пожалуйста, проверьте детали резервации. Если что-то не так, Вы можете исправить резервацию по номеру телефона: <strong>+37379013014</strong> в течение 24 часов с момента ее создания.</p>
            `
            }
            
            <h2>Детали проката:</h2>
            <table class="details-table">
                <tr>
                    <td>Выбранный автомобиль</td>
                    <td>${data.carModel || "Не указан"}</td>
                </tr>
                <tr>
                    <td>Дата резервации</td>
                    <td>От ${data.startDate || "Не указана"}<br>До ${
    data.endDate || "Не указана"
  }</td>
                </tr>
                <tr>
                    <td>Локация получения</td>
                    <td>${data.pickupLocation || "Не указана"}</td>
                </tr>
                ${
                  data.pickupDetails
                    ? `
                <tr>
                    <td>Как забрать машину</td>
                    <td>${data.pickupDetails}</td>
                </tr>
                `
                    : ""
                }
            </table>
            
            <h2>Детали оплаты:</h2>
            <table class="payment-table">
                <tr>
                    <td>Стоимость аренды</td>
                    <td>${data.rentalCost || 0} €</td>
                </tr>
                <tr>
                    <td>Стоимость мойки</td>
                    <td>20 €</td>
                </tr>
                ${
                  data.discount && data.discount > 0
                    ? `
                <tr>
                    <td>Скидка</td>
                    <td>-${data.discount} €</td>
                </tr>
                `
                    : ""
                }
                ${
                  data.unlimitedMileageCost && data.unlimitedMileageCost > 0
                    ? `
                <tr>
                    <td>Двойной км</td>
                    <td>${data.unlimitedMileageCost} €</td>
                </tr>
                `
                    : ""
                }
                <tr>
                    <td><strong>Итого к оплате</strong></td>
                    <td><strong>${data.totalCost || 0} €</strong></td>
                </tr>
            </table>
            
            <div class="contact-section">
                <h2>Контакты</h2>
                <h3>Administrator:</h3>
                <p>+37379013014</p>
                
                <h3>Asistentă tehnică:</h3>
                <p>+37361131131</p>
                <p>+37362131370</p>
                
                <h3>Manager consultant:</h3>
                <p>+37360777137</p>
                <p>+37360496669</p>
            </div>
            
            <div class="social-links">
                <h3>Социальные сети</h3>
                <a href="https://www.instagram.com/terrarentcar/" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram">
                    INSTAGRAM
                </a>
                <a href="https://www.facebook.com/TerraRentCar/" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/24/2111/2111342.png" alt="Facebook">
                    FACEBOOK
                </a>
            </div>
            
            <div class="footer">
                2021 TerrarentCarPrim || All rights are reserved.
            </div>
        </div>
    </body>
    </html>
  `;
}
