    fetch('api.json')
    .then((resp) => resp.json() )
    .then((data) => {
    let destino = document.getElementById('contenedor')
    for(elemento of data){
        let nuevoEle = document.createElement('div')
        nuevoEle.style = 'width: 18rem'
        nuevoEle.className = 'card'
        nuevoEle.innerHTML =  ` <img src="${elemento.imagen}" class="card-img-top" alt="${elemento.title}">
                                <div class="card-body">
                                    <h4 class="card-title">${elemento.title}</h4>
                                    <p class="card-text precio fs-5">$${elemento.precio}</p>
                                    <button href="#" class="btn btn-Novo button">Agregar al carrito</button>
                                </div>
                                `
        destino.append(nuevoEle)

    }
    })
    
    let carrito = [];
    const clickbutton = document.querySelectorAll('.button');
    const tBody = document.querySelector('.tBody');

//Funcion de interaccion

    clickbutton.forEach(btn => {
        btn.addEventListener('click',tomarArticulo) 
        
    })
    
//Funcion para tomar articulo

    function tomarArticulo(e){ 
        const button = e.target
        const item = button.closest('.card')
        const itemTitle = item.querySelector('.card-title').textContent;
        const itemPrice = item.querySelector('.precio').textContent;
        const itemImg = item.querySelector('.card-img-top').src;
       
        const newItem = {
           title: itemTitle,
           precio: itemPrice,
           img: itemImg,
           cantidad: 1,
           
        }

        modificarCantidad(newItem);
        Toastify({
            text: 'Has sumado tu zapatilla al carrito de compras',
            position:'right',
            gravity:'top',
            style: {
                background: 'linear-gradient(90deg, rgba(95,255,0,0.8855917366946778) 0%, rgba(193,255,49,1) 49%, rgba(95,255,0,0.8995973389355743) 100%)'
            }
          }).showToast();
          
    }
    
//Funcion para modificar cantidad de articulos
    const inputElemnto = tBody.getElementsByClassName('input__elemento')
    function modificarCantidad(newItem){ 
    for(let i =0; i < carrito.length ; i++){
        if(carrito[i].title.trim() === newItem.title.trim()){
            carrito[i].cantidad ++;
            const inputValue = inputElemnto[i]
            inputValue.value++;
        carritoTotal()
        return null;
        }
    }
    carrito.push(newItem)
    agregarCarrito() 
    }

//Funcion para agregar articulos al carrito

    function agregarCarrito(){  
        tBody.innerHTML = ''
        carrito.map(item =>{
            const tr = document.createElement('tr')
            tr.className = 'itemCarrito'
            const Content = `                      
            <th scope="row">1</th>
            <td class="table__productos">
              <img class="card-img-top" src=${item.img} alt="${item.title}">
              <h5 class="title">${item.title}</h5>
            </td>
            <td class="table__price">
              <p>${item.precio}</p>
            </td>
            <td class="table__cantidad">
            <input type="number" min="1" value=${item.cantidad} class="input__elemento">
            <button class="delete btn btn-danger">x</button>
            </td>
            `
        tr.innerHTML = Content;
        tBody.append(tr)

        tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
        tr.querySelector(".delete").addEventListener('click', eliminarItemCarrito) 
    })
    carritoTotal()
    }

    
    
//Funcion para calcular el total del carrito de compras

    function carritoTotal(){
        let Total = 0;
        const itemCartTotal = document.querySelector('.itemCartTotal')
        carrito.forEach((item) => {
            const precio = Number(item.precio.replace("$", ''))
            Total = Total + precio*item.cantidad
        })

        itemCartTotal.innerHTML = `Total $${Total}`
        agregarLocalStorage() 
    }
    
 //Funcion para eliminar Item del carrito de compras   

    function eliminarItemCarrito(e){
        const buttonDelete = e.target
        const tr = buttonDelete.closest(".itemCarrito")
        const title = tr.querySelector('.title').textContent;
        for(let i=0; i<carrito.length ; i++){
      
          if(carrito[i].title.trim() === title.trim()){
            carrito.splice(i, 1)
          }
        }
        tr.remove()
        carritoTotal()
      }

 //Funcion para sumar cantidad directamente del carrito 

    function sumaCantidad(e){
        const sumaInput  = e.target
        const tr = sumaInput.closest(".itemCarrito")
        const title = tr.querySelector('.title').textContent;
        carrito.forEach(item => {
          if(item.title.trim() === title){
            sumaInput.value < 1 ?  (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            carritoTotal()
          }
        })
      }
      
    //Funcion para almacenar en Local Storage

    function agregarLocalStorage(){ 
        localStorage.setItem('carrito', JSON.stringify(carrito))
    }

    window.onload = function(){
        const storage = JSON.parse(localStorage.getItem('carrito'));
        if(storage){
      carrito = storage;
      agregarCarrito()  
        }
    }
