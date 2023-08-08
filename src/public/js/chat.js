const socket = io()
const messages = document.querySelector('#messages')
const inputMsg = document.querySelector('#inputMsg')
const inputSubmit = document.querySelector('#inputSubmit')

messages.innerHTML = ''
let currentMessages = []

socket.on('chat-messages', (messagesList) => {
    currentMessages = messagesList
})

const addMessage = (user, msg) => {
    const div = document.createElement('div')
    
    div.innerHTML = `
        <div class='message alert alert-info rounded text-dark p-2 mb-1'>
            <strong class='fs-4'>${user}</strong>: ${msg}
        </div>
    `

    messages.appendChild(div)

    setTimeout(() => {
        messages.scrollTo(0, messages.scrollHeight)
    },250)
}

Swal.fire({
    title: 'Ingresa tu usuario',
    input: 'text',
    inputAttributes: {
        autocapitalize: 'off'
    },
    showCancelButton: false,
    confirmButtonText: 'Enviar',
    showLoaderOnConfirm: true,
    preConfirm: (inputUsername) => {
        return new Promise((resolve) => {
            if (!inputUsername) {
                Swal.showValidationMessage('No se ingreso un usuario!');
                resolve();
            } else {
                username = inputUsername.toUpperCase(); 
                Swal.fire(
                    `Bienvenido,${username}, al chat de BEYOND GAMES!`,
                    'Tu usuario ha sido creado.',
                    'success'
                );
                resolve(username);
            }
        });
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(({ value }) => {
    username = value

    for(const { user, message } of currentMessages) {
        addMessage(user, message)
    }

    socket.on('chat-message', ({user, message}) => {
        addMessage(user, message)
    })

    inputSubmit.addEventListener('click', (e) => {
        e.preventDefault()
        const value = inputMsg.value

        if(!value){
            return
        }

        const msg = {user: username, message: value}
        socket.emit('chat-message', msg)

        inputMsg.value = ''
        
        addMessage(username, value)
    })
})
