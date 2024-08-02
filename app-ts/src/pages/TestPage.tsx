import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const TestPage: React.FC = () => {
    return (
        <div className='vw-100 vh-100 d-flex flex-column'>
            <Navbar />
            <div className="d-flex flex-grow-1">
                <div className="d-flex flex-column">
                    <Sidebar initialActiveItem="Dashboard"/>
                </div>
                <div className="flex-grow-1 d-flex flex-column my-0 h-100">
                    <h1 className="my-5 pt-5 text-center">Test Page</h1>
                    <p>This is a test page ss</p>
                </div>
            </div>
        </div>
    )
}
export default TestPage;