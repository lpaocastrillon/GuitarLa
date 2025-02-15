
import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'

export const useCart =() => {

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

    //state Derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart])

    //Array method - reduce
    const cartTotal = useMemo( () => cart.reduce( (total, item ) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}