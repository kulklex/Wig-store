import React from 'react'
import AdminProductList from './AdminProductsPage'
import AdminOrdersPage from './AdminOrdersPage'
import AdminUsersPage from './AdminUsersPage'

export default function AdminManageProduct() {
  return (
    <div>
        <AdminProductList />
        <AdminOrdersPage />
        <AdminUsersPage/>
    </div>
  )
}
