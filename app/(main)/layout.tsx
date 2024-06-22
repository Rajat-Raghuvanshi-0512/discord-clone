import NavigationSidebar from '@/components/navigation/NavigationSidebar'
import React, { FC } from 'react'

interface IProps {
    children: React.ReactNode
}

const MainLayout: FC<IProps> = ({children}) => {
  return (
    <div className='h-full'>
        <div className='hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0'>
            <NavigationSidebar/>
        </div>
        <main className='md:pl-[72px] h-full'>{children}</main>
    </div>
  )
}

export default MainLayout