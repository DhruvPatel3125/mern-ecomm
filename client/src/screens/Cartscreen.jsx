import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addtocart, deleteFromCart } from '../actions/cartAction'
import Checkout from '../components/Checkout'

export default function Cartscreen() {

    const cartreducerstate = useSelector((state) => state.cartReducer)
    const {cartItems} = cartreducerstate
    const dispatch = useDispatch()

    var subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) 
  return (
    <div>
        <div className="row mt-5 justify-content-center">
            <div className="col-md-8 card p-3">
                <h1 className='text-center mb-5'>Shopping Cart</h1>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>${item.price}</td>
                                <td>
                                    <select
                                        value={item.quantity}
                                        onChange={(e) => dispatch(addtocart(item, Number(e.target.value)))}
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>${item.quantity * item.price}</td>
                                <td>
                                    <i className='fa fa-trash' onClick={()=>dispatch(deleteFromCart(item._id))}></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr />
                <h2 className='text-center'>Subtotal: {subtotal} RS/-</h2>
                <hr />
                <Checkout amount={subtotal} />
            </div>
        </div>
    </div>
  )
}
