import React from 'react'
import { Link } from 'react-router-dom'
import { IconTerminal } from '../icons'

export default function TaskBadge({task}) {
    return (
        <Link to={"/tasks/" + task.id} className='flex items-center w-56'>
            <IconTerminal styling='text-gray-800 mr-2' />
            <span className=' flex-1 text-red-500 font-medium text-sm'>{task.name}</span>
        </Link>
    )
}