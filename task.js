const apiUrl = 'http://localhost:8080/tasks';  // URL de la API en el backend
let taskIdToUpdate = null; // Variable para almacenar el ID de la tarea a actualizar

// Función para obtener todas las tareas
async function obtenerTareas() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        const tareas = await response.json();
        mostrarTareas(tareas);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
    }
}

// Función para mostrar las tareas en la tabla
function mostrarTareas(tareas) {
    const contenedor = document.querySelector('#tasksTable tbody');
    contenedor.innerHTML = ''; // Limpiar la tabla antes de agregar las nuevas tareas

    tareas.forEach(tarea => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${tarea.id}</td>
            <td>${tarea.title}</td>
            <td>${tarea.description}</td>
            <td>${tarea.expiration_date}</td>
            <td>
                <button onclick="editarTarea(${tarea.id})">Editar</button>
                <button onclick="eliminarTarea(${tarea.id})">Eliminar</button>
            </td>
        `;

        contenedor.appendChild(row);
    });
}

// Función para crear una nueva tarea
async function crearTarea() {
    const title = document.getElementById('newTitle').value;
    const description = document.getElementById('newDescription').value;
    const expirationDate = document.getElementById('newExpirationDate').value;

    // Validación de campos
    if (!title || !description || !expirationDate) {
        alert('Por favor ingrese todos los campos');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, expiration_date: expirationDate })
        });

        if (!response.ok) {
            throw new Error('Error al crear la tarea: ' + response.status);
        }

        alert('Tarea creada con éxito');
        obtenerTareas(); // Recargar las tareas después de crear
        // Redirigir a index.html después de crear
        window.location.href = 'index.html';  // Aquí rediriges a index.html
    } catch (error) {
        console.error('Error al crear la tarea:', error);
    }
}

// Función para actualizar una tarea existente
async function actualizarTarea() {
    if (taskIdToUpdate === null) {
        alert('Por favor, seleccione una tarea para actualizar');
        return;
    }

    const title = document.getElementById('updateTitle').value;
    const description = document.getElementById('updateDescription').value;
    const expirationDate = document.getElementById('updateExpirationDate').value;

    // Validación de campos
    if (!title || !description || !expirationDate) {
        alert('Por favor ingrese todos los campos');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${taskIdToUpdate}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, expiration_date: expirationDate })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la tarea: ' + response.status);
        }

        alert('Tarea actualizada con éxito');
        obtenerTareas(); // Recargar las tareas después de actualizar
        resetForm(); // Limpiar el formulario
        window.location.href = 'index.html';  // Aquí rediriges a index.html
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
    }
}

// Función para eliminar una tarea
async function eliminarTarea(id) {
    if (!id) {
        alert('Por favor ingrese el ID de la tarea a eliminar');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la tarea: ' + response.status);
        }

        alert('Tarea eliminada con éxito');
        obtenerTareas(); // Recargar las tareas después de eliminar
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
    }
}

// Función para cargar los datos cuando la página se carga
window.onload = obtenerTareas;

// Asignar eventos a los botones
document.getElementById('createTask').addEventListener('click', crearTarea);
document.getElementById('updateTaskBtn').addEventListener('click', actualizarTarea);

// Función para editar tarea (llenar los campos con los datos de la tarea a editar)
function editarTarea(id) {
    // Obtener la tarea de la API por ID
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(tarea => {
            taskIdToUpdate = tarea.id; // Guardar el ID de la tarea seleccionada
            document.getElementById('updateTitle').value = tarea.title;
            document.getElementById('updateDescription').value = tarea.description;
            document.getElementById('updateExpirationDate').value = tarea.expiration_date;
        })
        .catch(error => console.error('Error al cargar la tarea:', error));
}

// Función para resetear el formulario después de actualizar
function resetForm() {
    document.getElementById('updateTitle').value = '';
    document.getElementById('updateDescription').value = '';
    document.getElementById('updateExpirationDate').value = '';
    taskIdToUpdate = null; // Limpiar el ID de la tarea
}