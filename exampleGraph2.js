const epsilon = '\0'

const aGraph = [
    {
        id: 0,
        links:[
            {
                to: 1,
                value: epsilon,
            },
        ]
    },
    {
        id: 1,
        links:[
            {
                to: 1,
                value: 'a',
            },
            {
                to: 2,
                value: 'a',
            },
            {
                to: 1,
                value: 'b',
            }
        ]
    },
    {
        id: 2,
        links:[
            {
                to: 3,
                value: 'b',
            }
        ]
    },
    {
        id: 3,
        links:[
            {
                to: 4,
                value: 'b',
            }
        ]
    },
    {
        id: 4,
        links:[
        ]
    },
  
]

export default aGraph