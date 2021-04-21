const epsilon = '\0'

const aGraph = [
    {
        name: 0,
        links:[
            {
                to: 1,
                value: epsilon,
            },
        ]
    },
    {
        name: 1,
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
        name: 2,
        links:[
            {
                to: 3,
                value: 'b',
            }
        ]
    },
    {
        name: 3,
        links:[
            {
                to: 4,
                value: 'b',
            }
        ]
    },
    {
        name: 4,
        links:[
        ]
    },
  
]

export default aGraph