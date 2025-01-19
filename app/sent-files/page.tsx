import React from 'react'
import Header from '@/components/Header';
import SentFile from '../components/SentFiles';

function SentFiles() {
return (
        <div>
                <div className="sticky top-0 z-50">
                    <Header/>
                </div>
            <div>
                Sent-files
            </div>

            <div>
                <SentFile />
            </div>
        </div>
    )
}

export default SentFiles