import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getAllUser } from '../actions/userAction'

export default function UsersList() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllUser())
  }, [dispatch])

  return (
    <div>
      <h1>User List</h1>
    </div>
  )
}
 