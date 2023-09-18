'use client'
import Sidebar from '../../components/Sidebar'
import DynamicBreadcrumb from '../../components/DynamicBreadcrumb'
import UserRolesTable from '../../components/Users/UserRolesTable'

export default function ManageUsersPage() {
    return (
        <>
            <Sidebar />
            <div>
                <div style={{ marginLeft: '300px' }}>
                    {' '}
                    <DynamicBreadcrumb />
                </div>
                <UserRolesTable />
            </div>
        </>
    )
}
