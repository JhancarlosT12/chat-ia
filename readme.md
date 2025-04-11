# DocumentChat

Un chatbot inteligente para tus documentos, impulsado por IA.

## Características

- 📄 Carga documentos PDF, DOCX y TXT
- 💬 Crea chatbots personalizados para cada documento
- 🤖 Respuestas inteligentes mediante la API de DeepSeek
- 🔍 Búsqueda precisa de información en tus documentos
- 🎨 Personaliza la apariencia de tu chatbot
- 🔌 Integra fácilmente el chatbot en tu sitio web

## Requisitos

- Python 3.9 o superior
- Cuenta en DeepSeek para obtener una API key

## Configuración

1. Clona este repositorio:
   ```
   git clone https://github.com/tu-usuario/document-chat.git
   cd document-chat
   ```

2. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

3. Configura las variables de entorno:
   ```
   export DEEPSEEK_API_KEY="tu_api_key_de_deepseek"
   export BASE_URL="http://localhost:8000"
   ```

   Si utilizas Windows, usa:
   ```
   set DEEPSEEK_API_KEY=tu_api_key_de_deepseek
   set BASE_URL=http://localhost:8000
   ```

4. Inicia la aplicación:
   ```
   uvicorn app:app --reload
   ```

5. Abre tu navegador en `http://localhost:8000`

## Uso

1. **Sube un documento**: PDF, DOCX o TXT.
2. **Personaliza tu chatbot**: Configura el nombre, color y mensajes.
3. **Prueba tu chatbot**: Haz preguntas sobre el contenido de tu documento.
4. **Integra el chatbot**: Copia el código de integración en tu sitio web.

## Estructura del proyecto

```
document-chat/
├── app.py               # Aplicación principal FastAPI
├── requirements.txt     # Dependencias del proyecto
├── static/              # Archivos estáticos (CSS, JS)
│   ├── css/             
│   │   ├── main.css     # Estilos generales
│   │   └── dashboard.css # Estilos del dashboard
│   └── js/
│       └── dashboard.js  # Lógica del dashboard
└── uploads/             # Directorio para archivos subidos
```

## Despliegue en Railway

Este proyecto está configurado para ser desplegado fácilmente en Railway:

1. Crea una cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno:
   - `DEEPSEEK_API_KEY`: Tu clave API de DeepSeek
   - `BASE_URL`: La URL de tu aplicación desplegada

## Tecnologías utilizadas

- **Backend**: FastAPI, PyPDF2, python-docx
- **Frontend**: HTML, CSS, JavaScript
- **IA**: API de DeepSeek
- **Despliegue**: Railway

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir lo que te gustaría cambiar o añadir.

## Licencia

[MIT](LICENSE)
