# 📚 API REST - Gestor de Libros

API REST desarrollada con Express y MongoDB que implementa autenticación con JWT, roles de usuario, validación con Zod y arquitectura MVC. Permite a usuarios registrados gestionar su lista de libros personal.

---

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- cors
- express-rate-limit
- zod
- morgan

---

## Estructura MVC

[Estructura MVC del proyecto]

```
servidor-backend-API REST/
├── assets/
│   └── ...
├── src/
│   ├── config/
│   │   └── mongoDbConnection.js
│   ├── controllers/
│   │   ├── authControllers.js
│   │   └── bookControllers.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── limiterMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── BookModel.js
│   │   └── UserModel.js
│   ├── routes/
│   │   ├── authRouter.js
│   │   └── bookRouter.js
│   └── validators/
│       ├── authValidator.js
│       ├── bookValidator.js
│       └── queryValidator.js
├── app.js
├── .env.example
├── .gitignore
└── package.json
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone
cd servidor-backend-API REST
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<nombre_db>?appName=<appName>
PORT=3001
JWT_SECRET=tu_clave_secreta
```

### Configurar MongoDB Atlas

1. Crear una cuenta en [cloud.mongodb.com](https://cloud.mongodb.com)
2. Crear un cluster gratuito (M0)
3. Ir a **Security → Network Access** → agregar `0.0.0.0/0`
4. Ir al cluster → **Connect** → **Drivers**
5. Destildar la opción **SRV Connection String**
6. Copiar la connection string y reemplazar `<password>` con tu contraseña
7. Agregar el nombre de la base de datos antes del `?`: mongodb://<usuario>:<password>@host1,host2,host3/<nombre_db>?ssl=true&replicaSet=...
8. Pegar la string completa en el `.env` como valor de `MONGODB_URI`

### 4. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

---

## Autenticación

Las rutas de libros requieren un token JWT válido. Para obtenerlo:

1. Registrarse en `POST /api/auth/register`
2. Iniciar sesión en `POST /api/auth/login`
3. Usar el token en el header de cada request protegida:

```
Authorization: Bearer <token>
```

### Requisitos de contraseña

La contraseña debe tener al menos:

- 8 caracteres
- 1 letra mayúscula
- 1 número
- 1 carácter especial (@$!%\*?&.#\_-)

---

## Roles de usuario

- `user` → rol por defecto al registrarse
- `admin` → el primer usuario registrado es admin automáticamente

El token JWT incluye el rol del usuario y es verificado en cada request protegida.

### Crear usuario administrador

Por seguridad, el rol `admin` se asigna automáticamente al primer usuario registrado. Todos los demás usuarios reciben el rol `user`.

---

## Endpoints

### Autenticación (públicos)

| Método | Ruta                 | Descripción                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Registra un nuevo usuario      |
| POST   | `/api/auth/login`    | Inicia sesión y devuelve token |

### Libros (privados — rol user)

| Método | Ruta             | Descripción                              |
| ------ | ---------------- | ---------------------------------------- |
| GET    | `/api/books`     | Lista los libros del usuario autenticado |
| GET    | `/api/books/:id` | Obtiene un libro por ID                  |
| POST   | `/api/books`     | Crea un nuevo libro                      |
| PATCH  | `/api/books/:id` | Actualiza un libro                       |
| DELETE | `/api/books/:id` | Elimina un libro                         |

### Libros (privados — solo rol admin)

| Método | Ruta             | Descripción                                        |
| ------ | ---------------- | -------------------------------------------------- |
| GET    | `/api/books/all` | Lista todos los libros de todos los usuarios       |
| DELETE | `/api/books/:id` | Elimina cualquier libro (admin) o el propio (user) |

### Query params opcionales

| Param    | Ejemplo                | Descripción                        |
| -------- | ---------------------- | ---------------------------------- |
| `page`   | `?page=2`              | Número de página (default: 1)      |
| `limit`  | `?limit=5`             | Elementos por página (default: 10) |
| `sort`   | `?sort=desc`           | Ordenamiento por título (asc/desc) |
| `filter` | `?filter=genre:Terror` | Filtrado por campo:valor           |

---

## Ejemplos de requests

### Registro

```json
POST /api/auth/register

{
  "username": "marcelo",
  "email": "marcelo@gmail.com",
  "password": "Marcelo123!"
}
```

### Login

```json
POST /api/auth/login

{
  "email": "marcelo@gmail.com",
  "password": "Marcelo123!"
}
```

### Crear libro

```json
POST /api/books
Authorization: Bearer <token>

{
  "title": "Cien años de soledad",
  "price": 14000,
  "genre": "Realismo mágico",
  "pages": 471,
  "read": true
}
```

### Actualizar libro

```json
PATCH /api/books/:id
Authorization: Bearer <token>

{
  "price": 15000,
  "read": true
}
```

### Eliminar libro

```
DELETE /api/books/:id
Authorization: Bearer <token>
```

### Eliminar libro (admin — puede borrar cualquier libro)

```
DELETE /api/books/:id
Authorization: Bearer <token admin>
```

### Obtener libros con filtros (query params)

```
GET /api/books?page=1&limit=5&sort=desc&filter=genre:Fantasía
Authorization: Bearer <token>
```

### Obtener todos los libros (solo admin)

```
GET /api/books/all
Authorization: Bearer <token admin>
```

---

## Validación con Zod

Todos los endpoints validan los datos entrantes con Zod. Si los datos son inválidos, se devuelve un error 400 con detalles del campo y mensaje:

---

## Logger

El servidor registra cada request en la terminal con morgan:

---

## Colección Bruno

Bruno endpoints
Bruno GET
Bruno GET books
Bruno GET book
Bruno POST Create boo
Bruno PATCH Update book
Bruno DEL Delete book
Bruno POST Registe
Bruno POST Login
Bruno GET all books admin
Bruno GET all books user forbidden

La colección de pruebas se encuentra en la carpeta `Backend API REST/` en la raíz del proyecto.

---

## Deploy

No se realizó deploy. El proyecto puede ejecutarse localmente siguiendo las instrucciones de instalación.

---

Marcelo Walter Sosa
