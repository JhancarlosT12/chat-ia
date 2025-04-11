// static/js/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
  const chatbotsList = document.getElementById('chatbotsList');
  const createNewBtn = document.getElementById('createNewBtn');
  const chatbotModal = new bootstrap.Modal(document.getElementById('chatbotModal'));
  const chatbotForm = document.getElementById('chatbotForm');
  const saveChatbotBtn = document.getElementById('saveChatbotBtn');
  const modalTitle = document.getElementById('modalTitle');
  
  let currentChatbotId = null;
  let isEditing = false;
  
  // Cargar lista de chatbots
  loadChatbots();
  
  // Event listeners
  createNewBtn.addEventListener('click', openCreateModal);
  saveChatbotBtn.addEventListener('click', saveChatbot);
  
  // Cargar chatbots desde la API
  async function loadChatbots() {
    try {
      const response = await fetch('/api/chatbots');
      const chatbots = await response.json();
      
      renderChatbots(chatbots);
    } catch (error) {
      console.error('Error al cargar chatbots:', error);
      showError('No se pudieron cargar los chatbots');
    }
  }
  
  // Renderizar la lista de chatbots
  function renderChatbots(chatbots) {
    chatbotsList.innerHTML = '';
    
    if (chatbots.length === 0) {
      chatbotsList.innerHTML = `
        <div class="col-12">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="bi bi-chat-dots"></i>
            </div>
            <h4>No tienes chatbots</h4>
            <p class="text-muted">Crea tu primer chatbot para comenzar</p>
            <button class="btn btn-primary" onclick="document.getElementById('createNewBtn').click()">
              <i class="bi bi-plus-lg"></i> Crear chatbot
            </button>
          </div>
        </div>
      `;
      return;
    }
    
    chatbots.forEach(chatbot => {
      const cardHtml = `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="chatbot-card">
            <div class="chatbot-card-header">
              <h5 class="chatbot-name">${escapeHtml(chatbot.name)}</h5>
              <div class="chatbot-actions">
                <div class="dropdown">
                  <button class="btn-action dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item edit-chatbot" href="#" data-id="${chatbot.id}">
                      <i class="bi bi-pencil me-2"></i> Editar
                    </a></li>
                    <li><a class="dropdown-item get-embed" href="#" data-id="${chatbot.id}">
                      <i class="bi bi-code-slash me-2"></i> Obtener código
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger delete-chatbot" href="#" data-id="${chatbot.id}">
                      <i class="bi bi-trash me-2"></i> Eliminar
                    </a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="chatbot-card-body">
              <div class="chatbot-info">
                <i class="bi bi-file-earmark-text"></i>
                <span>${escapeHtml(chatbot.document_name)}</span>
              </div>
              <div class="chatbot-info">
                <i class="bi bi-palette"></i>
                <span class="color-preview" style="background-color: ${chatbot.primary_color}"></span>
                <span>${chatbot.primary_color}</span>
              </div>
            </div>
            <div class="chatbot-card-footer">
              <a href="/chat/${chatbot.id}" class="btn btn-sm btn-primary" target="_blank">
                <i class="bi bi-chat-text me-1"></i> Probar chatbot
              </a>
              <button class="btn btn-sm btn-outline-secondary get-embed" data-id="${chatbot.id}">
                <i class="bi bi-code-slash me-1"></i> Integrar
              </button>
            </div>
          </div>
        </div>
      `;
      
      chatbotsList.innerHTML += cardHtml;
    });
    
    // Añadir event listeners a los botones
    document.querySelectorAll('.edit-chatbot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chatbotId = e.currentTarget.dataset.id;
        openEditModal(chatbotId);
      });
    });
    
    document.querySelectorAll('.delete-chatbot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chatbotId = e.currentTarget.dataset.id;
        if (confirm('¿Estás seguro de que deseas eliminar este chatbot?')) {
          deleteChatbot(chatbotId);
        }
      });
    });
    
    document.querySelectorAll('.get-embed').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chatbotId = e.currentTarget.dataset.id;
        getEmbedCode(chatbotId);
      });
    });
  }
  
  // Abrir modal para crear chatbot
  function openCreateModal() {
    modalTitle.textContent = 'Crear nuevo chatbot';
    chatbotForm.reset();
    document.getElementById('chatbotId').value = '';
    document.getElementById('primaryColor').value = '#007bff';
    isEditing = false;
    chatbotModal.show();
  }
  
  // Abrir modal para editar chatbot
  async function openEditModal(chatbotId) {
    try {
      modalTitle.textContent = 'Editar chatbot';
      
      const response = await fetch(`/api/chatbots/${chatbotId}`);
      const chatbot = await response.json();
      
      document.getElementById('chatbotName').value = chatbot.name;
      document.getElementById('primaryColor').value = chatbot.primary_color;
      document.getElementById('welcomeMessage').value = chatbot.welcome_message;
      document.getElementById('placeholderText').value = chatbot.placeholder_text;
      document.getElementById('chatbotId').value = chatbotId;
      
      isEditing = true;
      currentChatbotId = chatbotId;
      chatbotModal.show();
    } catch (error) {
      console.error('Error al cargar datos del chatbot:', error);
      showError('No se pudo cargar la información del chatbot');
    }
  }
  
  // Guardar chatbot (crear o actualizar)
  async function saveChatbot() {
    // Validar formulario
    if (!chatbotForm.checkValidity()) {
      chatbotForm.reportValidity();
      return;
    }
    
    const formData = new FormData();
    formData.append('document', document.getElementById('document').files[0]);
    
    try {
      let documentId;
      
      // Si estamos editando y no se seleccionó un nuevo documento, usamos el existente
      if (isEditing && document.getElementById('document').files.length === 0) {
        const chatbotResponse = await fetch(`/api/chatbots/${currentChatbotId}`);
        const chatbotData = await chatbotResponse.json();
        documentId = chatbotData.document_id;
      } else {
        // Subir documento
        const documentResponse = await fetch('/api/upload-document/', {
          method: 'POST',
          body: formData
        });
        
        if (!documentResponse.ok) {
          const error = await documentResponse.json();
          throw new Error(error.detail || 'Error al subir el documento');
        }
        
        const documentData = await documentResponse.json();
        documentId = documentData.document_id;
      }
      
      // Datos del chatbot
      const chatbotData = {
        name: document.getElementById('chatbotName').value,
        document_id: documentId,
        primary_color: document.getElementById('primaryColor').value,
        welcome_message: document.getElementById('welcomeMessage').value,
        placeholder_text: document.getElementById('placeholderText').value
      };
      
      // Crear o actualizar chatbot
      const url = isEditing ? `/api/chatbots/${currentChatbotId}` : '/api/chatbots/';
      const method = isEditing ? 'PUT' : 'POST';
      
      const chatbotResponse = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chatbotData)
      });
      
      if (!chatbotResponse.ok) {
        const error = await chatbotResponse.json();
        throw new Error(error.detail || 'Error al guardar el chatbot');
      }
      
      chatbotModal.hide();
      loadChatbots(); // Recargar lista
      
    } catch (error) {
      console.error('Error:', error);
      showError(error.message);
    }
  }
  
  // Eliminar chatbot
  async function deleteChatbot(chatbotId) {
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al eliminar el chatbot');
      }
      
      loadChatbots(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
      showError(error.message);
    }
  }
  
  // Obtener código de integración
  async function getEmbedCode(chatbotId) {
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}/embed`);
      const data = await response.json();
      
      // Crear modal para mostrar el código
      const modalHtml = `
        <div class="modal fade" id="embedModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Código de integración</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Copia el siguiente código y pégalo en tu sitio web donde quieras que aparezca el widget del chatbot:</p>
                <div class="embed-code">
                  <pre>${escapeHtml(data.embed_code)}</pre>
                  <button class="copy-btn" onclick="copyEmbedCode()">Copiar</button>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Eliminar modal anterior si existe
      const oldModal = document.getElementById('embedModal');
      if (oldModal) {
        oldModal.remove();
      }
      
      // Añadir modal al DOM y mostrarlo
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      // Función para copiar código
      window.copyEmbedCode = function() {
        const embedCode = data.embed_code;
        navigator.clipboard.writeText(embedCode).then(() => {
          const copyBtn = document.querySelector('.copy-btn');
          copyBtn.textContent = '¡Copiado!';
          setTimeout(() => {
            copyBtn.textContent = 'Copiar';
          }, 2000);
        });
      };
      
      const embedModal = new bootstrap.Modal(document.getElementById('embedModal'));
      embedModal.show();
    } catch (error) {
      console.error('Error al obtener código de integración:', error);
      showError('No se pudo obtener el código de integración');
    }
  }
  
  // Mostrar mensaje de error
  function showError(message) {
    const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    
    document.querySelector('.container').insertAdjacentHTML('afterbegin', alertHtml);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      const alert = document.querySelector('.alert');
      if (alert) {
        alert.remove();
      }
    }, 5000);
  }
  
  // Escapar HTML para evitar XSS
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});