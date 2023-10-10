import { Spin } from 'antd'

const Loading = () => {
    return (
        <div
            style={{
                position: 'fixed',
                background: 'rgba(0,0,0,0.5)',
                height: '100%',
                width: '100%',
                zIndex: 1001,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Spin size="large" />
                <span style={{ fontSize: 20, color: '#fff' }}>Loading...</span>
            </div>
        </div>
    )
}

export default Loading