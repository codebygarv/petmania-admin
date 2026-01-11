import React from 'react'
import InputField from '../components/InputField'

const Components = () => {
    return (
        <div className='max-w-7xl mx-auto min-h-screen mt-1'>
            <div className='bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-md'>
                <div >
                    <h2 className='text-lg font-semibold text-[#f9f9f9] mb-1'>Inputs</h2>
                    <div className='mt-4 max-w-sm'>
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="enter your email"
                            className="text-sm py-2"
                        />
                    </div>

                    <div className='mt-6 max-w-sm'>
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="enter your password"
                            className="text-sm py-2"
                        />
                    </div>

                    <form className="mt-6">
                        <div className='max-w-sm'>
                            <InputField
                                label="Username"
                                name="username"
                                type="text"
                                placeholder="enter your username"
                                className="text-sm py-2"
                            />
                        </div>
                        <div className='mt-4 max-w-sm'>
                            <InputField
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                placeholder="enter your phone number"
                                className="text-sm py-2"
                            />
                        </div>
                        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Submit
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Components