import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import React from 'react'

const Users = () => {
    return (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow text-white">
            {/* Basic table info div  */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Application All register Users</h3>
                    {/* <p className="text-gray-500 text-sm">USers </p> */}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        className="bg-white/3 placeholder-gray-400 text-sm px-3 py-2 rounded-md outline-none border border-white/8 w-[300px]"
                    />
                    <button
                        className="px-3 py-2 bg-orange-600/90 text-white rounded-md text-sm hover:opacity-95"
                    >
                        Export
                    </button>
                </div>
            </div>

            {/* Actual Table  */}
            <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-sm'>
                    <thead>
                        <tr className="text-xs text-gray-400">
                            <th className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                    Name
                                </div>
                            </th>

                            <th className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                    Email
                                </div>
                            </th>

                            <th className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                    Verification Status
                                </div>
                            </th>

                            <th className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                    Register Date
                                </div>
                            </th>

                            <th className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                    Change Pasword Count
                                </div>
                            </th>

                            <th className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                    Actions
                                </div>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default Users