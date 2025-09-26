# 🔐 Autenticación - API con NestJS + Prisma + JWT + Cookies

Este módulo maneja el registro, login y logout de usuarios usando **Prisma**, **bcrypt**, **JWT** y **cookies httpOnly**.  
A continuación se explica cómo probarlo en **Postman**.

---

## 📌 Endpoints y uso en Postman

### 1️⃣ Registro de usuario

**Endpoint**
POST http://localhost:3000/auth/register

pgsql
Copiar código

**Body (JSON)**

```json
{
  "email": "usuario@test.com",
  "password": "123456",
  "nombre": "Juan Pérez",
  "rol": "USER"
}
Respuesta

json
Copiar código
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": 1,
    "email": "usuario@test.com",
    "nombre": null,
    "rol": "USER",
    "creadoEn": "2025-09-22T18:00:00.000Z",
    "actualizadoEn": "2025-09-22T18:00:00.000Z"
  }
}
2️⃣ Login de usuario
Endpoint

bash
Copiar código
POST http://localhost:3000/auth/login
Body (JSON)

json
Copiar código
{
  "email": "usuario@test.com",
  "password": "123456"
}
Respuesta

json
Copiar código
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "email": "usuario@test.com",
    "nombre": null,
    "rol": "USER",
    "creadoEn": "2025-09-22T18:00:00.000Z",
    "actualizadoEn": "2025-09-22T18:00:00.000Z"
  }
}
📌 Importante: además de esta respuesta en JSON, el servidor devuelve un JWT en una cookie httpOnly llamada jwt.

3️⃣ Logout de usuario
Endpoint

bash
Copiar código
POST http://localhost:3000/auth/logout
Respuesta

json
Copiar código
{
  "message": "Logout exitoso"
}
📌 Esto elimina la cookie jwt.

⚙️ Notas importantes para Postman
La URL base es:

arduino
Copiar código
http://localhost:3000
Activa en Postman la opción Save cookies para que la cookie jwt se guarde después del login.

Puedes ver la cookie en la pestaña Cookies de Postman; se enviará automáticamente en las siguientes peticiones.

El token JWT expira en 7 días.

yaml
Copiar código

---

👉 ¿Quieres que te arme también la **colección de Postman (.json)** lista para importar y probar todo sin que tengas que escribir nada manualmente?
```
