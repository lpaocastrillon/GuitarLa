import { useState, useEffect } from 'react'
import Header from './components/Header'
import Guitar from './components/Guitar'
import { db } from './data/bd'

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  //State
  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MIN_ITEMS = 1
  const MAX_ITEMS = 5

  //meaning cada que el cart cambie ejecuta el locastorage, en automatico se encarga de actualizar el state
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])
  
  function addToCart(item){
    //que significa la inmutabilidad en react
    const itemExist = cart.findIndex(guitar => guitar.id === item.id)
    if(itemExist >= 0){
      if(cart[itemExist].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart]
      updatedCart[itemExist].quantity++
      setCart(updatedCart)
    }else{
      item.quantity = 1
      setCart([...cart, item])  
    }
  }

  function removeFromCart(id){
    //get value prev from cart, luego accedemos al arreglo
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))    
  }

  function decreaseQuantity(id){
    const updateCart = cart.map(item => {
      if(item.id === id && item.quantity > MIN_ITEMS){
        return {
          ...item,
          quantity: item.quantity -1
        }
      }
      return item
    })

    setCart(updateCart)
  }

  function increaseQuantity(id){
    // like a create new copy in updateCart
    const updatedCart = cart.map(item => {
      if(item.id === id && item.quantity < MAX_ITEMS){
        return {
          ...item, // retorna todo como esta pero la cantidad si la modifica, si no dejamos item solo retornara quantity
          quantity: item.quantity +1
        }
      }
      return item
    })   

    setCart(updatedCart)
  }

  function clearCart(e){
    setCart([]);
  }

  return (
    <>
      <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        clearCart={clearCart}     
      />
    
      <main className="container-xl mt-5">
          <h2 className="text-center">Nuestra Colección</h2>

          <div className="row mt-5">
            {data.map((guitar) =>(
              <Guitar
                key={guitar.id}
                guitar={guitar}
                setCart={setCart}
                addToCart={addToCart}
              />
            ))}
              
          </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
          <div className="container-xl">
              <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
          </div>
      </footer>
    </>
  )
}

export default App
