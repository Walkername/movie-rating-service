
export default function AuthPopup({ setIsModalOpen }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#ff4444', marginBottom: '15px' }}>Authorization Error</h2>
                <p>To perform this action you need to be authenticated</p>
                <div style={{ margin: '15px 0' }}>
                    <div>You can <a href="/register">register</a> or <a href="/login">login</a></div>
                </div>
                <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                        backgroundColor: 'rgb(161, 161, 161)',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}