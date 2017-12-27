export default {
    canvas: {
        id: '00001',
        width: 800,
        height: 600,
        layers: 3,
        backgroundColor: '#ffffff',
        snapshots: ['', '', '']
    },
    history: [
        {
            id: '11111',
            canvasID: '00001',
            timestamp: 1502915115272,
            username: 'username',
            toolName: 'pencil',
            path: [
                {
                    x: 0,
                    y: 0
                },
                {
                    x: 100,
                    y: 100
                }
            ],
            settings: {
                layer: 0,
                strokeStyle: '#000000',
                fillStyle: '#ffffff',
                lineWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
                globalCompositeOperation: 'source-over',
                primary: true,
                sendUpdates: true
            }
        }
    ],
    users: [
        {
            username: 'username',
            canvasID: '00001',
            mousePosition: {
                x: 100,
                y: 100
            }
        }
    ],
    newEntry: {
        id: '11112',
        canvasID: '00001',
        timestamp: 1502915833263,
        username: 'username',
        toolName: 'pencil',
        path: [
            {
                x: 100,
                y: 100
            },
            {
                x: 200,
                y: 0
            }
        ],
        settings: {
            layer: 1,
            strokeStyle: '#000000',
            fillStyle: '#ffffff',
            lineWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation: 'source-over',
            primary: true,
            sendUpdates: true
        }
    },
    newUser: {
        username: 'secondUser',
        canvasID: '00002',
        mousePosition: {
            x: 50,
            y: 50
        }
    },
    updatedUser: {
        username: 'username',
        canvasID: '00001',
        mousePosition: {
            x: 200,
            y: 0
        }
    }
};